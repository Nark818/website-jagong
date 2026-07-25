import { Megaphone, Newspaper } from "lucide-react";

export type Category = "berita" | "pengumuman";

export type NewsItem = {
  slug: string;
  cat: Category;
  title: string;
  date: string;
  excerpt: string;
  full: string;
};

export const NEWS: NewsItem[] = [
  {
    slug: "jadwal-musyawarah-kelurahan-2026",
    cat: "pengumuman",
    title: "Jadwal Musyawarah Kelurahan Tahun 2026",
    date: "18 Juli 2026",
    excerpt:
      "Musyawarah kelurahan membahas RKP Kelurahan 2027 akan dilaksanakan di Balai Kelurahan Jagong.",
    full: "Seluruh kepala keluarga diundang untuk hadir dalam musyawarah kelurahan membahas Rencana Kerja Pemerintah (RKP) Kelurahan tahun 2027. Musyawarah akan membahas prioritas pembangunan, alokasi Dana Kelurahan, dan program bantuan sosial. (Teks contoh)",
  },
  {
    slug: "panen-raya-jagung-dusun-bontoa",
    cat: "berita",
    title: "Panen Raya Jagung di Dusun Bontoa Berjalan Lancar",
    date: "12 Juli 2026",
    excerpt:
      "Musim panen jagung tahun ini mencatat hasil yang baik berkat program penyuluhan pertanian kelurahan.",
    full: "Kelompok tani Dusun Bontoa berhasil memanen jagung dengan hasil di atas rata-rata tahun sebelumnya, berkat pendampingan penyuluh pertanian dan penggunaan bibit unggul. (Teks contoh)",
  },
  {
    slug: "pendaftaran-bantuan-sosial-tahap-2",
    cat: "pengumuman",
    title: "Pembukaan Pendaftaran Bantuan Sosial Tahap II",
    date: "5 Juli 2026",
    excerpt:
      "Pendaftaran bantuan sosial tahap II dibuka mulai 8 Juli hingga 20 Juli 2026 di kantor kelurahan.",
    full: "Warga yang memenuhi kriteria dapat mendaftar bantuan sosial tahap II dengan membawa KTP, KK, dan surat keterangan tidak mampu ke kantor kelurahan pada jam kerja. (Teks contoh)",
  },
  {
    slug: "gotong-royong-bersih-kelurahan",
    cat: "berita",
    title: "Gotong Royong Bersih Kelurahan Digelar Serentak",
    date: "28 Juni 2026",
    excerpt:
      "Warga empat dusun berpartisipasi dalam kegiatan gotong royong membersihkan saluran air dan jalan kelurahan.",
    full: "Kegiatan gotong royong rutin bulanan ini bertujuan menjaga kebersihan lingkungan dan mempererat kebersamaan antarwarga di seluruh dusun. (Teks contoh)",
  },
  {
    slug: "perubahan-jam-pelayanan-ramadan",
    cat: "pengumuman",
    title: "Perubahan Jam Pelayanan Kantor Kelurahan Selama Ramadan",
    date: "15 Juni 2026",
    excerpt:
      "Jam layanan kantor kelurahan disesuaikan menjadi pukul 08.00–14.00 WITA selama bulan Ramadan.",
    full: "Kantor Kelurahan Jagong mengumumkan penyesuaian jam layanan publik selama bulan Ramadan untuk kenyamanan warga dan staf. (Teks contoh)",
  },
  {
    slug: "pelatihan-menjahit-ibu-rumah-tangga",
    cat: "berita",
    title: "Pelatihan Keterampilan Menjahit untuk Ibu Rumah Tangga",
    date: "2 Juni 2026",
    excerpt:
      "Sebanyak 30 warga mengikuti pelatihan menjahit yang diselenggarakan bekerja sama dengan Dinas Sosial.",
    full: "Program pemberdayaan ekonomi keluarga ini bertujuan meningkatkan keterampilan dan peluang usaha bagi ibu rumah tangga di Kelurahan Jagong. (Teks contoh)",
  },
  {
    slug: "posyandu-balita-rutin",
    cat: "berita",
    title: "Posyandu Balita Rutin Digelar di Setiap Dusun",
    date: "20 Mei 2026",
    excerpt:
      "Kegiatan posyandu bulanan mencatat partisipasi tinggi dari ibu dan balita di seluruh dusun Kelurahan Jagong.",
    full: "Posyandu bulanan menyediakan layanan penimbangan, imunisasi, dan konsultasi gizi bagi balita, bekerja sama dengan Puskesmas setempat. (Teks contoh)",
  },
];

export const CAT_LABEL: Record<Category, string> = {
  pengumuman: "Pengumuman",
  berita: "Berita",
};

export const TAG_CLASSES: Record<Category, string> = {
  pengumuman: "bg-forest-50 text-forest-700",
  berita: "bg-ocean-50 text-ocean-700",
};

export const CAT_BADGE_CLASSES: Record<Category, string> = {
  pengumuman: "bg-forest-600 text-white",
  berita: "bg-ocean-600 text-white",
};

export const CAT_ICON: Record<Category, typeof Megaphone> = {
  pengumuman: Megaphone,
  berita: Newspaper,
};

export function getNewsBySlug(slug: string) {
  return NEWS.find((item) => item.slug === slug);
}
