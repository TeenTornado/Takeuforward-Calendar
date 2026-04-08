"use client";

import { useState, useEffect } from "react";
import { Edit3 } from "lucide-react";

export function NotesPanel() {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const savedNotes = localStorage.getItem("calendar-notes");
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem("calendar-notes", newNotes);
  };

  return (
    <div className="flex flex-col h-full border-l-4 border-brand-border bg-brand-black p-6">
      <div className="flex items-center gap-3 mb-6">
        <Edit3 className="text-brand-red" size={24} />
        <h3 className="text-xl font-black uppercase tracking-widest text-brand-white">Notes & Tasks</h3>
      </div>
      <textarea
        value={notes}
        onChange={handleChange}
        placeholder="Scribble your monthly goals, important reminders, or just random thoughts..."
        className="flex-1 w-full bg-transparent border-2 border-brand-border p-4 text-brand-white focus:outline-none focus:border-brand-red resize-none font-mono text-sm leading-relaxed"
      />
      <div className="mt-4 pt-4 border-t border-brand-border flex justify-between items-center text-[10px] uppercase font-bold text-brand-white/40 tracking-widest">
        <span>Auto-saved to local storage</span>
        <span>{notes.length} Characters</span>
      </div>
    </div>
  );
}
