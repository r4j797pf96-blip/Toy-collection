import Link from "next/link";
import { getToysWithMechanisms } from "@/lib/data";

export const metadata = {
  title: "Mechanisms — The Mechanical Toy Archive",
};

export default function MechanismsPage() {
  const toys = getToysWithMechanisms();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="font-serif text-4xl sm:text-5xl leading-tight mb-4">Mechanisms</h1>
      <p className="text-muted max-w-2xl leading-relaxed mb-12">
        What makes a mechanical toy come alive is the ingenuity hidden inside it — cams, gears,
        levers and springs working in concert to produce lifelike motion from a simple motor or
        wound spring. This section documents the internal mechanisms of selected toys in the
        collection, with annotated photographs and detailed descriptions.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {toys.map((toy) => (
          <Link
            key={toy.id}
            href={`/collection/${toy.slug}#mechanism`}
            className="group border border-border rounded-xl overflow-hidden bg-card hover:shadow-md transition"
          >
            {(toy.mechThumbnail ?? toy.mechPhotos[0]) && (
              <div className="aspect-[4/3] overflow-hidden bg-border/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={toy.mechThumbnail ?? toy.mechPhotos[0]}
                  alt={`${toy.displayName} mechanism`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted mb-1">{toy.mechanism ?? "Mechanism"}</p>
              <p className="font-serif text-lg leading-snug">{toy.displayName}</p>
              {toy.trademark && (
                <p className="text-xs text-muted mt-1">
                  {toy.trademark}
                  {toy.firstYear ? ` · ${toy.firstYear}` : ""}
                </p>
              )}
              {toy.mechDescription && (
                <p className="text-sm text-muted mt-3 leading-relaxed line-clamp-3">
                  {toy.mechDescription}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
