import type { Metadata } from "next";
import { filterToys, getFilterOptions, sortToys, TOY_SORT_OPTIONS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Collection",
  description: "Browse over 600 antique mechanical toys — tin, clockwork, and battery-operated — catalogued with manufacturer, mechanism, materials, and condition.",
};
import ToyCard from "@/components/ToyCard";
import Pagination from "@/components/Pagination";
import HideOnScroll from "@/components/HideOnScroll";

const PAGE_SIZE = 42;

function Select({
  name,
  value,
  options,
  label,
}: {
  name: string;
  value?: string;
  options: string[];
  label: string;
}) {
  return (
    <label className="text-sm flex flex-col gap-1">
      <span className="text-muted text-xs uppercase tracking-wide">{label}</span>
      <select
        name={name}
        defaultValue={value ?? ""}
        className="border border-border rounded-md px-2 py-1.5 bg-card"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const filters = {
    q: params.q,
    type: params.type,
    topic: params.topic,
    mechanism: params.mechanism,
    trademark: params.trademark,
  };
  const sort = params.sort;
  const page = Math.max(1, Number(params.page) || 1);

  const filtered = sortToys(filterToys(filters), sort);
  const options = getFilterOptions();

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const toys = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl mb-6">Collection</h1>

      <HideOnScroll>
        <form
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-border grid grid-cols-2 sm:grid-cols-6 gap-3 mb-8 items-end"
          method="get"
        >
          <label className="text-sm flex flex-col gap-1 col-span-2 sm:col-span-1">
            <span className="text-muted text-xs uppercase tracking-wide">Search</span>
            <input
              type="text"
              name="q"
              defaultValue={filters.q ?? ""}
              placeholder="Name, description..."
              className="border border-border rounded-md px-2 py-1.5 bg-card"
            />
          </label>
          <Select name="type" label="Type" value={filters.type} options={options.types} />
          <Select name="topic" label="Topic" value={filters.topic} options={options.topics} />
          <Select
            name="mechanism"
            label="Mechanism"
            value={filters.mechanism}
            options={options.mechanisms}
          />
          <Select
            name="trademark"
            label="Manufacturer"
            value={filters.trademark}
            options={options.trademarks}
          />
          <label className="text-sm flex flex-col gap-1">
            <span className="text-muted text-xs uppercase tracking-wide">Sort by</span>
            <select
              name="sort"
              defaultValue={sort ?? "name-asc"}
              className="border border-border rounded-md px-2 py-1.5 bg-card"
            >
              {TOY_SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <div className="col-span-2 sm:col-span-6 flex gap-3">
            <button
              type="submit"
              className="bg-foreground text-background px-4 py-2 rounded-full text-sm"
            >
              Apply filters
            </button>
            <a href="/collection" className="text-sm text-muted self-center">
              Clear
            </a>
          </div>
        </form>
      </HideOnScroll>

      <p className="text-sm text-muted mb-4">
        {filtered.length} toys
        {totalPages > 1 ? ` · page ${currentPage} of ${totalPages}` : ""}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {toys.map((toy) => (
          <ToyCard key={toy.id} toy={toy} />
        ))}
      </div>

      <div className="mt-10">
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          params={{ ...filters, sort }}
        />
      </div>
    </div>
  );
}
