import Link from "next/link";

function hrefFor(params: Record<string, string | undefined>, page: number) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) usp.set(k, v);
  }
  if (page > 1) usp.set("page", String(page));
  const qs = usp.toString();
  return qs ? `/collection?${qs}` : "/collection";
}

export default function Pagination({
  page,
  totalPages,
  params,
}: {
  page: number;
  totalPages: number;
  params: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="flex items-center justify-center gap-1 text-sm">
      <Link
        href={hrefFor(params, Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={`px-3 py-1.5 rounded-md border border-border ${
          page === 1 ? "pointer-events-none text-muted/40" : "hover:bg-card"
        }`}
      >
        Prev
      </Link>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-muted">…</span>}
          <Link
            href={hrefFor(params, p)}
            className={`px-3 py-1.5 rounded-md border ${
              p === page ? "border-foreground bg-foreground text-background" : "border-border hover:bg-card"
            }`}
          >
            {p}
          </Link>
        </span>
      ))}

      <Link
        href={hrefFor(params, Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={`px-3 py-1.5 rounded-md border border-border ${
          page === totalPages ? "pointer-events-none text-muted/40" : "hover:bg-card"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
