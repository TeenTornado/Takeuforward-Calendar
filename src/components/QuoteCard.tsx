"use client";

import { useState, useEffect, useCallback } from "react";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";

const QUOTES = [
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Striver" },
  { text: "Don't practice until you get it right. Practice until you can't get it wrong.", author: "Unknown" },
  { text: "Every expert was once a beginner. Every pro was once an amateur.", author: "Robin Sharma" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Consistency is what transforms average into excellence.", author: "Unknown" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
];

export function QuoteCard() {
  const streak = 14;
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
  }, []);

  const changeQuote = useCallback((newIndex: number) => {
    setFading(true);
    setTimeout(() => {
      setQuoteIndex(((newIndex % QUOTES.length) + QUOTES.length) % QUOTES.length);
      setFading(false);
    }, 250);
  }, []);

  // Auto-rotate every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      changeQuote(quoteIndex + 1);
    }, 15000);
    return () => clearInterval(timer);
  }, [quoteIndex, changeQuote]);

  const handlePrev = () => changeQuote(quoteIndex - 1);
  const handleNext = () => changeQuote(quoteIndex + 1);

  const quote = QUOTES[quoteIndex];

  const today = new Date();
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dateStr = `${dayNames[today.getDay()]}, ${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 border-2 border-brand-border bg-brand-black">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Flame className="text-brand-red" size={18} />
          <span className="text-xs font-black uppercase tracking-widest text-brand-white">{streak} Day Streak</span>
        </div>
        <span className="text-[10px] font-bold text-brand-white/40 uppercase">{dateStr}</span>
      </div>

      <blockquote
        className="border-l-4 border-brand-red pl-4 sm:pl-6 py-2 transition-opacity duration-250 min-h-[80px] flex flex-col justify-center"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <p className="text-base sm:text-xl font-black italic text-brand-white tracking-tight leading-snug">
          &ldquo;{quote.text}&rdquo;
        </p>
        <cite className="block mt-3 sm:mt-4 text-[10px] uppercase font-bold text-brand-white/60 tracking-widest not-italic">
          — {quote.author}
        </cite>
      </blockquote>

      {/* Manual controls + indicator */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="p-1 border border-brand-border hover:border-brand-red hover:text-brand-red transition-colors active:scale-95"
          aria-label="Previous quote"
        >
          <ChevronLeft size={14} />
        </button>

        <div className="flex gap-1">
          {QUOTES.map((_, i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-full transition-colors ${i === quoteIndex ? "bg-brand-red" : "bg-brand-border"}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-1 border border-brand-border hover:border-brand-red hover:text-brand-red transition-colors active:scale-95"
          aria-label="Next quote"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
