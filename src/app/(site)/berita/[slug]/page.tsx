import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { ImagePlaceholder } from "@/components/site/image-placeholder";
import { cn } from "@/lib/utils";
import {
  NEWS,
  CAT_LABEL,
  CAT_BADGE_CLASSES,
  CAT_ICON,
  TAG_CLASSES,
  getNewsBySlug,
} from "@/lib/news";

export async function generateStaticParams() {
  return NEWS.map((item) => ({ slug: item.slug }));
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = getNewsBySlug(slug);
  if (!news) notFound();

  const CatIcon = CAT_ICON[news.cat];
  const sameCategory = NEWS.filter(
    (item) => item.slug !== news.slug && item.cat === news.cat,
  );
  const related = (
    sameCategory.length > 0
      ? sameCategory
      : NEWS.filter((item) => item.slug !== news.slug)
  ).slice(0, 3);

  return (
    <main className="flex-1">
      <section className="bg-ocean-800 px-6 pt-10 pb-20">
        <div className="mx-auto max-w-[820px]">
          <div className="mb-4 flex flex-wrap items-center gap-1.5 text-[13px]">
            <Link
              href="/"
              className="text-ocean-100 no-underline hover:underline"
            >
              Beranda
            </Link>
            <span className="text-ocean-300">/</span>
            <Link
              href="/berita"
              className="text-ocean-100 no-underline hover:underline"
            >
              Berita & Pengumuman
            </Link>
            <span className="text-ocean-300">/</span>
            <span className="text-white">{CAT_LABEL[news.cat]}</span>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase",
              CAT_BADGE_CLASSES[news.cat],
            )}
          >
            <CatIcon className="size-3.5" />
            {CAT_LABEL[news.cat]}
          </span>
          <h1 className="font-display mt-3 mb-0 text-[clamp(26px,4vw,38px)] leading-tight text-white">
            {news.title}
          </h1>
          <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-ocean-100">
            <Calendar className="size-4" />
            {news.date}
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-12 max-w-[820px] px-6 pb-20">
        <div className="animate-in fade-in slide-in-from-bottom-4 overflow-hidden rounded-2xl bg-surface-card shadow-xl duration-500">
          <ImagePlaceholder
            label="Foto berita"
            className="h-[280px] w-full sm:h-[360px]"
          />
          <div className="p-6 sm:p-10">
            <p className="text-[17px] leading-relaxed text-text-secondary">
              {news.full}
            </p>
          </div>
        </div>

        <Link
          href="/berita"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 no-underline hover:underline"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Berita &amp; Pengumuman
        </Link>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-5 text-lg text-text-primary">Berita Lainnya</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/berita/${item.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border-default bg-surface-card no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <ImagePlaceholder
                    label="Foto berita"
                    className="h-[120px] w-full"
                  />
                  <div className="flex flex-1 flex-col gap-1.5 p-4">
                    <span
                      className={cn(
                        "w-fit rounded-full px-2 py-[2px] text-[10px] font-semibold tracking-wide uppercase",
                        TAG_CLASSES[item.cat],
                      )}
                    >
                      {CAT_LABEL[item.cat]}
                    </span>
                    <h3 className="mt-1 mb-0 text-sm leading-snug text-text-primary transition-colors duration-200 group-hover:text-ocean-700">
                      {item.title}
                    </h3>
                    <p className="m-0 text-[12px] text-text-muted">
                      {item.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
