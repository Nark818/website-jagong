"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { ImagePlaceholder } from "@/components/site/image-placeholder";
import { cn } from "@/lib/utils";
import { NEWS, TAG_CLASSES, CAT_LABEL, type Category } from "@/lib/news";

const TABS: { value: "all" | Category; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "berita", label: "Berita" },
  { value: "pengumuman", label: "Pengumuman" },
];

const PAGE_SIZE = 6;

export default function BeritaPage() {
  const [activeTab, setActiveTab] = useState<"all" | Category>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = NEWS.filter(
    (item) => activeTab === "all" || item.cat === activeTab,
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleTabChange(tab: "all" | Category) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  return (
    <main className="flex-1">
      <PageHeader
        title="Berita & Pengumuman"
        subtitle="Informasi resmi dan kabar terbaru seputar kegiatan Kelurahan Jagong."
      />

      <section className="mx-auto max-w-[1120px] px-6 pt-10 pb-20">
        <div className="inline-flex gap-1 rounded-full border border-border-default bg-surface-card p-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium",
                activeTab === tab.value
                  ? "bg-ocean-600 text-white"
                  : "text-text-secondary",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {pageItems.map((item) => (
            <Link
              key={item.slug}
              href={`/berita/${item.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-border-default bg-surface-card no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative overflow-hidden">
                <ImagePlaceholder
                  label="Foto berita"
                  className="h-[170px] w-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <span
                  className={cn(
                    "w-fit rounded-full px-2.5 py-[3px] text-[11px] font-semibold tracking-wide uppercase",
                    TAG_CLASSES[item.cat],
                  )}
                >
                  {CAT_LABEL[item.cat]}
                </span>
                <h3 className="mt-1 mb-0 text-[18px] leading-snug text-text-primary transition-colors duration-200 group-hover:text-ocean-700">
                  {item.title}
                </h3>
                <p className="m-0 text-[13px] text-text-muted">{item.date}</p>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-text-secondary">
                  {item.excerpt}
                </p>
                <span className="mt-3 inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-ocean-700">
                  Baca selengkapnya{" "}
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Halaman sebelumnya"
              className="flex size-9 items-center justify-center rounded-full border border-border-default bg-surface-card text-text-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
              (p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-sm font-medium",
                    p === page
                      ? "bg-ocean-600 text-white"
                      : "border border-border-default bg-surface-card text-text-secondary",
                  )}
                >
                  {p}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Halaman berikutnya"
              className="flex size-9 items-center justify-center rounded-full border border-border-default bg-surface-card text-text-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
