import Link from "next/link";
import { getResearchHighlights } from "@/lib/data";
import RandomToySpotlight from "@/components/RandomToySpotlight";

export default function Home() {
  const highlights = getResearchHighlights();

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

        <div className="mt-10">
          <RandomToySpotlight />
        </div>
      </section>

      {highlights.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
          <h2 className="font-serif text-2xl mb-6">Research highlights</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {highlights.map((toy) => (
              <Link
                key={toy.id}
                href={`/collection/${toy.slug}`}
                className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition"
              >
                <p className="font-medium text-sm">{toy.name}</p>
                <p className="text-xs text-muted mt-1 mb-2">
                  {toy.trademark ?? "Unknown maker"}
                  {toy.firstYear ? ` · ${toy.firstYear}` : ""}
                </p>
                <p className="text-sm text-muted leading-relaxed line-clamp-4">{toy.research}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
