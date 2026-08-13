"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface RandomToy {
  slug: string;
  name: string;
  displayName: string;
  trademark?: string;
  firstYear?: string;
  photo?: string;
}

export default function RandomToySpotlight() {
  const [toy, setToy] = useState<RandomToy | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomToy = useCallback(() => {
    setLoading(true);
    fetch("/api/random-toy", { cache: "no-store" })
      .then((res) => res.json())
      .then(setToy)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRandomToy();
  }, [fetchRandomToy]);

  if (!toy) return null;

  return (
    <div className="max-w-xl">
      <Link
        href={`/collection/${toy.slug}`}
        className="group flex items-center gap-6 border border-border rounded-xl p-6 bg-card hover:shadow-md transition"
      >
        <div className="relative w-36 h-36 shrink-0 rounded-lg overflow-hidden bg-border/40">
          {toy.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={toy.photo}
              alt={toy.displayName}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : null}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted mb-1">Random pick</p>
          <p className="font-serif text-xl leading-snug">{toy.displayName}</p>
          <p className="text-sm text-muted mt-1">
            {toy.trademark ?? "Unknown maker"}
            {toy.firstYear ? ` · ${toy.firstYear}` : ""}
          </p>
        </div>
      </Link>

      <button
        type="button"
        onClick={fetchRandomToy}
        disabled={loading}
        className="mt-3 border border-border px-5 py-2.5 rounded-full text-sm hover:bg-card transition disabled:opacity-50"
      >
        {loading ? "Shuffling…" : "Show me another"}
      </button>
    </div>
  );
}
