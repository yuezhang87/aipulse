"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  summary: string;
  content: string[];
}

// Module-level ref so Chrome's GC can never collect the utterance mid-speech.
// A component ref alone isn't enough — Chrome collects it anyway on some builds.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let _utterance: SpeechSynthesisUtterance | null = null;

export default function TldrSection({ summary, content }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState<boolean | null>(null); // null = not yet checked
  const keepaliveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check support once on mount (must be client-side)
  useEffect(() => {
    const ok = typeof window !== "undefined" && "speechSynthesis" in window;
    setSupported(ok);
    console.log("[TldrSection] speechSynthesis supported:", ok);
    if (ok) {
      console.log("[TldrSection] speechSynthesis object:", window.speechSynthesis);
    }

    return () => {
      // Clean up on unmount (e.g. client-side navigation)
      stopSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopSpeech() {
    if (keepaliveRef.current) {
      clearInterval(keepaliveRef.current);
      keepaliveRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    _utterance = null;
    setIsPlaying(false);
  }

  function handleListen() {
    console.log("[TldrSection] handleListen fired. isPlaying:", isPlaying);

    if (!("speechSynthesis" in window)) {
      console.error("[TldrSection] window.speechSynthesis is not available");
      setError("Not supported on this browser");
      return;
    }

    if (isPlaying) {
      console.log("[TldrSection] Stopping playback");
      stopSpeech();
      return;
    }

    setError(null);

    // --- Step 1: verify the text we'll speak ---
    console.log("[TldrSection] summary prop:", JSON.stringify(summary?.slice(0, 80)) || "(empty)");
    console.log("[TldrSection] content array length:", content.length);
    const realText = [summary, ...content].join(" ").trim();
    console.log("[TldrSection] joined text length:", realText.length);
    console.log("[TldrSection] text preview:", realText.slice(0, 120) || "(empty)");

    if (!realText) {
      console.warn("[TldrSection] No text to speak — content is empty");
      setError("No content to read for this story");
      return;
    }

    // --- Step 2: quick hardcoded smoke-test to confirm the API fires at all ---
    // (Logs "TTS smoke test OK" in the console; remove once confirmed working)
    const smokeCheck = new SpeechSynthesisUtterance("Audio ready.");
    smokeCheck.volume = 0; // silent — just verifies the API path works
    smokeCheck.onstart = () => console.log("[TldrSection] smoke-test utterance started ✓");
    smokeCheck.onerror = (e) => console.warn("[TldrSection] smoke-test error:", e.error);
    window.speechSynthesis.speak(smokeCheck);

    // --- Step 3: build the real utterance ---
    const utterance = new SpeechSynthesisUtterance(realText);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    utterance.onstart = () => {
      console.log("[TldrSection] ▶ speech started");
    };
    utterance.onend = () => {
      console.log("[TldrSection] ■ speech ended naturally");
      stopSpeech();
    };
    utterance.onerror = (e) => {
      console.error("[TldrSection] speech error event:", e.error, e);
      // 'interrupted' fires when we call cancel() ourselves — not a real error
      if (e.error !== "interrupted" && e.error !== "canceled") {
        setError(`Speech error: ${e.error}`);
      }
      stopSpeech();
    };
    utterance.onpause = () => console.log("[TldrSection] ⏸ speech paused");
    utterance.onresume = () => console.log("[TldrSection] ▶ speech resumed");
    utterance.onboundary = (e) =>
      console.log(`[TldrSection] boundary: ${e.name} at char ${e.charIndex}`);

    // Assign to module-level var to defeat Chrome's GC (component refs aren't enough)
    _utterance = utterance;

    console.log("[TldrSection] calling speechSynthesis.speak()");
    window.speechSynthesis.speak(utterance);

    // Log state immediately after speak() — Chrome queues it asynchronously
    setTimeout(() => {
      console.log("[TldrSection] speaking:", window.speechSynthesis.speaking);
      console.log("[TldrSection] pending:", window.speechSynthesis.pending);
    }, 200);

    setIsPlaying(true);

    // --- Chrome keepalive workaround ---
    // Chrome pauses long utterances after ~14 s. pause()+resume() every 10 s
    // forces it to keep going. Without this, anything > ~200 words silently stops.
    keepaliveRef.current = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        console.warn("[TldrSection] keepalive: speaking is false — stopping timer");
        stopSpeech();
        return;
      }
      console.log("[TldrSection] keepalive tick — pausing then resuming");
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
