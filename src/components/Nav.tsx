"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/collection", label: "Collection" },
  { href: "/manufacturers", label: "Manufacturers" },
  { href: "/library", label: "Library" },
  { href: "/about", label: "About" },
  { href: "/stats", label: "Stats" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg tracking-tight" onClick={() => setOpen(false)}>
          The Mechanical Toy Archive
        </Link>

        <nav className="hidden sm:flex items-center gap-5 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-muted hover:text-foreground transition-colors whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="sm:hidden p-2 -mr-2 text-foreground"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="sm:hidden border-t border-border px-4 sm:px-6 py-3 flex flex-col gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-muted hover:text-foreground transition-colors py-2"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
