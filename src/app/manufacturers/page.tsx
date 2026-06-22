import Link from "next/link";
import { getAllManufacturers, getAllToys } from "@/lib/data";

export default async function ManufacturersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { sort } = await searchParams;
  const manufacturers = getAllManufacturers();
  const toys = getAllToys();
  const counts = new Map<string, number>();
  for (const t of toys) {
    if (t.trademark) counts.set(t.trademark, (counts.get(t.trademark) ?? 0) + 1);
  }

  const sorted = [...manufacturers].sort((a, b) =>
    sort === "alpha"
      ? (a.trademark ?? "").localeCompare(b.trademark ?? "")
      : (counts.get(b.trademark ?? "") ?? 0) - (counts.get(a.trademark ?? "") ?? 0)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <h1 className="font-serif text-3xl">Manufacturers</h1>
        <div className="flex gap-2 text-sm">
          <Link
            href="/manufacturers"
            className={`px-3 py-1.5 rounded-full border ${
              sort !== "alpha"
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted hover:bg-card"
            }`}
          >
            Most toys
          </Link>
          <Link
            href="/manufacturers?sort=alpha"
            className={`px-3 py-1.5 rounded-full border ${
              sort === "alpha"
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted hover:bg-card"
            }`}
          >
            A–Z
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((m) => {
          const count = counts.get(m.trademark ?? "") ?? 0;
          return (
            <Link
              key={m.id}
              href={`/manufacturers/${m.slug}`}
              className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition"
            >
              <p className="font-medium">{m.trademark ?? m.manufacturer}</p>
              <p className="text-sm text-muted mt-1">
                {m.country ?? "Unknown country"} · {count} toy{count === 1 ? "" : "s"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
