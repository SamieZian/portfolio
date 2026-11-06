import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://sampathake.in", lastModified: new Date("2026-11-06"), priority: 1 }];
}
