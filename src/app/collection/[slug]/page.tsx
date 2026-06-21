import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllToys,
  getBookById,
  getManufacturerByTrademark,
  getRelatedToys,
  getToyBySlug,
} from "@/lib/data";
import ToyCard from "@/components/ToyCard";
import ToyGallery from "@/components/ToyGallery";

export function generateStaticParams() {
  return getAllToys().map((t) => ({ slug: t.slug }));
}

export default async function ToyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const toy = getToyBySlug(slug);
  if (!toy) notFound();

  const manufacturer = getManufacturerByTrademark(toy.trademark);
  const related = getRelatedToys(toy);

  const specs: [string, string | undefined][] = [
    ["Model", toy.model],
    ["Type", toy.type],
    ["Topic", toy.topic],
    ["Mechanism", toy.mechanism],
    ["Movement", toy.movementDescription],
    ["Materials", toy.materials],
    ["Dimensions (LxWxH cm)", toy.dimensions],
    ["Condition", toy.condition],
    ["Manufactured", [toy.firstYear, toy.lastYear].filter(Boolean).join(" – ")],
    ["Box", toy.boxDescription],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <Link href="/collection" className="text-sm text-muted hover:text-foreground">
        ← Back to Collection
      </Link>

      <div className="mt-6 grid sm:grid-cols-2 gap-10">
        <ToyGallery name={toy.name} photos={toy.photos} />

        <div>
          <h1 className="font-serif text-3xl leading-tight">{toy.name}</h1>
          {manufacturer ? (
            <Link
              href={`/manufacturers/${manufacturer.slug}`}
              className="text-accent text-sm mt-1 inline-block hover:underline"
            >
              {manufacturer.manufacturer ?? manufacturer.trademark}
            </Link>
          ) : toy.trademark ? (
            <p className="text-accent text-sm mt-1">{toy.trademark}</p>
          ) : null}

          {toy.description && <p className="mt-4 text-muted leading-relaxed">{toy.description}</p>}

          <dl className="mt-6 divide-y divide-border text-sm">
            {specs
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
          </dl>

          {toy.research && (
            <div className="mt-6">
              <h2 className="text-xs uppercase tracking-wide text-muted mb-1">Research notes</h2>
              <p className="text-sm leading-relaxed">{toy.research}</p>
            </div>
          )}

          {toy.notes && (
            <div className="mt-4">
              <h2 className="text-xs uppercase tracking-wide text-muted mb-1">Notes</h2>
              <p className="text-sm leading-relaxed">{toy.notes}</p>
            </div>
          )}

          {toy.bookRefs.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xs uppercase tracking-wide text-muted mb-2">Featured in</h2>
              <ul className="space-y-1">
                {toy.bookRefs.map((ref) => {
                  const book = getBookById(ref.bookId);
                  if (!book) return null;
                  return (
                    <li key={ref.bookId} className="text-sm">
                      <Link href={`/library/${book.slug}`} className="hover:underline">
                        {book.title}
                      </Link>
                      {ref.pages && <span className="text-muted"> — p. {ref.pages}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl mb-4">Related toys</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((t) => (
              <ToyCard key={t.id} toy={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
