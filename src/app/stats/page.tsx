import Link from "next/link";
import { getCollectionInsights, getStats, getValueStats } from "@/lib/data";

function BarList({
  data,
  max = 8,
  format,
  sort = "value",
}: {
  data: Record<string, number>;
  max?: number;
  format?: (v: number) => string;
  sort?: "value" | "label";
}) {
  const entries = Object.entries(data).sort((a, b) =>
    sort === "label" ? a[0].localeCompare(b[0], undefined, { numeric: true }) : b[1] - a[1]
  );
  const limited = sort === "label" ? entries : entries.slice(0, max);
  const top = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <ul className="space-y-2">
      {limited.map(([label, value]) => (
        <li key={label} className="text-sm">
          <div className="flex justify-between mb-1">
            <span>{label}</span>
            <span className="text-muted">{format ? format(value) : value}</span>
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
  const insights = getCollectionInsights();
  const euro = (v: number) => `€${Math.round(v).toLocaleString()}`;

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
        <div>
          <h2 className="font-serif text-xl mb-4">By decade of manufacture</h2>
          <BarList data={insights.byDecade} sort="label" />
        </div>
        <div>
          <h2 className="font-serif text-xl mb-4">By country of origin</h2>
          <BarList data={insights.byCountry} />
        </div>
        <div>
          <h2 className="font-serif text-xl mb-4">Acquisition cost by type</h2>
          <BarList data={insights.costByType} format={euro} />
        </div>
        <div>
          <h2 className="font-serif text-xl mb-4">Acquisition cost by manufacturer</h2>
          <BarList data={insights.costByTrademark} format={euro} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 my-12">
        <div className="border border-border rounded-lg p-5 bg-card">
          <p className="text-2xl font-serif">{euro(insights.avgCost)}</p>
          <p className="text-sm text-muted">Average acquisition cost</p>
        </div>
        <div className="border border-border rounded-lg p-5 bg-card">
          <p className="text-2xl font-serif">{euro(insights.medianCost)}</p>
          <p className="text-sm text-muted">Median acquisition cost</p>
        </div>
        <div className="border border-border rounded-lg p-5 bg-card">
          <p className="text-2xl font-serif">{insights.photoCoveragePct}%</p>
          <p className="text-sm text-muted">Toys with at least one photo</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-10 mb-12">
        <div>
          <h2 className="font-serif text-xl mb-4">Largest pieces</h2>
          <ul className="space-y-1 text-sm">
            {insights.largestToys.map(({ toy }) => (
              <li key={toy.id} className="flex justify-between gap-4">
                <Link href={`/collection/${toy.slug}`} className="hover:underline">
                  {toy.name}
                </Link>
                <span className="text-muted shrink-0">{toy.dimensions} cm</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-xl mb-4">Smallest pieces</h2>
          <ul className="space-y-1 text-sm">
            {insights.smallestToys.map(({ toy }) => (
              <li key={toy.id} className="flex justify-between gap-4">
                <Link href={`/collection/${toy.slug}`} className="hover:underline">
                  {toy.name}
                </Link>
                <span className="text-muted shrink-0">{toy.dimensions} cm</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="font-serif text-xl mb-4">Recently added to the catalogue</h2>
        <ul className="grid sm:grid-cols-2 gap-1 text-sm">
          {insights.recentlyAdded.map((toy) => (
            <li key={toy.id}>
              <Link href={`/collection/${toy.slug}`} className="hover:underline">
                {toy.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-serif text-xl mb-4">Cataloguing health</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="border border-border rounded-lg p-4 bg-card">
            <p className="font-medium mb-1">{insights.toysMissingPhoto.length} missing photos</p>
            <ul className="space-y-0.5 text-muted">
              {insights.toysMissingPhoto.slice(0, 5).map((t) => (
                <li key={t.id}>
                  <Link href={`/collection/${t.slug}`} className="hover:underline">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <p className="font-medium mb-1">{insights.toysMissingCost.length} missing cost</p>
            <ul className="space-y-0.5 text-muted">
              {insights.toysMissingCost.slice(0, 5).map((t) => (
                <li key={t.id}>
                  <Link href={`/collection/${t.slug}`} className="hover:underline">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <p className="font-medium mb-1">
              {insights.toysMissingManufacturer.length} missing manufacturer match
            </p>
            <ul className="space-y-0.5 text-muted">
              {insights.toysMissingManufacturer.slice(0, 5).map((t) => (
                <li key={t.id}>
                  <Link href={`/collection/${t.slug}`} className="hover:underline">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
