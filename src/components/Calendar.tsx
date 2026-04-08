"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, StickyNote, X, Check, FileText, Hash, Image as ImageIcon, Video, Palmtree, Briefcase, BookOpen, RefreshCw, Server, FileEdit } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { ALL_HOLIDAYS } from "./UpcomingHolidays";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS_FULL = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

const TUF_COURSES = [
  { title: "Strivers A2Z DSA Course", videoId: "rZ41y93P2Qo", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" },
  { title: "Strivers SDE Sheet", videoId: "WNtzUR_MwUQ", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0p4ozDR_kJJkONnb1wdx2Ma" },
  { title: "Placement Series", videoId: "A5VKgyXFxzk", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oSO572kQ7KCSvCUh1AdILj" },
  { title: "Tree Series", videoId: "YqMNl6pRJLg", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJk8Vk" },
  { title: "Graph Series", videoId: "M3_pLsDdeuU", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3Xt5SxP3HR_PbjKNIGYR" },
  { title: "Dynamic Programming", videoId: "FfXoiwwnxFw", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY" },
  { title: "Recursion & Backtracking", videoId: "Hdr64lKQ3e4", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9" },
  { title: "Binary Search Series", videoId: "W9QJ8HaRvJQ", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0pMFMWuuvDNMAkoQFi-h0ZF" },
];

function getThumbnailUrl(videoId: string, quality: "maxres" | "sd" | "hq" = "hq") {
  const map = { maxres: "maxresdefault", sd: "sddefault", hq: "hqdefault" };
  return `https://i.ytimg.com/vi/${videoId}/${map[quality]}.jpg`;
}

const STATIC_HERO_IMG = "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=1200";

const FALLBACK_BG = "linear-gradient(135deg, #E11D48 0%, #080808 60%)";

const SUGGESTED_TAGS = ["DSA", "Revision", "Interview", "System Design", "Mock"];

interface NoteEntry {
  id: string;
  text: string;
  rangeLabel: string;
  days: string[]; // format: "YYYY-MM-DD"
  timestamp: number;
  tags?: string[]; // Optional tags array
}

function dateKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function rangeDateKeys(start: Date, end: Date): string[] {
  const keys: string[] = [];
  const d = new Date(start);
  while (d <= end) {
    keys.push(dateKey(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setDate(d.getDate() + 1);
  }
  return keys;
}

// ─── Save Confirmation Dialog ────────────────────────────────────────
function SaveDialog({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-brand-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-brand-black border-2 border-brand-red p-6 sm:p-8 max-w-sm w-full animate-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-brand-red/20 border-2 border-brand-red flex items-center justify-center">
            <Check className="text-brand-red" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-brand-white mb-1">Note Saved</h3>
            <p className="text-xs text-brand-white/40">Your note has been saved to local storage.</p>
          </div>
        </div>
        <button onClick={onClose} className="absolute top-3 right-3 text-brand-white/30 hover:text-brand-red transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── All Notes Dialog (Popup) ────────────────────────────────────────
function AllNotesDialog({
  open,
  onClose,
  notes,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  notes: NoteEntry[];
  onDelete: (id: string) => void;
}) {
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const s = new Set<string>();
    notes.forEach(n => n.tags?.forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return filterTag ? notes.filter(n => n.tags?.includes(filterTag)) : notes;
  }, [filterTag, notes]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-brand-black border-2 border-brand-border w-full max-w-2xl max-h-[85vh] flex flex-col animate-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-brand-border shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="text-brand-red" size={16} />
            <h2 className="text-sm font-black uppercase tracking-widest text-brand-white">All Notes</h2>
            <span className="text-[10px] font-bold text-brand-white/30 bg-brand-white/5 px-2 py-0.5 rounded-full">{filteredNotes.length}</span>
          </div>
          <button onClick={onClose} className="p-1 border border-brand-border hover:border-brand-red hover:text-brand-red transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Filter Bar */}
        {allTags.length > 0 && (
          <div className="p-3 px-4 sm:px-5 border-b border-brand-border flex gap-2 flex-wrap items-center bg-brand-white/[0.02] shrink-0">
            <Hash size={12} className="text-brand-white/30 mr-1" />
            <button
              onClick={() => setFilterTag(null)}
              className={cn("text-[9px] px-2 py-1 uppercase tracking-widest font-bold transition-colors", !filterTag ? "bg-brand-red text-brand-white" : "border border-brand-border text-brand-white/50 hover:text-brand-white")}
            >All</button>
            {allTags.map(t => (
              <button
                key={t}
                onClick={() => setFilterTag(t === filterTag ? null : t)}
                className={cn("text-[9px] px-2 py-1 uppercase tracking-widest font-bold transition-colors", t === filterTag ? "bg-brand-red text-brand-white" : "border border-brand-border text-brand-white/50 hover:text-brand-white")}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-y-auto p-4 sm:p-5 space-y-4">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <StickyNote className="mx-auto text-brand-white/10 mb-3" size={32} />
              <p className="text-xs text-brand-white/30 uppercase tracking-widest font-bold">No notes found</p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <div key={note.id} className="border-l-2 border-brand-red pl-3 sm:pl-4 py-2 group hover:bg-brand-white/[0.02] transition-colors relative">
                <div className="pr-6">
                  <div className="text-[10px] font-bold text-brand-red uppercase tracking-widest">{note.rangeLabel}</div>
                  <p className="text-xs sm:text-sm text-brand-white/80 mt-1.5 break-words leading-relaxed whitespace-pre-wrap">{note.text}</p>

                  {/* Note Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex gap-1.5 mt-2.5 flex-wrap">
                      {note.tags.map(t => (
                        <span key={t} className="text-[9px] uppercase font-bold text-brand-white/60 bg-brand-border/50 px-1.5 py-0.5">#{t}</span>
                      ))}
                    </div>
                  )}

                  <div className="text-[9px] text-brand-white/20 mt-2.5 font-bold uppercase tracking-widest">
                    {new Date(note.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <button
                  onClick={() => onDelete(note.id)}
                  className="absolute top-2 right-2 text-brand-white/20 hover:text-brand-red transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Day Note Popover ────────────────────────────────────────────────
function DayNotePopover({
  notes,
  onClose,
  onDelete,
}: {
  notes: NoteEntry[];
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-brand-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-brand-black border-2 border-brand-border p-4 sm:p-6 max-w-md w-full max-h-[60vh] overflow-y-auto animate-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 border-b border-brand-border pb-3">
          <div className="flex items-center gap-2">
            <StickyNote className="text-brand-red" size={14} />
            <h3 className="text-xs font-black uppercase tracking-widest text-brand-white">Notes for this date</h3>
          </div>
          <button onClick={onClose} className="text-brand-white/30 hover:text-brand-red transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className="border-l-2 border-brand-red pl-3 py-1 group relative">
              <div className="pr-6">
                <div className="text-[10px] font-bold text-brand-red uppercase tracking-widest">{note.rangeLabel}</div>
                <p className="text-xs text-brand-white/80 mt-1 break-words whitespace-pre-wrap">{note.text}</p>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {note.tags.map(t => (
                      <span key={t} className="text-[8px] uppercase font-bold text-brand-white/60 bg-brand-border/50 px-1 py-0.5">#{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                className="absolute top-1 right-1 text-brand-white/20 hover:text-brand-red transition-colors"
                title="Delete Note"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// ─── Main Calendar Component ─────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════
export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [noteText, setNoteText] = useState("");
  const [noteTags, setNoteTags] = useState<string[]>([]);
  const [savedNotes, setSavedNotes] = useState<NoteEntry[]>([]);

  // UI state
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [notesTabOpen, setNotesTabOpen] = useState(false);
  const [dayPopoverNotes, setDayPopoverNotes] = useState<NoteEntry[] | null>(null);

  // Hero
  const [heroMode, setHeroMode] = useState<"video" | "image">("image");
  const [heroIndex, setHeroIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setHeroIndex(Math.floor(Math.random() * TUF_COURSES.length));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % TUF_COURSES.length);
      setImgLoaded(false);
      setImgError(false);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  // Load notes
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tuf-v3-notes");
      if (raw) setSavedNotes(JSON.parse(raw));
    } catch { }
  }, []);

  const persistNotes = (notes: NoteEntry[]) => {
    setSavedNotes(notes);
    try { localStorage.setItem("tuf-v3-notes", JSON.stringify(notes)); } catch { }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  // Range logic
  const handleDayClick = useCallback((day: number) => {
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    const clicked = new Date(year, month, day);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(clicked);
      setRangeEnd(null);
    } else {
      setRangeEnd(clicked);
    }
  }, [rangeStart, rangeEnd, year, month]);

  const clearRange = () => { setRangeStart(null); setRangeEnd(null); };

  const rangeLow = useMemo(() => {
    if (!rangeStart) return null;
    if (!rangeEnd) return rangeStart;
    return rangeStart <= rangeEnd ? rangeStart : rangeEnd;
  }, [rangeStart, rangeEnd]);

  const rangeHigh = useMemo(() => {
    if (!rangeStart) return null;
    if (!rangeEnd) return rangeStart;
    return rangeStart <= rangeEnd ? rangeEnd : rangeStart;
  }, [rangeStart, rangeEnd]);

  const isRangeStart = (day: number) => {
    if (!rangeLow) return false;
    return rangeLow.getDate() === day && rangeLow.getMonth() === month && rangeLow.getFullYear() === year;
  };
  const isRangeEnd = (day: number) => {
    if (!rangeHigh || !rangeEnd) return false;
    return rangeHigh.getDate() === day && rangeHigh.getMonth() === month && rangeHigh.getFullYear() === year;
  };
  const isInRange = (day: number) => {
    if (!rangeLow || !rangeHigh || rangeLow.getTime() === rangeHigh.getTime()) return false;
    const d = new Date(year, month, day).getTime();
    return d > rangeLow.getTime() && d < rangeHigh.getTime();
  };

  const rangeLabel = useMemo(() => {
    if (!rangeLow) return null;
    const fmt = (d: Date) => `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
    if (!rangeEnd || rangeLow.getTime() === rangeHigh!.getTime()) return fmt(rangeLow);
    const days = Math.round((rangeHigh!.getTime() - rangeLow.getTime()) / 86400000) + 1;
    return `${fmt(rangeLow)} → ${fmt(rangeHigh!)} · ${days} days`;
  }, [rangeLow, rangeHigh, rangeEnd]);

  const notesByDate = useMemo(() => {
    const map = new Map<string, NoteEntry[]>();
    for (const note of savedNotes) {
      if (note.days) {
        for (const dk of note.days) {
          const arr = map.get(dk) || [];
          arr.push(note);
          map.set(dk, arr);
        }
      }
    }
    return map;
  }, [savedNotes]);

  const getNotesForDay = (day: number): NoteEntry[] => {
    const key = dateKey(year, month, day);
    return notesByDate.get(key) || [];
  };

  const toggleTag = (tag: string) => {
    setNoteTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  // Save note with dialog
  const handleSaveNote = () => {
    if (!noteText.trim()) return;

    let days: string[] = [];
    if (rangeLow && rangeHigh) {
      days = rangeDateKeys(rangeLow, rangeHigh);
    } else if (rangeLow) {
      days = [dateKey(rangeLow.getFullYear(), rangeLow.getMonth(), rangeLow.getDate())];
    }

    const entry: NoteEntry = {
      id: Date.now().toString(),
      text: noteText.trim(),
      rangeLabel: rangeLabel || `${MONTHS[month]} ${year}`,
      days,
      timestamp: Date.now(),
      tags: noteTags.length > 0 ? [...noteTags] : undefined,
    };
    persistNotes([entry, ...savedNotes].slice(0, 50));
    setNoteText("");
    setNoteTags([]);
    setShowSaveDialog(true);
  };

  const deleteNote = (id: string) => {
    persistNotes(savedNotes.filter(n => n.id !== id));
    if (dayPopoverNotes) {
      const remaining = dayPopoverNotes.filter(n => n.id !== id);
      if (remaining.length === 0) setDayPopoverNotes(null);
      else setDayPopoverNotes(remaining);
    }
  };

  const heroCourse = TUF_COURSES[heroIndex];

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const src = img.src;
    if (src.includes("sddefault")) {
      img.src = getThumbnailUrl(heroCourse.videoId, "hq");
    } else {
      setImgError(true);
    }
  };

  const handleNoteIndicatorClick = (e: React.MouseEvent, day: number) => {
    e.stopPropagation();
    const notes = getNotesForDay(day);
    if (notes.length > 0) setDayPopoverNotes(notes);
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto border-2 sm:border-4 border-brand-border bg-brand-black p-3 sm:p-5 md:p-8 relative">
        {/* Spiral Binding */}
        <div className="absolute -top-3 sm:-top-4 left-0 right-0 flex justify-around px-4 sm:px-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-1.5 sm:w-2 h-6 sm:h-8 bg-brand-border rounded-full border-2 border-brand-black -mt-1 sm:-mt-2" />
          ))}
        </div>

        {/* Toggle Mode Button */}
        <div className="absolute top-3 sm:top-5 right-3 sm:right-5 z-10 flex gap-2">
          {heroMode === "video" && (
            <div className="hidden sm:flex items-center text-[9px] uppercase font-bold tracking-widest text-brand-white/40 bg-brand-black/80 px-3 border border-brand-border h-8">
              TUF Video Series
            </div>
          )}
          <button
            onClick={() => setHeroMode(prev => prev === "image" ? "video" : "image")}
            className="bg-brand-black/80 backdrop-blur-sm border border-brand-border text-brand-white w-8 h-8 flex items-center justify-center hover:bg-brand-red hover:text-brand-white transition-colors active:scale-95 shadow-lg"
            title="Toggle Hero Format"
          >
            {heroMode === "image" ? <Video size={14} /> : <ImageIcon size={14} />}
          </button>
        </div>

        {/* Hero */}
        {heroMode === "image" ? (
          <div className="block h-36 sm:h-48 md:h-64 mb-4 sm:mb-6 md:mb-8 border-2 border-brand-border overflow-hidden relative mt-3 sm:mt-4 bg-brand-black group">
            <img src={STATIC_HERO_IMG} alt="Editorial Calendar" className="w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent" />

            {/* Year Overlay Large */}
            <div className="absolute -bottom-8 -right-4 text-[120px] sm:text-[180px] font-black italic opacity-5 leading-none pointer-events-none">
              {year}
            </div>

            <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5">
              <h2 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter text-brand-white leading-none">
                take<span className="text-brand-red">U</span>forward
              </h2>
              <div className="text-[9px] sm:text-[11px] uppercase font-bold text-brand-white/60 tracking-[0.4em] mt-1.5 sm:mt-2">Daily Discipline</div>
            </div>

            <div className="absolute top-3 sm:top-5 left-3 sm:left-5 text-brand-white bg-brand-black/80 px-2 sm:px-4 py-1 sm:py-2 border border-brand-border backdrop-blur-sm shadow-xl">
              <span className="text-xs sm:text-sm md:text-lg font-black uppercase tracking-widest">{MONTHS[month]} <span className="text-brand-red font-serif italic">{year}</span></span>
            </div>
          </div>
        ) : (
          <a
            href={heroCourse.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-36 sm:h-48 md:h-64 mb-4 sm:mb-6 md:mb-8 border-2 border-brand-border overflow-hidden relative group mt-3 sm:mt-4"
            style={imgError ? { background: FALLBACK_BG } : undefined}
          >
            {!imgError && (
              <img
                key={heroCourse.videoId}
                src={getThumbnailUrl(heroCourse.videoId, "hq")}
                alt={heroCourse.title}
                onLoad={() => setImgLoaded(true)}
                onError={handleImgError}
                className={cn(
                  "w-full h-full object-cover transition-all duration-700 group-hover:scale-105",
                  imgLoaded ? "opacity-80 group-hover:opacity-100" : "opacity-0"
                )}
              />
            )}
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/30 to-transparent" />
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
              <div className="text-[10px] uppercase font-bold text-brand-red tracking-widest mb-1">takeUforward Course</div>
              <h2 className="text-sm sm:text-lg md:text-xl font-black uppercase tracking-wider text-brand-white leading-tight">{heroCourse.title}</h2>
            </div>
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-brand-white bg-brand-black/80 px-2 sm:px-4 py-1 sm:py-2 border border-brand-border">
              <span className="text-xs sm:text-sm md:text-lg font-bold uppercase tracking-widest">{MONTHS[month]} {year}</span>
            </div>
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 flex gap-1">
              {TUF_COURSES.map((_, i) => (
                <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-colors", i === heroIndex ? "bg-brand-red" : "bg-brand-white/20")} />
              ))}
            </div>
          </a>
        )}

        {/* Month Navigation + Notes Tab Button */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
          <button onClick={handlePrevMonth} className="p-1.5 sm:p-2 border border-brand-border hover:bg-brand-red hover:text-brand-white transition-colors active:scale-95">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-brand-white">{MONTHS[month]}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotesTabOpen(true)}
              className="relative p-1.5 sm:p-2 border border-brand-border hover:bg-brand-red hover:text-brand-white transition-colors active:scale-95"
              title="View all notes"
            >
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              {savedNotes.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-red text-brand-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {savedNotes.length}
                </span>
              )}
            </button>
            <button onClick={handleNextMonth} className="p-1.5 sm:p-2 border border-brand-border hover:bg-brand-red hover:text-brand-white transition-colors active:scale-95">
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Range indicator */}
        {rangeLabel && (
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-xs sm:text-sm font-bold text-brand-red">{rangeLabel}</span>
            <button onClick={clearRange} className="text-[10px] uppercase font-bold text-brand-white/40 hover:text-brand-red tracking-widest transition-colors">
              Clear
            </button>
          </div>
        )}

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border-t border-l border-brand-border">
          {DAYS_FULL.map((day, i) => (
            <div key={day} className="p-1.5 sm:p-2.5 md:p-4 border-r border-b border-brand-border text-[10px] sm:text-xs font-bold text-brand-red tracking-widest text-center">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{DAYS_SHORT[i]}</span>
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="p-1.5 sm:p-2.5 md:p-4 border-r border-b border-brand-border bg-brand-black/40 min-h-[44px] sm:min-h-0 md:h-20" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const today = isToday(dayNum);
            const startDay = isRangeStart(dayNum);
            const endDay = isRangeEnd(dayNum);
            const inRange = isInRange(dayNum);
            const isEndpoint = startDay || endDay;
            const dayNotes = getNotesForDay(dayNum);
            const hasNotes = dayNotes.length > 0;
            const allDayTags = new Set(dayNotes.flatMap(n => n.tags || []));
            const holidayInfo = ALL_HOLIDAYS.find(h => h.month === month && h.day === dayNum);

            let PrimaryIcon = StickyNote;
            if (allDayTags.has("Interview")) PrimaryIcon = Briefcase;
            else if (allDayTags.has("System Design")) PrimaryIcon = Server;
            else if (allDayTags.has("Mock")) PrimaryIcon = FileEdit;
            else if (allDayTags.has("DSA")) PrimaryIcon = BookOpen;
            else if (allDayTags.has("Revision")) PrimaryIcon = RefreshCw;

            return (
              <button
                key={dayNum}
                onClick={() => handleDayClick(dayNum)}
                className={cn(
                  "relative min-h-[56px] sm:min-h-[80px] md:h-20 p-1 sm:p-1.5 md:p-2 border-r border-b border-brand-border flex flex-col items-start transition-all active:scale-[0.96] active:brightness-125 select-none touch-manipulation",
                  startDay && "bg-brand-red text-brand-white",
                  endDay && !startDay && "bg-brand-red text-brand-white",
                  inRange && !isEndpoint && "bg-brand-red/15 border-brand-red/30",
                  today && !isEndpoint && !inRange && "border-2 border-brand-red z-10",
                  !isEndpoint && !inRange && "hover:bg-brand-white/5",
                )}
              >
                <span className={cn(
                  "text-sm sm:text-lg md:text-xl font-bold",
                  isEndpoint && "text-brand-white",
                  inRange && !isEndpoint && "text-brand-red",
                  today && !isEndpoint && !inRange && "text-brand-red",
                )}>
                  {dayNum}
                </span>

                {/* Icons Area */}
                <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 flex gap-0.5 items-end">
                  {holidayInfo && (
                    <div
                      className="p-0.5 text-emerald-500/80"
                      title={holidayInfo.name}
                    >
                      <Palmtree size={12} className="sm:w-4 sm:h-4" />
                    </div>
                  )}
                  {hasNotes && (
                    <div
                      onClick={(e) => handleNoteIndicatorClick(e, dayNum)}
                      className={cn(
                        "p-0.5 rounded-sm cursor-pointer transition-colors",
                        isEndpoint ? "text-brand-white/70 hover:text-brand-white" : "text-brand-red/60 hover:text-brand-red"
                      )}
                      title={`${dayNotes.length} note${dayNotes.length > 1 ? "s" : ""}`}
                    >
                      <PrimaryIcon size={12} className="sm:w-4 sm:h-4" />
                    </div>
                  )}
                </div>

                {today && !isEndpoint && !hasNotes && !holidayInfo && <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-auto" />}
                {startDay && <div className="mt-auto text-[7px] sm:text-[9px] font-bold uppercase opacity-80 hidden sm:block">Start</div>}
                {endDay && !startDay && <div className="mt-auto text-[7px] sm:text-[9px] font-bold uppercase opacity-80 hidden sm:block">End</div>}
              </button>
            );
          })}
        </div>

        {/* Note Editor Area */}
        <div className="mt-4 sm:mt-6 bg-brand-black border border-brand-border p-3 sm:p-4">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={rangeLabel ? `Add note for ${rangeLabel}...` : "Select a date range, then type a note..."}
            rows={2}
            className="w-full bg-transparent border-none text-brand-white text-xs sm:text-sm focus:outline-none resize-none placeholder:text-brand-white/20 mb-2"
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-brand-border">
            <div className="flex flex-wrap items-center gap-1.5">
              <Hash size={12} className="text-brand-white/20 mr-1" />
              {SUGGESTED_TAGS.map(t => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={cn(
                    "text-[9px] uppercase font-bold tracking-widest px-2 py-1 transition-colors",
                    noteTags.includes(t)
                      ? "bg-brand-red text-brand-white"
                      : "bg-brand-border/30 text-brand-white/40 hover:bg-brand-border/60 hover:text-brand-white"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={handleSaveNote}
              disabled={!noteText.trim()}
              className="px-5 py-2 w-full sm:w-auto text-xs font-black uppercase tracking-widest border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-brand-white transition-colors disabled:opacity-30 disabled:pointer-events-none active:scale-95 shrink-0"
            >
              Save Note
            </button>
          </div>
        </div>
      </div >

      {/* Dialogs */}
      {showSaveDialog && <SaveDialog onClose={() => setShowSaveDialog(false)} />}
      <AllNotesDialog open={notesTabOpen} onClose={() => setNotesTabOpen(false)} notes={savedNotes} onDelete={deleteNote} />
      {dayPopoverNotes && <DayNotePopover notes={dayPopoverNotes} onClose={() => setDayPopoverNotes(null)} onDelete={deleteNote} />}
    </>
  );
}
