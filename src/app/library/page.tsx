import Link from "next/link";
import { getAllBooks, getToysReferencingBook } from "@/lib/data";

export default function LibraryPage() {
  const books = [...getAllBooks()].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl mb-6">Library</h1>
      <ul className="divide-y divide-border">
        {books.map((b) => {
          const count = getToysReferencingBook(b.id).length;
          return (
            <li key={b.id} className="py-3 flex items-start justify-between gap-4">
              <div>
                <Link href={`/library/${b.slug}`} className="hover:underline font-medium">
                  {b.title}
                </Link>
                <p className="text-sm text-muted">
                  {[b.authors, b.year, b.publisher].filter(Boolean).join(" · ")}
                </p>
              </div>
              {count > 0 && (
                <span className="text-xs text-muted border border-border rounded-full px-2.5 py-1 shrink-0">
                  {count} toy{count === 1 ? "" : "s"}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
