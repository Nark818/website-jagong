import type { MetadataRoute } from "next";
import { getNewsPosts } from "@/lib/supabase/queries";

const siteUrl = "https://kelurahanjagong.vercel.app";

const staticRoutes = [
  "",
  "/profil",
  "/profil/galeri",
  "/layanan-publik",
  "/data-penduduk",
  "/berita",
  "/peta-desa",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getNewsPosts();

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
    })),
    ...news.map((post) => ({
      url: `${siteUrl}/berita/${post.slug}`,
      lastModified: new Date(post.published_at),
    })),
  ];
}
