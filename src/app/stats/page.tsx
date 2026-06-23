import { getStats, getValueStats } from "@/lib/data";

function BarList({ data, max = 8 }: { data: Record<string, number>; max?: number }) {
  const entries = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max);
  const top = entries[0]?.[1] ?? 1;

  return (
    <ul className="space-y-2">
      {entries.map(([label, value]) => (
        <li key={label} className="text-sm">
          <div className="flex justify-between mb-1">
            <span>{label}</span>
            <span className="text-muted">{value}</span>
          </div>
          <div className="h-1.5 rounded-full bg-border">
            <div
              className="h-1.5 rounded-full bg-accent"
              style={{ width: `${(value / top) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function StatsPage() {
  const stats = getStats();
  const value = getValueStats();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl mb-1">Collection Stats</h1>
      <p className="text-sm text-muted mb-10">Private — visible only to collection owners.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <div className="border border-border rounded-lg p-5 bg-card">
          <p className="text-3xl font-serif">{stats.totalToys}</p>
          <p className="text-sm text-muted">Toys catalogued</p>
        </div>
        <div className="border border-border rounded-lg p-5 bg-card">
          <p className="text-3xl font-serif">{stats.totalManufacturers}</p>
          <p className="text-sm text-muted">Manufacturers</p>
        </div>
        <div className="border border-border rounded-lg p-5 bg-card">
          <p className="text-3xl font-serif">{stats.totalBooks}</p>
          <p className="text-sm text-muted">Reference books</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <div className="border border-border rounded-lg p-5 bg-card">
          <p className="text-2xl font-serif">€{value.totalCostKnown.toLocaleString()}</p>
          <p className="text-sm text-muted">
            Total recorded acquisition cost ({value.toysWithCost} toys)
          </p>
        </div>
        <div className="border border-border rounded-lg p-5 bg-card">
          <p className="text-2xl font-serif">€{value.totalLatestValue.toLocaleString()}</p>
          <p className="text-sm text-muted">Latest estimated value ({value.toysWithValue} toys)</p>
        </div>
        <div className="border border-border rounded-lg p-5 bg-card">
          <p className="text-2xl font-serif">
            {value.totalCostKnown > 0
              ? `${Math.round((value.totalLatestValue / value.totalCostKnown - 1) * 100)}%`
              : "—"}
          </p>
          <p className="text-sm text-muted">Estimated appreciation</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-10">
        <div>
          <h2 className="font-serif text-xl mb-4">By type of toy</h2>
          <BarList data={stats.byType} />
        </div>
        <div>
          <h2 className="font-serif text-xl mb-4">By topic</h2>
          <BarList data={stats.byTopic} />
        </div>
        <div>
          <h2 className="font-serif text-xl mb-4">By mechanism</h2>
          <BarList data={stats.byMechanism} />
        </div>
        <div>
          <h2 className="font-serif text-xl mb-4">By condition</h2>
          <BarList data={stats.byCondition} />
        </div>
        <div>
          <h2 className="font-serif text-xl mb-4">Top manufacturers</h2>
          <BarList data={stats.byTrademark} />
        </div>
      </div>
    </div>
  );
}
