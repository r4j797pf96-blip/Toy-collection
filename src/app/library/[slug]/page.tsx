import { notFound } from "next/navigation";
import { getAllBooks, getBookBySlug, getToysReferencingBook } from "@/lib/data";
import ToyCard from "@/components/ToyCard";

export function generateStaticParams() {
  return getAllBooks().map((b) => ({ slug: b.slug }));
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  const toys = getToysReferencingBook(book.id);

  const facts: [string, string | undefined][] = [
    ["Author(s)", book.authors],
    ["Year", book.year],
    ["Publisher", book.publisher],
    ["City/Country", book.location],
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl">{book.title}</h1>

      <dl className="mt-6 divide-y divide-border text-sm max-w-xl">
        {facts
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
      </dl>

      {book.notes && <p className="mt-4 text-sm text-muted">{book.notes}</p>}

      {toys.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl mb-4">Our toys featured in this book</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {toys.map((t) => (
              <ToyCard key={t.id} toy={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
