import Link from "next/link";
import {
  ArrowRight,
  Megaphone,
  BarChart3,
  FileText,
  MapPin,
  Target,
  CheckCircle2,
} from "lucide-react";
import { ImagePlaceholder } from "@/components/site/image-placeholder";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { CountUp } from "@/components/site/count-up";

const STATS: {
  value: number;
  label: string;
  decimals?: number;
  suffix?: string;
}[] = [
  { value: 4244, label: "Jiwa" },
  { value: 1280, label: "Kepala Keluarga" },
  { value: 3, label: "Dusun" },
  { value: 1.32, label: "Luas Wilayah", decimals: 2, suffix: " km²" },
];

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
    desc: "Ajukan surat keterangan secara daring",
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

const MISSION_ITEMS = [
  "Meningkatkan kualitas pelayanan publik yang cepat dan transparan.",
  "Mendorong pertumbuhan ekonomi kelurahan berbasis potensi lokal.",
  "Memperkuat partisipasi warga dalam pembangunan kelurahan.",
  "Menjaga kelestarian lingkungan dan sumber daya alam kelurahan.",
];

const KASI_LIST = [
  {
    title: "Kasi Pemerintahan",
    name: "Aisyah Intang, S.Sos",
    nip: "NIP. 19710725 200701 2 016",
  },
  {
    title: "Kasi Kesos",
    name: "Patmawati, S.Sos",
    nip: "NIP. 1976065 200701 2 029",
  },
  {
    title: "Kasi Pembangunan",
    name: "Nurmi, SM",
    nip: "NIP. 19721225 200801 2 012",
  },
];

const GALLERY = [
  "Balai Kelurahan",
  "Kegiatan gotong royong",
  "Lahan pertanian warga",
  "Tambak ikan bandeng",
  "Posyandu kelurahan",
  "Panen raya jagung",
  "Kantor kelurahan",
  "Pasar kelurahan",
];

const NEWS_ITEMS = [
  {
    tag: "Pengumuman",
    title: "Jadwal Musyawarah Kelurahan Tahun 2026",
    date: "18 Juli 2026",
  },
  {
    tag: "Berita",
    title: "Panen Raya Jagung di Dusun Bontoa Berjalan Lancar",
    date: "12 Juli 2026",
  },
  {
    tag: "Pengumuman",
    title: "Pembukaan Pendaftaran Bantuan Sosial Tahap II",
    date: "5 Juli 2026",
  },
];

const TONE_CLASSES = {
  ocean: { badge: "bg-ocean-50", icon: "text-ocean-700" },
  forest: { badge: "bg-forest-50", icon: "text-forest-700" },
};

const TAG_CLASSES: Record<string, string> = {
  Pengumuman: "bg-forest-50 text-forest-700",
  Berita: "bg-ocean-50 text-ocean-700",
};

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative flex min-h-screen items-stretch">
        <HeroCarousel />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ocean-900/55 to-ocean-900/80" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1120px] flex-col justify-center gap-5 px-6 py-[clamp(64px,12vw,120px)] box-border pointer-events-none">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/35 bg-white/[.14] px-3 py-[5px] text-xs font-semibold tracking-wide text-white uppercase">
            Situs Resmi Pemerintah Kelurahan
          </span>
          <h1 className="m-0 max-w-[18ch] text-[clamp(34px,5.5vw,56px)] leading-[1.1] font-semibold text-white">
            Kelurahan Jagong, Kecamatan Pangkajene
          </h1>
          <p className="m-0 max-w-[56ch] text-[clamp(16px,2vw,19px)] leading-relaxed text-white/90">
            Melayani warga dengan transparan, cepat, dan terpercaya. Informasi
            kelurahan, data kependudukan, dan layanan publik dalam satu
            tempat.
          </p>
          <div className="mt-2 flex flex-wrap gap-3 pointer-events-auto">
            <Link
              href="/layanan-publik"
              className="inline-flex items-center gap-2 rounded-sm bg-ocean-500 px-[22px] py-[13px] font-semibold text-white no-underline hover:bg-ocean-600"
            >
              Ajukan Layanan <ArrowRight className="size-[18px]" />
            </Link>
            <a
              href="#profil"
              className="inline-flex items-center gap-2 rounded-sm border border-white/50 bg-white/10 px-[22px] py-[13px] font-semibold text-white no-underline hover:bg-white/20"
            >
              Profil Kelurahan
            </a>
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
              Selamat datang di Kelurahan Jagong
            </h2>
            <p className="mb-3 text-[18px] leading-[1.7] text-text-secondary">
              Kami berkomitmen menghadirkan pemerintahan kelurahan yang
              terbuka dan mudah diakses oleh seluruh warga, kapan pun
              dibutuhkan.
            </p>
            <p className="text-[18px] leading-[1.7] text-text-secondary">
              Melalui situs ini, warga dapat mengakses informasi kelurahan,
              data kependudukan, dan mengajukan surat layanan tanpa harus
              menunggu lama di kantor kelurahan.
            </p>
            <div className="mt-6 flex items-center gap-3.5">
              <ImagePlaceholder
                label="Foto"
                className="size-14 shrink-0 rounded-full"
              />
              <div>
                <div className="text-[15px] font-semibold text-text-primary">
                  Elvira Septia Ansar, S.STP
                </div>
                <div className="text-[13px] text-text-muted">
                  Lurah Jagong
                </div>
              </div>
            </div>
          </div>
          <ImagePlaceholder
            label="Foto Kantor Kelurahan Jagong"
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

      {/* Profil Kelurahan (Sejarah, Visi & Misi, Struktur Pemerintahan) */}
      <section id="profil" className="mx-auto max-w-[1120px] px-6 pt-20">
        <span className="text-[13px] font-semibold tracking-wide text-forest-600 uppercase">
          Profil Kelurahan
        </span>
        <div className="mt-3 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,1fr)]">
          <div>
            <h2 className="mb-4 text-[clamp(24px,3vw,30px)] text-text-primary">
              Sejarah Kelurahan
            </h2>
            <p className="mb-4 text-[18px] leading-[1.75] text-text-secondary">
              Kelurahan Jagong terbentuk dari beberapa dusun yang bergabung
              menjadi satu wilayah administratif di Kecamatan Pangkajene.
              Nama &ldquo;Jagong&rdquo; berasal dari kebiasaan warga
              bermusyawarah di bawah pohon besar di tengah kelurahan. (Teks
              contoh — akan diperbarui dengan sejarah resmi kelurahan.)
            </p>
            <p className="text-[18px] leading-[1.75] text-text-secondary">
              Sejak dimekarkan, Kelurahan Jagong berkembang sebagai kawasan
              agraris dengan mata pencaharian utama warga di bidang
              pertanian, perikanan tambak, dan perdagangan hasil bumi.
            </p>
          </div>
          <ImagePlaceholder
            label="Foto arsip kelurahan (contoh)"
            className="h-[300px] w-full rounded-lg"
          />
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="mx-auto max-w-[1120px] px-6 pt-16">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
          <div className="rounded-lg border border-border-default bg-surface-card p-8">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-sm bg-ocean-50">
                <Target className="size-[18px] text-ocean-700" />
              </span>
              <h3 className="m-0 text-[19px] text-text-primary">Visi</h3>
            </div>
            <p className="m-0 text-[15px] leading-[1.7] text-text-secondary italic">
              &ldquo;Mewujudkan Kelurahan Jagong yang mandiri, sejahtera, dan
              berbudaya melalui tata kelola pemerintahan yang transparan dan
              partisipatif.&rdquo; (contoh)
            </p>
          </div>
          <div className="rounded-lg border border-border-default bg-surface-card p-8">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-sm bg-forest-50">
                <CheckCircle2 className="size-[18px] text-forest-700" />
              </span>
              <h3 className="m-0 text-[19px] text-text-primary">Misi</h3>
            </div>
            <ul className="m-0 flex flex-col gap-2 pl-5">
              {MISSION_ITEMS.map((item) => (
                <li
                  key={item}
                  className="text-[15px] leading-[1.6] text-text-secondary"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Struktur Pemerintahan */}
      <section className="mx-auto max-w-[1120px] px-6 pt-16">
        <h2 className="mb-2 text-2xl text-text-primary">
          Struktur Pemerintahan
        </h2>
        <p className="mb-8 text-sm text-text-muted">
          Struktur Organisasi Kelurahan Jagong.
        </p>

        <div className="flex flex-col items-center">
          {/* Lurah */}
          <div className="rounded-md bg-ocean-700 px-8 py-4 text-center text-white">
            <div className="text-[15px] font-semibold">Lurah</div>
            <div className="mt-0.5 text-[13px] text-ocean-100">
              Elvira Septia Ansar, S.STP
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-ocean-200">
              NIP. 19920923 201609 2 001
            </div>
          </div>
          <div className="h-[22px] w-px bg-border-strong" />

          {/* LPM | Sekretaris — mobile: simple stacked chain */}
          <div className="flex w-full max-w-[480px] flex-col items-center sm:hidden">
            <div className="rounded-md border border-dashed border-border-strong px-6 py-3 text-center whitespace-nowrap">
              <div className="text-[15px] font-semibold text-text-primary">
                LPM
              </div>
            </div>
            <div className="h-4 w-px bg-border-strong" />
            <div className="rounded-md border border-border-default bg-surface-sunken px-6 py-3 text-center whitespace-nowrap">
              <div className="text-sm font-semibold text-text-primary">
                Sekretaris
              </div>
              <div className="mt-0.5 text-xs text-text-muted">
                Sultan, S.IP
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-text-muted">
                NIP. 19740325 200903 1 004
              </div>
            </div>
          </div>

          {/* LPM | Sekretaris — desktop: branch line + drop stubs, top-aligned so box-height differences can't skew the joint */}
          <div className="relative hidden w-full max-w-[480px] sm:block">
            <div className="absolute top-0 left-1/4 w-1/4 border-t border-dashed border-border-strong" />
            <div className="absolute top-0 right-1/4 w-1/4 border-t border-border-strong" />
            <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border-strong" />
            <div className="grid grid-cols-2">
              <div className="flex flex-col items-center">
                <div className="h-4 w-0 border-l border-dashed border-border-strong" />
                <div className="rounded-md border border-dashed border-border-strong px-6 py-3 text-center whitespace-nowrap">
                  <div className="text-[15px] font-semibold text-text-primary">
                    LPM
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-4 w-0 border-l border-border-strong" />
                <div className="rounded-md border border-border-default bg-surface-sunken px-6 py-3 text-center whitespace-nowrap">
                  <div className="text-sm font-semibold text-text-primary">
                    Sekretaris
                  </div>
                  <div className="mt-0.5 text-xs text-text-muted">
                    Sultan, S.IP
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-text-muted">
                    NIP. 19740325 200903 1 004
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[22px] w-px bg-border-strong" />

          {/* Kasi row */}
          <div className="relative w-full max-w-[720px]">
            <div className="absolute top-0 left-[calc((100%-2rem)/6)] right-[calc((100%-2rem)/6)] hidden border-t border-border-strong sm:block" />
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {KASI_LIST.map((kasi) => (
                <div
                  key={kasi.title}
                  className="relative w-full max-w-[280px] pt-[22px] sm:max-w-none sm:min-w-[170px] sm:flex-1"
                >
                  <div className="absolute top-0 left-1/2 h-[22px] w-px -translate-x-1/2 bg-border-strong" />
                  <div className="rounded-md border border-border-default bg-surface-card p-4 text-center">
                    <div className="text-sm font-semibold text-text-primary">
                      {kasi.title}
                    </div>
                    <div className="mt-1 text-xs text-text-muted">
                      {kasi.name}
                    </div>
                    <div className="mt-0.5 font-mono text-[10.5px] text-text-muted">
                      {kasi.nip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Galeri Kelurahan */}
      <section className="mx-auto max-w-[1120px] px-6 py-20">
        <h2 className="mb-2 text-[clamp(24px,3vw,30px)] text-text-primary">
          Galeri Kelurahan
        </h2>
        <p className="mb-8 text-sm text-text-muted">
          Foto akan diperbarui dengan dokumentasi resmi kelurahan.
        </p>
        <div className="grid grid-cols-2 grid-rows-4 gap-4 sm:grid-cols-4 sm:grid-rows-2">
          {GALLERY.map((label) => (
            <ImagePlaceholder
              key={label}
              label={label}
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
          {NEWS_ITEMS.map((item, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-border-default bg-surface-card"
            >
              <ImagePlaceholder label="Foto berita" className="h-[160px] w-full" />
              <div className="p-5">
                <span
                  className={`mb-3 inline-flex rounded-full px-2.5 py-[3px] text-[11px] font-semibold tracking-wide uppercase ${TAG_CLASSES[item.tag]}`}
                >
                  {item.tag}
                </span>
                <h3 className="mb-2 text-[18px] leading-snug text-text-primary">
                  {item.title}
                </h3>
                <p className="m-0 text-[13px] text-text-muted">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
