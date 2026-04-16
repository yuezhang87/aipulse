"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  summary: string;
  content: string[];
}

// Module-level array so Chrome's GC can never collect utterances mid-speech.
// A component ref alone isn't enough — Chrome collects it anyway on some builds.
let _utterances: SpeechSynthesisUtterance[] = [];

export default function TldrSection({ summary, content }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState<boolean | null>(null); // null = not yet checked
  const keepaliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stoppedRef = useRef(false);

  // Check support once on mount (must be client-side)
  useEffect(() => {
    const ok = typeof window !== "undefined" && "speechSynthesis" in window;
    setSupported(ok);

    return () => {
      // Clean up on unmount (e.g. client-side navigation)
      stopSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopSpeech() {
    stoppedRef.current = true;
    if (keepaliveRef.current) {
      clearInterval(keepaliveRef.current);
      keepaliveRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    _utterances = [];
    setIsPlaying(false);
  }

  function handleListen() {
    if (!("speechSynthesis" in window)) {
      setError("Not supported on this browser");
      return;
    }

    if (isPlaying) {
      stopSpeech();
      return;
    }

    setError(null);
    stoppedRef.current = false;

    const realText = [summary, ...content].join(" ").trim();

    if (!realText) {
      setError("No content to read for this story");
      return;
    }

    // Split into sentences so Safari never has to handle one long utterance.
    // Safari cuts off audio mid-way through long strings; short sentences chain fine.
    const sentences = realText
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    // Build all utterances up front and store at module level to defeat GC.
    _utterances = sentences.map((sentence) => {
      const u = new SpeechSynthesisUtterance(sentence);
      u.rate = 0.95;
      u.pitch = 1;
      u.lang = "en-US";
      return u;
    });

    // Chain: each utterance's onend queues the next one.
    _utterances.forEach((u, i) => {
      u.onend = () => {
        if (stoppedRef.current) return;
        if (i + 1 < _utterances.length) {
          window.speechSynthesis.speak(_utterances[i + 1]);
        } else {
          // All sentences finished
          stopSpeech();
        }
      };
      u.onerror = (e) => {
        // 'interrupted' / 'canceled' fire when we call cancel() ourselves — not real errors
        if (e.error !== "interrupted" && e.error !== "canceled") {
          setError(`Speech error: ${e.error}`);
        }
        stopSpeech();
      };
    });

    // Speak only the first sentence; the rest are queued via onend chaining.
    window.speechSynthesis.speak(_utterances[0]);
    setIsPlaying(true);

    // --- Chrome keepalive workaround ---
    // Chrome pauses long utterances after ~14 s. pause()+resume() every 10 s
    // forces it to keep going. Sentence chaining makes this less critical but
    // keep it as a safety net for Chrome.
    keepaliveRef.current = setInterval(() => {
      if (stoppedRef.current) return;
      if (!window.speechSynthesis.speaking) return;
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 10_000);
  }

  // Don't render the button at all until we know if speech is supported
  if (supported === null) return renderShell(summary, null);
  if (!supported) return renderShell(summary, "Not supported on this browser");

  return renderShell(summary, error, { isPlaying, onListen: handleListen });
}

// ---------- pure render helpers ----------

interface Controls {
  isPlaying: boolean;
  onListen: () => void;
}

function renderShell(
  summary: string,
  errorMsg: string | null,
  controls?: Controls
) {
  return (
    <section>
      {/* Label row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="block w-1 h-5 rounded-full bg-[#7F77DD]" />
          <span className="text-xs font-bold text-[#a29ce8] uppercase tracking-[0.18em]">
            TL;DR
          </span>
        </div>

        {controls ? (
          <button
            onClick={controls.onListen}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all duration-150 ${
              controls.isPlaying
                ? "border-[#7F77DD]/60 bg-[#7F77DD]/15 text-[#c4bff5]"
                : "border-[var(--border)] text-[var(--foreground)] opacity-60 hover:opacity-100 hover:border-[#7F77DD]/50 hover:text-[#a29ce8]"
            }`}
            aria-label={controls.isPlaying ? "Stop reading" : "Listen to full story"}
          >
            <span className="text-sm leading-none">
              {controls.isPlaying ? "⏹" : "🔊"}
            </span>
            {controls.isPlaying ? "Stop" : "Listen"}
            {controls.isPlaying && (
              <span className="flex gap-[3px] items-center h-3">
                <span className="w-[3px] h-[7px] rounded-full bg-[#a29ce8] animate-soundbar" />
                <span className="w-[3px] h-3 rounded-full bg-[#a29ce8] animate-soundbar [animation-delay:0.15s]" />
                <span className="w-[3px] h-[5px] rounded-full bg-[#a29ce8] animate-soundbar [animation-delay:0.3s]" />
              </span>
            )}
          </button>
        ) : errorMsg ? (
          <span className="text-xs text-red-400/70 font-medium">{errorMsg}</span>
        ) : null}
      </div>

      {/* Inline error below label row (only when controls exist but error occurred) */}
      {controls && errorMsg && (
        <p className="text-xs text-red-400/70 mb-3">{errorMsg}</p>
      )}

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
