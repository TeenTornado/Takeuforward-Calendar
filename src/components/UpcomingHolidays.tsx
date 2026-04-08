"use client";

import { useMemo, useState } from "react";
import { CalendarDays, X } from "lucide-react";

export const ALL_HOLIDAYS = [
  { name: "New Year's Day", month: 0, day: 1 },
  { name: "Republic Day", month: 0, day: 26 },
  { name: "Maha Shivaratri", month: 1, day: 15 },
  { name: "Holi", month: 2, day: 10 },
  { name: "Ugadi / Gudi Padwa", month: 2, day: 22 },
  { name: "Ram Navami", month: 3, day: 2 },
  { name: "Good Friday", month: 3, day: 3 },
  { name: "Easter Sunday", month: 3, day: 5 },
  { name: "Eid ul-Fitr", month: 3, day: 21 },
  { name: "May Day", month: 4, day: 1 },
  { name: "Buddha Purnima", month: 4, day: 12 },
  { name: "Eid ul-Adha", month: 5, day: 28 },
  { name: "Muharram", month: 6, day: 27 },
  { name: "Independence Day", month: 7, day: 15 },
  { name: "Janmashtami", month: 7, day: 25 },
  { name: "Milad-un-Nabi", month: 8, day: 26 },
  { name: "Gandhi Jayanti", month: 9, day: 2 },
  { name: "Dussehra", month: 9, day: 12 },
  { name: "Diwali", month: 9, day: 31 },
  { name: "Guru Nanak Jayanti", month: 10, day: 15 },
  { name: "Christmas", month: 11, day: 25 },
  { name: "New Year's Eve", month: 11, day: 31 },
];

const MONTHS_SHORT = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function AllHolidaysDialog({ onClose }: { onClose: () => void }) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const grouped = useMemo(() => {
    const map = new Map<number, typeof ALL_HOLIDAYS>();
    for (const h of ALL_HOLIDAYS) {
      const arr = map.get(h.month) || [];
      arr.push(h);
      map.set(h.month, arr);
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-brand-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-brand-black border-2 border-brand-border w-full max-w-lg max-h-[80vh] flex flex-col animate-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-brand-border shrink-0">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-brand-red" size={16} />
            <h2 className="text-sm font-black uppercase tracking-widest text-brand-white">All Holidays — 2026</h2>
          </div>
          <button onClick={onClose} className="p-1 border border-brand-border hover:border-brand-red hover:text-brand-red transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-5 space-y-5">
          {grouped.map(([monthIdx, holidays]) => (
            <div key={monthIdx}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red mb-2">{MONTHS_FULL[monthIdx]}</h3>
              <div className="space-y-1.5">
                {holidays.map(h => {
                  const hDate = new Date(now.getFullYear(), h.month, h.day);
                  const isPast = hDate < today;
                  const isToday = hDate.getTime() === today.getTime();
                  const diff = Math.ceil((hDate.getTime() - today.getTime()) / 86400000);

                  return (
                    <div
                      key={h.name}
                      className={`flex items-center justify-between py-1.5 px-2 text-xs border-l-2 ${
                        isToday ? "border-brand-red bg-brand-red/10" : isPast ? "border-brand-border opacity-35" : "border-brand-border"
                      }`}
                    >
                      <div className="min-w-0">
                        <span className={`font-bold ${isPast ? "line-through" : ""}`}>{h.name}</span>
                        {isToday && <span className="ml-2 text-[9px] font-black text-brand-red uppercase">Today!</span>}
                        {!isPast && !isToday && diff <= 7 && (
                          <span className="ml-2 text-[9px] font-bold text-brand-white/30">{diff}d away</span>
                        )}
                      </div>
                      <span className={`font-black shrink-0 ml-3 ${isPast ? "" : "text-brand-red"}`}>
                        {MONTHS_SHORT[h.month]} {h.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-brand-border p-3 text-center shrink-0">
          <span className="text-[10px] font-bold text-brand-white/20 uppercase tracking-widest">{ALL_HOLIDAYS.length} holidays listed</span>
        </div>
      </div>
    </div>
  );
}

export function UpcomingHolidays() {
  const [showAll, setShowAll] = useState(false);

  const upcoming = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return ALL_HOLIDAYS
      .map(h => {
        const date = new Date(now.getFullYear(), h.month, h.day);
        const diff = date.getTime() - today.getTime();
        return { ...h, date, diff, daysAway: Math.ceil(diff / 86400000) };
      })
      .filter(h => h.diff >= 0)
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 3);
  }, []);

  return (
    <>
      <div className="border-2 border-brand-border p-4 sm:p-6 bg-brand-black/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-brand-red" size={14} />
            <h4 className="text-xs font-black uppercase tracking-widest text-brand-white/60">Upcoming Holidays</h4>
          </div>
          <button
            onClick={() => setShowAll(true)}
            className="text-[10px] font-bold uppercase tracking-widest text-brand-white/30 hover:text-brand-red transition-colors"
          >
            View All
          </button>
        </div>

        <ul className="space-y-3">
          {upcoming.map(h => (
            <li key={h.name} className="flex justify-between items-center text-xs">
              <div className="min-w-0">
                <span className="font-bold block truncate">{h.name}</span>
                {h.daysAway === 0 ? (
                  <span className="text-[9px] font-bold text-brand-red uppercase">Today!</span>
                ) : h.daysAway === 1 ? (
                  <span className="text-[9px] font-bold text-brand-white/30 uppercase">Tomorrow</span>
                ) : (
                  <span className="text-[9px] font-bold text-brand-white/20 uppercase">{h.daysAway} days away</span>
                )}
              </div>
              <span className="text-brand-red font-black shrink-0 ml-3">
                {MONTHS_SHORT[h.month]} {h.day}
              </span>
            </li>
          ))}
        </ul>

        {upcoming.length === 0 && (
          <p className="text-xs text-brand-white/30 text-center py-4">No upcoming holidays this year</p>
        )}
      </div>

      {showAll && <AllHolidaysDialog onClose={() => setShowAll(false)} />}
    </>
  );
}
