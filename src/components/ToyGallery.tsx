"use client";

import { useState } from "react";

export default function ToyGallery({ name, photos }: { name: string; photos: string[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="col-span-2 aspect-[4/3] rounded-lg bg-border/40 flex items-center justify-center text-muted text-sm">
        No photo available
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {photos.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={`${name} photo ${i + 1}`}
            onClick={() => setOpenIndex(i)}
            className={`w-full rounded-lg object-cover cursor-zoom-in ${i === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"}`}
          />
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpenIndex(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none"
          >
            &times;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[openIndex]}
            alt={`${name} photo ${openIndex + 1}`}
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
