"use client";

import { useState } from "react";
import Link from "next/link";
import AiPulseLogo from "@/components/AiPulseLogo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-navy-dark border-b border-[var(--border)]">
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
            <span className="text-white font-bold text-lg tracking-tight">
              aiPulse
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-[var(--foreground)] opacity-70 hover:opacity-100 hover:text-[#a29ce8] transition-all"
            >
              Stories
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-[var(--foreground)] opacity-70 hover:opacity-100 hover:text-[#a29ce8] transition-all"
            >
              Trends
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg border border-[var(--border)] text-[var(--foreground)]"
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
          <div className="md:hidden py-4 border-t border-[var(--border)] flex flex-col gap-3">
            <Link href="/" className="text-sm opacity-80 hover:opacity-100 hover:text-[#a29ce8] transition-all">Stories</Link>
            <Link href="/dashboard" className="text-sm opacity-80 hover:opacity-100 hover:text-[#a29ce8] transition-all">Trends</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
