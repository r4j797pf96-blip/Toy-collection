"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BackToCollection() {
  const router = useRouter();

  return (
    <Link
      href="/collection"
      className="text-sm text-muted hover:text-foreground"
      onClick={(e) => {
        if (window.history.length > 1) {
          e.preventDefault();
          router.back();
        }
      }}
    >
      ← Back to Collection
    </Link>
  );
}
