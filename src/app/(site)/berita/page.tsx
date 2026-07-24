"use client";

import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { ImagePlaceholder } from "@/components/site/image-placeholder";
import { cn } from "@/lib/utils";

type Category = "berita" | "pengumuman";

const NEWS: {
  cat: Category;
  title: string;
  date: string;
  excerpt: string;
  full: string;
}[] = [
  {
    cat: "pengumuman",
    title: "Jadwal Musyawarah Kelurahan Tahun 2026",
    date: "18 Juli 2026",
    excerpt:
      "Musyawarah kelurahan membahas RKP Kelurahan 2027 akan dilaksanakan di Balai Kelurahan Jagong.",
    full: "Seluruh kepala keluarga diundang untuk hadir dalam musyawarah kelurahan membahas Rencana Kerja Pemerintah (RKP) Kelurahan tahun 2027. Musyawarah akan membahas prioritas pembangunan, alokasi Dana Kelurahan, dan program bantuan sosial. (Teks contoh)",
  },
  {
    cat: "berita",
    title: "Panen Raya Jagung di Dusun Bontoa Berjalan Lancar",
    date: "12 Juli 2026",
    excerpt:
      "Musim panen jagung tahun ini mencatat hasil yang baik berkat program penyuluhan pertanian kelurahan.",
    full: "Kelompok tani Dusun Bontoa berhasil memanen jagung dengan hasil di atas rata-rata tahun sebelumnya, berkat pendampingan penyuluh pertanian dan penggunaan bibit unggul. (Teks contoh)",
  },
  {
    cat: "pengumuman",
    title: "Pembukaan Pendaftaran Bantuan Sosial Tahap II",
    date: "5 Juli 2026",
    excerpt:
      "Pendaftaran bantuan sosial tahap II dibuka mulai 8 Juli hingga 20 Juli 2026 di kantor kelurahan.",
    full: "Warga yang memenuhi kriteria dapat mendaftar bantuan sosial tahap II dengan membawa KTP, KK, dan surat keterangan tidak mampu ke kantor kelurahan pada jam kerja. (Teks contoh)",
  },
  {
    cat: "berita",
    title: "Gotong Royong Bersih Kelurahan Digelar Serentak",
    date: "28 Juni 2026",
    excerpt:
      "Warga empat dusun berpartisipasi dalam kegiatan gotong royong membersihkan saluran air dan jalan kelurahan.",
    full: "Kegiatan gotong royong rutin bulanan ini bertujuan menjaga kebersihan lingkungan dan mempererat kebersamaan antarwarga di seluruh dusun. (Teks contoh)",
  },
  {
    cat: "pengumuman",
    title: "Perubahan Jam Pelayanan Kantor Kelurahan Selama Ramadan",
    date: "15 Juni 2026",
    excerpt:
      "Jam layanan kantor kelurahan disesuaikan menjadi pukul 08.00–14.00 WITA selama bulan Ramadan.",
    full: "Kantor Kelurahan Jagong mengumumkan penyesuaian jam layanan publik selama bulan Ramadan untuk kenyamanan warga dan staf. (Teks contoh)",
  },
  {
    cat: "berita",
    title: "Pelatihan Keterampilan Menjahit untuk Ibu Rumah Tangga",
    date: "2 Juni 2026",
    excerpt:
      "Sebanyak 30 warga mengikuti pelatihan menjahit yang diselenggarakan bekerja sama dengan Dinas Sosial.",
    full: "Program pemberdayaan ekonomi keluarga ini bertujuan meningkatkan keterampilan dan peluang usaha bagi ibu rumah tangga di Kelurahan Jagong. (Teks contoh)",
  },
];

const TABS: { value: "all" | Category; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "berita", label: "Berita" },
  { value: "pengumuman", label: "Pengumuman" },
];

const TAG_CLASSES: Record<Category, string> = {
  pengumuman: "bg-forest-50 text-forest-700",
  berita: "bg-ocean-50 text-ocean-700",
};

const CAT_LABEL: Record<Category, string> = {
  pengumuman: "Pengumuman",
  berita: "Berita",
};

export default function BeritaPage() {
  const [activeTab, setActiveTab] = useState<"all" | Category>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = NEWS.filter(
    (item) => activeTab === "all" || item.cat === activeTab,
  );
  const activeItem = openIndex !== null ? NEWS[openIndex] : null;

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
              onClick={() => setActiveTab(tab.value)}
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

        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          {NEWS.map((item, i) => {
            if (!filtered.includes(item)) return null;
            return (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-lg border border-border-default bg-surface-card"
              >
                <ImagePlaceholder
                  label="Foto berita"
                  className="h-[170px] w-full"
                />
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span
                    className={cn(
                      "w-fit rounded-full px-2.5 py-[3px] text-[11px] font-semibold tracking-wide uppercase",
                      TAG_CLASSES[item.cat],
                    )}
                  >
                    {CAT_LABEL[item.cat]}
                  </span>
                  <h3 className="mt-1 mb-0 text-[18px] leading-snug text-text-primary">
                    {item.title}
                  </h3>
                  <p className="m-0 text-[13px] text-text-muted">
                    {item.date}
                  </p>
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-text-secondary">
                    {item.excerpt}
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    className="mt-3 inline-flex w-fit items-center gap-1.5 border-none bg-transparent p-0 text-[13px] font-semibold text-ocean-700"
                  >
                    Baca selengkapnya <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {activeItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-overlay p-6"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="w-full max-w-[380px] rounded-lg bg-surface-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <h2 className="m-0 text-lg text-text-primary">
                {activeItem.title}
              </h2>
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                aria-label="Tutup"
                className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-border-default bg-transparent text-text-secondary"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-text-secondary">
              {activeItem.full}
            </p>
            <p className="m-0 text-[13px] text-text-muted">
              {activeItem.date}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
