import Link from "next/link";
import {
  ArrowRight,
  Megaphone,
  BarChart3,
  FileText,
  MapPin,
} from "lucide-react";
import { DbImage } from "@/components/site/db-image";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { CountUp } from "@/components/site/count-up";
import { CAT_LABEL, TAG_CLASSES } from "@/lib/news";
import { formatIndonesianDate } from "@/lib/format";
import {
  getContentBlocks,
  getHeroSlides,
  getStaff,
  getGalleryItems,
  getNewsPosts,
  getPopulationSnapshot,
  getRwAreas,
} from "@/lib/supabase/queries";

const QUICK_LINKS = [
  {
    href: "/berita",
    label: "Berita & Pengumuman",
    desc: "Kabar dan informasi resmi terbaru",
    icon: Megaphone,
    tone: "forest" as const,
  },
  {
    href: "/data-penduduk",
    label: "Data Penduduk",
    desc: "Statistik dan sebaran penduduk kelurahan",
    icon: BarChart3,
    tone: "ocean" as const,
  },
  {
    href: "/layanan-publik",
    label: "Layanan Publik",
    desc: "Cek syarat pembuatan surat keterangan",
    icon: FileText,
    tone: "forest" as const,
  },
  {
    href: "/peta-desa",
    label: "Peta Kelurahan",
    desc: "Batas wilayah dan peta dusun",
    icon: MapPin,
    tone: "ocean" as const,
  },
];

const TONE_CLASSES = {
  ocean: { badge: "bg-ocean-50", icon: "text-ocean-700" },
  forest: { badge: "bg-forest-50", icon: "text-forest-700" },
};

export default async function Home() {
  const [content, heroSlides, staff, gallery, news, population, rwAreas] =
    await Promise.all([
      getContentBlocks(),
      getHeroSlides(),
      getStaff(),
      getGalleryItems(),
      getNewsPosts(),
      getPopulationSnapshot(),
      getRwAreas(),
    ]);

  const latestNews = news.slice(0, 3);
  const lurah = staff[0];

  const STATS: {
    value: number;
    label: string;
    decimals?: number;
    suffix?: string;
  }[] = [
    { value: population?.total_penduduk ?? 0, label: "Jiwa" },
    { value: population?.kepala_keluarga ?? 0, label: "Kepala Keluarga" },
    { value: rwAreas.length, label: "Dusun" },
    {
      value: population?.luas_wilayah_km2 ?? 0,
      label: "Luas Wilayah",
      decimals: 2,
      suffix: " km²",
    },
  ];

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative flex min-h-screen items-stretch">
        <HeroCarousel slides={heroSlides} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ocean-900/55 to-ocean-900/80" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1120px] flex-col justify-center gap-5 px-6 py-[clamp(64px,12vw,120px)] box-border pointer-events-none">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/35 bg-white/[.14] px-3 py-[5px] text-xs font-semibold tracking-wide text-white uppercase">
            Situs Resmi Pemerintah Kelurahan
          </span>
          <h1 className="m-0 max-w-[18ch] text-[clamp(34px,5.5vw,56px)] leading-[1.1] font-semibold text-white">
            {content["hero.title"] || "Kelurahan Jagong, Kecamatan Pangkajene"}
          </h1>
          <p className="m-0 max-w-[56ch] text-[clamp(16px,2vw,19px)] leading-relaxed text-white/90">
            {content["hero.subtitle"] ||
              "Melayani warga dengan transparan, cepat, dan terpercaya. Informasi kelurahan, data kependudukan, dan layanan publik dalam satu tempat."}
          </p>
          <div className="mt-2 flex flex-wrap gap-3 pointer-events-auto">
            <Link
              href="/layanan-publik"
              className="inline-flex items-center gap-2 rounded-sm bg-ocean-500 px-[22px] py-[13px] font-semibold text-white no-underline hover:bg-ocean-600"
            >
              Ajukan Layanan <ArrowRight className="size-[18px]" />
            </Link>
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 rounded-sm border border-white/50 bg-white/10 px-[22px] py-[13px] font-semibold text-white no-underline hover:bg-white/20"
            >
              Profil Kelurahan
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-ocean-800">
        <div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="border-l border-ocean-600 pl-5 text-center"
            >
              <div className="font-mono text-[clamp(24px,3vw,32px)] font-semibold text-white">
                <CountUp
                  value={stat.value}
                  decimals={stat.decimals ?? 0}
                  suffix={stat.suffix ?? ""}
                  delay={i * 150}
                />
              </div>
              <div className="mt-1 text-[13px] text-ocean-200">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sambutan */}
      <section className="mx-auto max-w-[1120px] px-6 py-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
          <div>
            <span className="text-[13px] font-semibold tracking-wide text-forest-600 uppercase">
              Sambutan
            </span>
            <h2 className="mt-3 mb-4 text-[clamp(26px,3.5vw,34px)] text-text-primary">
              {content["sambutan.title"] || "Selamat datang di Kelurahan Jagong"}
            </h2>
            <p className="mb-3 text-justify text-[18px] leading-[1.7] text-text-secondary">
              {content["sambutan.body_1"] ||
                "Kami berkomitmen menghadirkan pemerintahan kelurahan yang terbuka dan mudah diakses oleh seluruh warga, kapan pun dibutuhkan."}
            </p>
            <p className="text-justify text-[18px] leading-[1.7] text-text-secondary">
              {content["sambutan.body_2"] ||
                "Melalui situs ini, warga dapat mengakses informasi kelurahan, data kependudukan, dan mengecek syarat-syarat pembuatan surat sebelum datang langsung ke kantor kelurahan."}
            </p>
            {lurah && (
              <div className="mt-6 flex items-center gap-3.5">
                <DbImage
                  src={lurah.photo_url}
                  alt="Foto"
                  className="size-14 shrink-0 rounded-full object-[center_25%]"
                />
                <div>
                  <div className="text-[15px] font-semibold text-text-primary">
                    {lurah.name}
                  </div>
                  <div className="text-[13px] text-text-muted">
                    {lurah.role} Jagong
                  </div>
                </div>
              </div>
            )}
          </div>
          <DbImage
            src={content["sambutan.photo_url"] ?? null}
            alt="Foto Kantor Kelurahan Jagong"
            className="h-[340px] w-full rounded-lg"
          />
        </div>
      </section>

      {/* Akses cepat */}
      <section className="border-y border-border-default bg-surface-sunken">
        <div className="mx-auto max-w-[1120px] px-6 py-20">
          <h2 className="mb-8 text-center text-[clamp(24px,3vw,30px)] text-text-primary">
            Akses cepat
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
            {QUICK_LINKS.map((item) => {
              const Icon = item.icon;
              const tone = TONE_CLASSES[item.tone];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col gap-3 rounded-lg border border-border-default bg-surface-card p-6 no-underline transition-shadow duration-200 hover:shadow-[0_2px_6px_rgba(74,56,32,.08)]"
                >
                  <span
                    className={`flex size-11 items-center justify-center rounded-md ${tone.badge}`}
                  >
                    <Icon className={`size-[22px] ${tone.icon}`} />
                  </span>
                  <span className="text-base font-semibold text-text-primary">
                    {item.label}
                  </span>
                  <span className="text-[13px] leading-relaxed text-text-secondary">
                    {item.desc}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Perangkat Kelurahan */}
      <section className="pt-16">
        <div className="mx-auto max-w-[1120px] px-6">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h2 className="m-0 mb-2 text-2xl text-text-primary">
                Perangkat Kelurahan
              </h2>
              <p className="m-0 text-sm text-text-muted">
                Jajaran pejabat dan staf Kelurahan Jagong.
              </p>
            </div>
            <Link
              href="/profil"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 no-underline hover:underline"
            >
              Profil Kelurahan <ArrowRight className="size-[15px]" />
            </Link>
          </div>
        </div>

        <div className="staff-fade overflow-hidden py-4">
          <div
            className="staff-track animate-marquee-left flex w-max gap-6 px-6"
            style={{ animationDuration: `${staff.length * 4}s` }}
          >
            {[...staff, ...staff].map((person, i) => (
              <div
                key={i}
                aria-hidden={i >= staff.length}
                className="staff-card flex w-[220px] shrink-0 flex-col overflow-hidden rounded-lg border border-border-default bg-surface-card sm:w-[250px]"
              >
                <DbImage
                  src={person.photo_url}
                  alt="Foto staf"
                  className="h-[180px] w-full object-[center_25%]"
                />
                <div className="p-4 text-center">
                  <div className="text-sm font-semibold text-text-primary">
                    {person.name}
                  </div>
                  <div className="mt-1 text-xs font-medium text-ocean-700">
                    {person.role}
                  </div>
                  <div className="mt-1 font-mono text-[10.5px] text-text-muted">
                    {person.nip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri Kelurahan */}
      <section className="mx-auto max-w-[1120px] px-6 py-20">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h2 className="m-0 mb-2 text-[clamp(24px,3vw,30px)] text-text-primary">
              Galeri Kelurahan
            </h2>
            <p className="m-0 text-sm text-text-muted">
              Foto akan diperbarui dengan dokumentasi resmi kelurahan.
            </p>
          </div>
          <Link
            href="/profil/galeri"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 no-underline hover:underline"
          >
            Lihat galeri lengkap <ArrowRight className="size-[15px]" />
          </Link>
        </div>
        <div className="grid grid-cols-2 grid-rows-4 gap-4 sm:grid-cols-4 sm:grid-rows-2">
          {gallery.map((item) => (
            <DbImage
              key={item.id}
              src={item.photo_url}
              alt={item.label}
              className="h-[180px] w-full rounded-[14px]"
            />
          ))}
        </div>
      </section>

      {/* Berita terbaru */}
      <section className="mx-auto max-w-[1120px] px-6 py-20">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="m-0 text-[clamp(24px,3vw,30px)] text-text-primary">
            Berita & pengumuman terbaru
          </h2>
          <Link
            href="/berita"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 no-underline hover:underline"
          >
            Lihat semua <ArrowRight className="size-[15px]" />
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {latestNews.map((item) => (
            <Link
              key={item.id}
              href={`/berita/${item.slug}`}
              className="overflow-hidden rounded-lg border border-border-default bg-surface-card no-underline"
            >
              <DbImage
                src={item.photo_url}
                alt="Foto berita"
                className="h-[160px] w-full"
              />
              <div className="p-5">
                <span
                  className={`mb-3 inline-flex rounded-full px-2.5 py-[3px] text-[11px] font-semibold tracking-wide uppercase ${TAG_CLASSES[item.category]}`}
                >
                  {CAT_LABEL[item.category]}
                </span>
                <h3 className="mb-2 text-[18px] leading-snug text-text-primary">
                  {item.title}
                </h3>
                <p className="m-0 text-[13px] text-text-muted">
                  {formatIndonesianDate(item.published_at)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
