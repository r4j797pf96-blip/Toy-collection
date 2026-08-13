import Link from "next/link";
import type { Toy } from "@/lib/types";

export default function ToyCard({ toy }: { toy: Toy }) {
  return (
    <Link
      href={`/collection/${toy.slug}`}
      className="group block rounded-lg overflow-hidden border border-border bg-card hover:shadow-md transition"
    >
      <div className="relative aspect-square bg-border/40 overflow-hidden">
        {toy.photos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={toy.photos[0]}
            alt={toy.displayName}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-xs">
            No photo
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium leading-snug line-clamp-2">{toy.displayName}</p>
        <p className="text-xs text-muted mt-1">
          {toy.trademark ?? "Unknown maker"}
          {toy.firstYear ? ` · ${toy.firstYear}` : ""}
        </p>
      </div>
    </Link>
  );
}
