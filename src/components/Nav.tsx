import Link from "next/link";

const links = [
  { href: "/collection", label: "Collection" },
  { href: "/manufacturers", label: "Manufacturers" },
  { href: "/library", label: "Library" },
  { href: "/about", label: "About" },
  { href: "/stats", label: "Stats" },
];

export default function Nav() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg tracking-tight">
          The Toy Archive
        </Link>
        <nav className="flex items-center gap-5 text-sm overflow-x-auto">
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
      </div>
    </header>
  );
}
