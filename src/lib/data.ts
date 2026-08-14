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
    .filter((t) => t.id !== toy.id)
    .map((t) => {
      let score = 0;
      if (toy.topic && t.topic === toy.topic) score += 4;
      if (toy.type && t.type === toy.type) score += 2;
      if (toy.trademark && t.trademark === toy.trademark) score += 1;
      return { t, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ t }) => t);
}

function hashSeed(n: number): number {
  let h = n * 2654435761;
  h = (h ^ (h >>> 16)) >>> 0;
  return h;
}

export function getResearchHighlights(count = 3): Toy[] {
  const candidates = toys.filter((t) => (t.research?.trim().length ?? 0) > 40);
  return [...candidates].sort((a, b) => hashSeed(a.id) - hashSeed(b.id)).slice(0, count);
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

const COUNTRY_DEMONYMS: Record<string, string[]> = {
  Argentina: ["argentine", "argentinian"],
  China: ["chinese"],
  "Czech Republic": ["czech"],
  England: ["english"],
  France: ["french"],
  Germany: ["german"],
  "West Germany": ["german"],
  "Hong Kong": ["hong kong"],
  Hungary: ["hungarian"],
  India: ["indian"],
  Italy: ["italian"],
  Japan: ["japanese"],
  Portugal: ["portuguese"],
  "South Korea": ["korean"],
  Spain: ["spanish"],
  Taiwan: ["taiwanese"],
  "U.K.": ["british", "english", "uk"],
  UK: ["british", "english"],
  "U.S.A.": ["american", "usa", "us"],
  USA: ["american", "us"],
  URSS: ["soviet", "russian", "ussr"],
};

function countryMatches(country: string | undefined, q: string): boolean {
  if (!country) return false;
  if (country.toLowerCase().includes(q)) return true;
  const demonyms = COUNTRY_DEMONYMS[country] ?? [];
  return demonyms.some((d) => d.includes(q) || q.includes(d));
}

function decadeRangeForQuery(q: string): [number, number] | undefined {
  const fourDigit = q.match(/^(\d{4})s$/);
  if (fourDigit) {
    const start = Number(fourDigit[1]);
    return [start, start + 9];
  }
  const twoDigit = q.match(/^(\d{2})s$/);
  if (twoDigit) {
    return [Number(twoDigit[1]), Number(twoDigit[1])];
  }
  return undefined;
}

function toyMatchesYear(toy: Toy, year: number): boolean {
  const first = Number(toy.firstYear);
  const last = Number(toy.lastYear) || first;
  if (Number.isNaN(first)) return false;
  return year >= first && year <= last;
}

function toyMatchesDecadeQuery(toy: Toy, q: string): boolean {
  const range = decadeRangeForQuery(q);
  if (!range) return false;
  const [start, end] = range;
  // Two-digit shorthand ("50s"): try every century the collection could span.
  const candidateStarts = end - start === 0 ? [1800 + start, 1900 + start, 2000 + start] : [start];
  return candidateStarts.some((decadeStart) => {
    const decadeEnd = end - start === 0 ? decadeStart + 9 : end;
    const first = Number(toy.firstYear);
    const last = Number(toy.lastYear) || first;
    if (Number.isNaN(first)) return false;
    return first <= decadeEnd && last >= decadeStart;
  });
}

export function filterToys(filters: ToyFilters): Toy[] {
  const q = filters.q?.trim().toLowerCase();
  return toys.filter((t) => {
    if (filters.type && t.type !== filters.type) return false;
    if (filters.topic && t.topic !== filters.topic) return false;
    if (filters.mechanism && t.mechanism !== filters.mechanism) return false;
    if (filters.trademark && t.trademark !== filters.trademark) return false;
    if (q) {
      const manufacturer = getManufacturerByTrademark(t.trademark);
      const haystack = [
        t.name,
        ...t.aliases,
        t.description,
        t.trademark,
        t.type,
        t.topic,
        t.mechanism,
        t.condition,
        t.materials,
        t.model,
        manufacturer?.manufacturer,
        manufacturer?.country,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const textMatch = haystack.includes(q);
      const countryMatch = countryMatches(manufacturer?.country, q);
      const yearMatch = /^\d{4}$/.test(q) ? toyMatchesYear(t, Number(q)) : false;
      const decadeMatch = toyMatchesDecadeQuery(t, q);

      if (!textMatch && !countryMatch && !yearMatch && !decadeMatch) return false;
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
      return sorted.sort((a, b) => b.displayName.localeCompare(a.displayName));
    case "year-asc":
      return sorted.sort((a, b) => (year(a) ?? Infinity) - (year(b) ?? Infinity));
    case "year-desc":
      return sorted.sort((a, b) => (year(b) ?? -Infinity) - (year(a) ?? -Infinity));
    case "trademark-asc":
      return sorted.sort(
        (a, b) => (a.trademark ?? "").localeCompare(b.trademark ?? "") || a.displayName.localeCompare(b.displayName)
      );
    case "name-asc":
    default:
      return sorted.sort((a, b) => a.displayName.localeCompare(b.displayName));
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

export function getToysWithMechanisms(): Toy[] {
  return toys.filter((t) => t.mechPhotos.length > 0 || t.mechDescription);
}
