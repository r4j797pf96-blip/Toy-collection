import { notFound } from "next/navigation";
import {
  getAllManufacturers,
  getManufacturerBySlug,
  getToysByTrademark,
} from "@/lib/data";
import ToyCard from "@/components/ToyCard";

export function generateStaticParams() {
  return getAllManufacturers().map((m) => ({ slug: m.slug }));
}

export default async function ManufacturerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const manufacturer = getManufacturerBySlug(slug);
  if (!manufacturer) notFound();

  const toys = getToysByTrademark(manufacturer.trademark);

  const facts: [string, string | undefined][] = [
    ["Country", manufacturer.country],
    ["Address", manufacturer.address],
    ["Active", [manufacturer.startActivity, manufacturer.endActivity].filter(Boolean).join(" – ")],
    ["Founder", manufacturer.founder],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl">{manufacturer.manufacturer ?? manufacturer.trademark}</h1>
      {manufacturer.trademark && manufacturer.trademark !== manufacturer.manufacturer && (
        <p className="text-accent text-sm mt-1">Trademark: {manufacturer.trademark}</p>
      )}

      {manufacturer.history && (
        <p className="mt-4 text-muted leading-relaxed max-w-2xl">{manufacturer.history}</p>
      )}

      <dl className="mt-6 divide-y divide-border text-sm max-w-2xl">
        {facts
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2">
              <dt className="text-muted shrink-0">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
      </dl>

      {manufacturer.typesOfToys && (
        <div className="mt-6 max-w-2xl">
          <h2 className="text-xs uppercase tracking-wide text-muted mb-1">Types of toys made</h2>
          <p className="text-sm leading-relaxed">{manufacturer.typesOfToys}</p>
        </div>
      )}

      {manufacturer.bibliography && (
        <div className="mt-4 max-w-2xl">
          <h2 className="text-xs uppercase tracking-wide text-muted mb-1">Bibliography</h2>
          <p className="text-sm leading-relaxed">{manufacturer.bibliography}</p>
        </div>
      )}

      {manufacturer.sources && manufacturer.sources.length > 0 && (
        <div className="mt-6 max-w-2xl">
          <h2 className="text-xs uppercase tracking-wide text-muted mb-2">Sources</h2>
          <ul className="space-y-1">
            {manufacturer.sources.map((url) => (
              <li key={url} className="text-sm truncate">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {toys.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl mb-4">
            Toys by {manufacturer.manufacturer ?? manufacturer.trademark}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {toys.map((t) => (
              <ToyCard key={t.id} toy={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
