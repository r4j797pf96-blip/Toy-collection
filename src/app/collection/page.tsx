import { filterToys, getFilterOptions } from "@/lib/data";
import ToyCard from "@/components/ToyCard";

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
  const toys = filterToys(filters);
  const options = getFilterOptions();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl mb-6">Collection</h1>

      <form className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8 items-end" method="get">
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
        <div className="col-span-2 sm:col-span-5 flex gap-3">
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

      <p className="text-sm text-muted mb-4">{toys.length} toys</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {toys.map((toy) => (
          <ToyCard key={toy.id} toy={toy} />
        ))}
      </div>
    </div>
  );
}
