"use client";

import { useState } from "react";
import ToyCard from "@/components/ToyCard";
import type { Toy } from "@/lib/types";

type SortOption = "name-asc" | "year-asc" | "year-desc";

const SORT_LABELS: Record<SortOption, string> = {
  "name-asc": "A–Z",
  "year-asc": "Oldest first",
  "year-desc": "Newest first",
};

function sortToys(toys: Toy[], sort: SortOption): Toy[] {
  const sorted = [...toys];
  const year = (t: Toy) => Number(t.firstYear) || undefined;

  switch (sort) {
    case "year-asc":
      return sorted.sort((a, b) => (year(a) ?? Infinity) - (year(b) ?? Infinity));
    case "year-desc":
      return sorted.sort((a, b) => (year(b) ?? -Infinity) - (year(a) ?? -Infinity));
    case "name-asc":
    default:
      return sorted.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }
}

export default function SortableToyGrid({ toys }: { toys: Toy[] }) {
  const [sort, setSort] = useState<SortOption>("name-asc");
  const sorted = sortToys(toys, sort);

  return (
    <div>
      <div className="flex justify-end gap-2 text-sm mb-4">
        {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSort(option)}
            className={`px-3 py-1.5 rounded-full border ${
              sort === option
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted hover:bg-card"
            }`}
          >
            {SORT_LABELS[option]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {sorted.map((t) => (
          <ToyCard key={t.id} toy={t} />
        ))}
      </div>
    </div>
  );
}
