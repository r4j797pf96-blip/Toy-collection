import { notFound } from "next/navigation";
import Image from "next/image";
import { getManufacturerByTrademark, getToyBySlug } from "@/lib/data";
import PrintButton from "@/components/PrintButton";

export default async function ToyPrintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const toy = getToyBySlug(slug);
  if (!toy) notFound();

  const manufacturer = getManufacturerByTrademark(toy.trademark);

  const specs: [string, string | undefined][] = [
    ["Model", toy.model],
    ["Type", toy.type],
    ["Topic", toy.topic],
    ["Country of manufacture", manufacturer?.country],
    ["Mechanism", toy.mechanism],
    ["Materials", toy.materials],
    ["Dimensions (LxWxH cm)", toy.dimensions],
    ["Condition", toy.condition],
    ["Manufactured", [toy.firstYear, toy.lastYear].filter(Boolean).join(" – ")],
  ];

  const privateFacts: [string, string | undefined][] = [
    ["Acquisition cost", toy.private.cost ? `€${toy.private.cost}` : undefined],
    ["Purchase date", toy.private.purchaseDate],
    ["Purchase source", toy.private.purchaseSource],
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <p className="text-sm text-muted">Private — for personal/insurance records only.</p>
        <PrintButton />
      </div>

      <h1 className="font-serif text-2xl mb-1">{toy.name}</h1>
      <p className="text-sm text-muted mb-6">
        {manufacturer?.trademark ?? manufacturer?.manufacturer ?? toy.trademark}
      </p>

      {toy.photos[0] && (
        <div className="relative w-full aspect-[4/3] mb-6 bg-border/40 rounded-md overflow-hidden">
          <Image src={toy.photos[0]} alt={toy.name} fill className="object-contain" />
        </div>
      )}

      <dl className="divide-y divide-border text-sm">
        {specs
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
      </dl>

      <h2 className="text-xs uppercase tracking-wide text-muted mt-8 mb-1">
        Valuation record (private)
      </h2>
      <dl className="divide-y divide-border text-sm">
        {privateFacts
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
      </dl>

      {toy.private.valueEntries.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs uppercase tracking-wide text-muted mb-2">
            Estimated value history
          </h3>
          <ul className="text-sm space-y-1">
            {toy.private.valueEntries.map((entry, i) => (
              <li key={i} className="flex justify-between gap-4">
                <span className="text-muted">{entry.note ?? `Entry ${i + 1}`}</span>
                <span>€{entry.amount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
