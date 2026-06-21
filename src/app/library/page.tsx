import Link from "next/link";
import { getAllBooks } from "@/lib/data";

export default function LibraryPage() {
  const books = [...getAllBooks()].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl mb-6">Library</h1>
      <ul className="divide-y divide-border">
        {books.map((b) => (
          <li key={b.id} className="py-3">
            <Link href={`/library/${b.slug}`} className="hover:underline font-medium">
              {b.title}
            </Link>
            <p className="text-sm text-muted">
              {[b.authors, b.year, b.publisher].filter(Boolean).join(" · ")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
