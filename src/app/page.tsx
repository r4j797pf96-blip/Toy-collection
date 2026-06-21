import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20">
        <p className="text-accent text-sm tracking-widest uppercase mb-3">
          A private collection, made public
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight max-w-2xl">
          Decades of tin, clockwork and battery-powered toys, catalogued and preserved.
        </h1>
        <p className="mt-4 text-muted max-w-xl">
          Browse the full archive of toys, manufacturers and reference books.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/collection"
            className="bg-foreground text-background px-5 py-2.5 rounded-full text-sm hover:opacity-85 transition"
          >
            Browse the Collection
          </Link>
          <Link
            href="/about"
            className="border border-border px-5 py-2.5 rounded-full text-sm hover:bg-card transition"
          >
            About this archive
          </Link>
        </div>
      </section>
    </div>
  );
}
