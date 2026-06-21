import Link from "next/link";
import { getAllToys, getStats } from "@/lib/data";

export default function Home() {
  const toys = getAllToys();
  const stats = getStats();
  const featured = toys.filter((t) => t.photos.length > 0).slice(0, 6);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-12">
        <p className="text-accent text-sm tracking-widest uppercase mb-3">
          A private collection, made public
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight max-w-2xl">
          Decades of tin, clockwork and battery-powered toys, catalogued and preserved.
        </h1>
        <p className="mt-4 text-muted max-w-xl">
          {stats.totalToys} toys, {stats.totalManufacturers} manufacturers and{" "}
          {stats.totalBooks} reference books — browse the full archive.
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

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {featured.map((toy) => (
              <Link
                key={toy.id}
                href={`/collection/${toy.slug}`}
                className="group block aspect-square overflow-hidden rounded-lg bg-card border border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={toy.photos[0]}
                  alt={toy.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
