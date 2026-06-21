import Link from "next/link";
import { getAllManufacturers, getAllToys } from "@/lib/data";

export default function ManufacturersPage() {
  const manufacturers = getAllManufacturers();
  const toys = getAllToys();
  const counts = new Map<string, number>();
  for (const t of toys) {
    if (t.trademark) counts.set(t.trademark, (counts.get(t.trademark) ?? 0) + 1);
  }

  const sorted = [...manufacturers].sort(
    (a, b) => (counts.get(b.trademark ?? "") ?? 0) - (counts.get(a.trademark ?? "") ?? 0)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl mb-6">Manufacturers</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((m) => {
          const count = counts.get(m.trademark ?? "") ?? 0;
          return (
            <Link
              key={m.id}
              href={`/manufacturers/${m.slug}`}
              className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition"
            >
              <p className="font-medium">{m.manufacturer ?? m.trademark}</p>
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
