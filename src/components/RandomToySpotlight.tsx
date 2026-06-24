"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RandomToy {
  slug: string;
  name: string;
  trademark?: string;
  firstYear?: string;
  photo?: string;
}

export default function RandomToySpotlight() {
  const [toy, setToy] = useState<RandomToy | null>(null);

  useEffect(() => {
    fetch("/api/random-toy", { cache: "no-store" })
      .then((res) => res.json())
      .then(setToy)
      .catch(() => {});
  }, []);

  if (!toy) return null;

  return (
    <Link
      href={`/collection/${toy.slug}`}
      className="group flex items-center gap-4 border border-border rounded-lg p-4 bg-card hover:shadow-md transition max-w-md"
    >
      <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden bg-border/40">
        {toy.photo ? (
          <Image
            src={toy.photo}
            alt={toy.name}
            fill
            sizes="80px"
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        ) : null}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted mb-1">Random pick</p>
        <p className="font-medium text-sm leading-snug">{toy.name}</p>
        <p className="text-xs text-muted mt-1">
          {toy.trademark ?? "Unknown maker"}
          {toy.firstYear ? ` · ${toy.firstYear}` : ""}
        </p>
      </div>
    </Link>
  );
}
