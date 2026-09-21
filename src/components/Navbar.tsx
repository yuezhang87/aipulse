"use client";

import { useState } from "react";
import Link from "next/link";
import AiPulseLogo from "@/components/AiPulseLogo";

export default function Navbar({ light = false }: { light?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navBg = light ? "bg-white border-[#e4e3ef]" : "bg-navy-dark border-[var(--border)]";
  const text = light ? "text-[#1a1a2e]" : "text-white";
  const linkText = light
    ? "text-[#1a1a2e]/70 hover:opacity-100 hover:text-[#5B4FC7]"
    : "text-[var(--foreground)] opacity-70 hover:opacity-100 hover:text-[#a29ce8]";
  const iconBorder = light ? "border-[#e4e3ef] text-[#1a1a2e]" : "border-[var(--border)] text-[var(--foreground)]";

  return (
    <nav className={`sticky top-0 z-50 border-b ${navBg}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="rounded-[7px] transition-all duration-300"
              style={{
                boxShadow:
                  "0 0 6px 1px rgba(127,119,221,0.85), 0 0 16px 4px rgba(127,119,221,0.55), 0 0 36px 10px rgba(127,119,221,0.28), 0 0 64px 20px rgba(127,119,221,0.12)",
              }}
            >
              <AiPulseLogo size={32} />
            </div>
            <span className={`font-bold text-lg tracking-tight ${text}`}>
              aiPulse
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className={`text-sm transition-all ${linkText}`}>
              Stories
            </Link>
            <Link href="/dashboard" className={`text-sm transition-all ${linkText}`}>
              Trends
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-lg border ${iconBorder}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className={`md:hidden py-4 border-t flex flex-col gap-3 ${light ? "border-[#e4e3ef]" : "border-[var(--border)]"}`}>
            <Link href="/" className={`text-sm transition-all ${linkText}`}>Stories</Link>
            <Link href="/dashboard" className={`text-sm transition-all ${linkText}`}>Trends</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
