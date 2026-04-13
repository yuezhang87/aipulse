"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  summary: string;
  content: string[];
}

export default function TldrSection({ summary, content }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cancel any in-progress speech when the component unmounts (e.g. navigation)
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  function handleListen() {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const text = content.join(" ");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    utteranceRef.current = utterance;

    window.speechSynthesis.cancel(); // clear any leftover queue
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }

  return (
    <section>
      {/* Label row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          {/* Accent bar */}
          <span className="block w-1 h-5 rounded-full bg-[#7F77DD]" />
          <span className="text-xs font-bold text-[#a29ce8] uppercase tracking-[0.18em]">
            TL;DR
          </span>
        </div>

        <button
          onClick={handleListen}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all duration-150 ${
            isPlaying
              ? "border-[#7F77DD]/60 bg-[#7F77DD]/15 text-[#c4bff5]"
              : "border-[var(--border)] text-[var(--foreground)] opacity-60 hover:opacity-100 hover:border-[#7F77DD]/50 hover:text-[#a29ce8]"
          }`}
          aria-label={isPlaying ? "Stop reading" : "Listen to full story"}
        >
          <span className="text-sm leading-none">{isPlaying ? "⏹" : "🔊"}</span>
          {isPlaying ? "Stop" : "Listen"}
          {isPlaying && (
            <span className="flex gap-[3px] items-center h-3">
              <span className="w-[3px] h-[7px] rounded-full bg-[#a29ce8] animate-soundbar" />
              <span className="w-[3px] h-3 rounded-full bg-[#a29ce8] animate-soundbar [animation-delay:0.15s]" />
              <span className="w-[3px] h-[5px] rounded-full bg-[#a29ce8] animate-soundbar [animation-delay:0.3s]" />
            </span>
          )}
        </button>
      </div>

      {/* Summary */}
      <p className="text-[18px] leading-[1.75] text-white/80 font-[450] tracking-[-0.01em]">
        {summary}
      </p>

      {/* Divider */}
      <div className="mt-8 flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-[#7F77DD]/30 via-[#7F77DD]/10 to-transparent" />
        <span className="text-[10px] font-semibold text-[#7F77DD]/40 uppercase tracking-widest">
          Full story
        </span>
        <div className="flex-1 h-px bg-gradient-to-l from-[#7F77DD]/30 via-[#7F77DD]/10 to-transparent" />
      </div>
    </section>
  );
}
