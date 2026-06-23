import toysJson from "@/data/generated/toys.json";
import booksJson from "@/data/generated/books.json";
import manufacturersJson from "@/data/generated/manufacturers.json";
import statsJson from "@/data/generated/stats.json";
import type { Book, Manufacturer, Stats, Toy } from "@/lib/types";

const toys = toysJson as Toy[];
const books = booksJson as Book[];
const manufacturers = manufacturersJson as Manufacturer[];
const stats = statsJson as Stats;

export function getAllToys(): Toy[] {
  return toys;
}

export function getToyBySlug(slug: string): Toy | undefined {
  return toys.find((t) => t.slug === slug);
}

export function getRelatedToys(toy: Toy, limit = 6): Toy[] {
  return toys
    .filter(
      (t) =>
        t.id !== toy.id &&
        (t.trademark === toy.trademark || (t.type === toy.type && t.topic === toy.topic))
    )
    .slice(0, limit);
}

export function getFilterOptions() {
  const uniq = (values: (string | undefined)[]) =>
    Array.from(new Set(values.filter((v): v is string => Boolean(v)))).sort();

  return {
    types: uniq(toys.map((t) => t.type)),
    topics: uniq(toys.map((t) => t.topic)),
    mechanisms: uniq(toys.map((t) => t.mechanism)),
    conditions: uniq(toys.map((t) => t.condition)),
    trademarks: uniq(toys.map((t) => t.trademark)),
  };
}

export interface ToyFilters {
  q?: string;
  type?: string;
  topic?: string;
  mechanism?: string;
  trademark?: string;
}

export function filterToys(filters: ToyFilters): Toy[] {
  const q = filters.q?.trim().toLowerCase();
  return toys.filter((t) => {
    if (filters.type && t.type !== filters.type) return false;
    if (filters.topic && t.topic !== filters.topic) return false;
    if (filters.mechanism && t.mechanism !== filters.mechanism) return false;
    if (filters.trademark && t.trademark !== filters.trademark) return false;
    if (q) {
      const haystack = `${t.name} ${t.description ?? ""} ${t.trademark ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export const TOY_SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "year-asc", label: "Year (Oldest first)" },
  { value: "year-desc", label: "Year (Newest first)" },
  { value: "trademark-asc", label: "Manufacturer (A–Z)" },
] as const;

export type ToySort = (typeof TOY_SORT_OPTIONS)[number]["value"];

export function sortToys(list: Toy[], sort?: string): Toy[] {
  const sorted = [...list];
  const year = (t: Toy) => Number(t.firstYear) || undefined;

  switch (sort) {
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "year-asc":
      return sorted.sort((a, b) => (year(a) ?? Infinity) - (year(b) ?? Infinity));
    case "year-desc":
      return sorted.sort((a, b) => (year(b) ?? -Infinity) - (year(a) ?? -Infinity));
    case "trademark-asc":
      return sorted.sort(
        (a, b) => (a.trademark ?? "").localeCompare(b.trademark ?? "") || a.name.localeCompare(b.name)
      );
    case "name-asc":
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export function getAllBooks(): Book[] {
  return books;
}

export function getBookById(id: number): Book | undefined {
  return books.find((b) => b.id === id);
}

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export function getToysReferencingBook(bookId: number): Toy[] {
  return toys.filter((t) => t.bookRefs.some((r) => r.bookId === bookId));
}

export function getAllManufacturers(): Manufacturer[] {
  return manufacturers;
}

export function getManufacturerBySlug(slug: string): Manufacturer | undefined {
  return manufacturers.find((m) => m.slug === slug);
}

export function getManufacturerByTrademark(trademark?: string): Manufacturer | undefined {
  if (!trademark) return undefined;
  return manufacturers.find((m) => m.trademark === trademark);
}

export function getToysByTrademark(trademark?: string): Toy[] {
  if (!trademark) return [];
  return toys.filter((t) => t.trademark === trademark);
}

export function getStats(): Stats {
  return stats;
}

export function getValueStats() {
  let totalLatestValue = 0;
  let totalCostKnown = 0;
  let toysWithValue = 0;
  let toysWithCost = 0;

  for (const toy of toys) {
    const entries = toy.private.valueEntries;
    if (entries.length > 0) {
      totalLatestValue += entries[entries.length - 1].amount;
      toysWithValue += 1;
    }
    const cost = Number(toy.private.cost);
    if (!Number.isNaN(cost) && cost > 0) {
      totalCostKnown += cost;
      toysWithCost += 1;
    }
  }

  return { totalLatestValue, totalCostKnown, toysWithValue, toysWithCost };
}

function parseDimensions(dimensions?: string): [number, number, number] | undefined {
  if (!dimensions) return undefined;
  const parts = dimensions
    .trim()
    .split(/x/i)
    .map((p) => Number(p.replace(",", ".")));
  if (parts.length !== 3 || parts.some((p) => Number.isNaN(p) || p <= 0)) return undefined;
  return parts as [number, number, number];
}

export interface ToySize {
  toy: Toy;
  volume: number;
}

export function getCollectionInsights() {
  const byDecade: Record<string, number> = {};
  const byCountry: Record<string, number> = {};
  const costByType: Record<string, number> = {};
  const costByTrademark: Record<string, number> = {};
  const sizes: ToySize[] = [];

  let toysWithPhoto = 0;
  const toysMissingPhoto: Toy[] = [];
  const toysMissingCost: Toy[] = [];
  const toysMissingManufacturer: Toy[] = [];

  for (const toy of toys) {
    const year = Number(toy.firstYear);
    if (!Number.isNaN(year) && year > 0) {
      const decade = `${Math.floor(year / 10) * 10}s`;
      byDecade[decade] = (byDecade[decade] ?? 0) + 1;
    }

    const manufacturer = getManufacturerByTrademark(toy.trademark);
    if (manufacturer?.country) {
      byCountry[manufacturer.country] = (byCountry[manufacturer.country] ?? 0) + 1;
    }

    const cost = Number(toy.private.cost);
    if (!Number.isNaN(cost) && cost > 0) {
      if (toy.type) costByType[toy.type] = (costByType[toy.type] ?? 0) + cost;
      if (toy.trademark) costByTrademark[toy.trademark] = (costByTrademark[toy.trademark] ?? 0) + cost;
    } else {
      toysMissingCost.push(toy);
    }

    const dims = parseDimensions(toy.dimensions);
    if (dims) sizes.push({ toy, volume: dims[0] * dims[1] * dims[2] });

    if (toy.photos.length > 0) {
      toysWithPhoto += 1;
    } else {
      toysMissingPhoto.push(toy);
    }

    if (!manufacturer) toysMissingManufacturer.push(toy);
  }

  const costs = toys
    .map((t) => Number(t.private.cost))
    .filter((c) => !Number.isNaN(c) && c > 0)
    .sort((a, b) => a - b);
  const medianCost = costs.length
    ? costs.length % 2 === 1
      ? costs[(costs.length - 1) / 2]
      : (costs[costs.length / 2 - 1] + costs[costs.length / 2]) / 2
    : 0;
  const avgCost = costs.length ? costs.reduce((a, b) => a + b, 0) / costs.length : 0;

  sizes.sort((a, b) => b.volume - a.volume);

  return {
    byDecade,
    byCountry,
    costByType,
    costByTrademark,
    avgCost,
    medianCost,
    largestToys: sizes.slice(0, 5),
    smallestToys: sizes.slice(-5).reverse(),
    photoCoveragePct: toys.length ? Math.round((toysWithPhoto / toys.length) * 100) : 0,
    toysMissingPhoto,
    toysMissingCost,
    toysMissingManufacturer,
    recentlyAdded: [...toys].sort((a, b) => b.id - a.id).slice(0, 8),
  };
}
