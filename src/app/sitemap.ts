import type { MetadataRoute } from "next";
import { getAllToys, getAllManufacturers, getAllBooks } from "@/lib/data";

const BASE = "https://www.mechanicaltoyarchive.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1 },
    { url: `${BASE}/collection`, priority: 0.9 },
    { url: `${BASE}/manufacturers`, priority: 0.8 },
    { url: `${BASE}/mechanisms`, priority: 0.8 },
    { url: `${BASE}/library`, priority: 0.7 },
    { url: `${BASE}/about`, priority: 0.5 },
  ];

  const toyPages: MetadataRoute.Sitemap = getAllToys().map((t) => ({
    url: `${BASE}/collection/${t.slug}`,
    priority: 0.7,
  }));

  const manufacturerPages: MetadataRoute.Sitemap = getAllManufacturers().map((m) => ({
    url: `${BASE}/manufacturers/${m.slug}`,
    priority: 0.6,
  }));

  const bookPages: MetadataRoute.Sitemap = getAllBooks().map((b) => ({
    url: `${BASE}/library/${b.slug}`,
    priority: 0.5,
  }));

  return [...staticPages, ...toyPages, ...manufacturerPages, ...bookPages];
}
