"use client";

import { useState, useEffect } from "react";

export function DSADonut({ progress = 65 }: { progress?: number }) {
  const target = 450;
  const completed = Math.round((progress / 100) * target);
  const circumference = 2 * Math.PI * 50;
  const [offset, setOffset] = useState(circumference);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (progress / 100) * circumference);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress, circumference]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 border-2 border-brand-border bg-brand-black/50">
      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-white/60">DSA Progress</h4>

      <div
        className="relative w-[120px] h-[120px] cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#222222" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="50"
            fill="none"
            stroke="#E11D48"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-full">
          {/* Percentage (Default) */}
          <div 
            className="absolute flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]"
            style={{ 
              opacity: hovered ? 0 : 1, 
              transform: hovered ? 'scale(0.8) translateY(-10px)' : 'scale(1) translateY(0)' 
            }}
          >
            <span className="text-2xl font-black text-brand-white">{progress}%</span>
          </div>

          {/* Fraction (Hover) */}
          <div 
            className="absolute flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]"
            style={{ 
              opacity: hovered ? 1 : 0, 
              transform: hovered ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(10px)' 
            }}
          >
            <span className="text-xl font-black text-brand-red">{completed}/{target}</span>
            <span className="text-[9px] font-bold text-brand-white/40 uppercase tracking-widest mt-0.5">Problems</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 items-center">
        <span className="text-[10px] uppercase font-bold text-brand-red">Target: {target} Problems</span>
        <span className="text-[10px] uppercase font-bold text-brand-white/40">{completed} Completed</span>
      </div>
    </div>
  );
}
