import type { MetadataRoute } from "next";
import { getAllToys, getAllManufacturers, getAllBooks } from "@/lib/data";

const BASE = "https://www.mechanicaltoyarchive.com";
const BUILT_AT = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1, lastModified: BUILT_AT },
    { url: `${BASE}/collection`, priority: 0.9, lastModified: BUILT_AT },
    { url: `${BASE}/manufacturers`, priority: 0.8, lastModified: BUILT_AT },
    { url: `${BASE}/mechanisms`, priority: 0.8, lastModified: BUILT_AT },
    { url: `${BASE}/library`, priority: 0.7, lastModified: BUILT_AT },
    { url: `${BASE}/about`, priority: 0.5, lastModified: BUILT_AT },
  ];

  const toyPages: MetadataRoute.Sitemap = getAllToys().map((t) => ({
    url: `${BASE}/collection/${t.slug}`,
    priority: 0.7,
    lastModified: BUILT_AT,
  }));

  const manufacturerPages: MetadataRoute.Sitemap = getAllManufacturers().map((m) => ({
    url: `${BASE}/manufacturers/${m.slug}`,
    priority: 0.6,
    lastModified: BUILT_AT,
  }));

  const bookPages: MetadataRoute.Sitemap = getAllBooks().map((b) => ({
    url: `${BASE}/library/${b.slug}`,
    priority: 0.5,
    lastModified: BUILT_AT,
  }));

  return [...staticPages, ...toyPages, ...manufacturerPages, ...bookPages];
}
