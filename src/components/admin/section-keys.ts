import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Compass,
  Home,
  Image as ImageIcon,
  Landmark,
  LayoutDashboard,
  Megaphone,
  Phone,
  Wrench,
} from "lucide-react";

export const SECTIONS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "beranda", label: "Beranda", icon: Home },
  { key: "profil", label: "Profil Kelurahan", icon: Landmark },
  { key: "galeri", label: "Galeri", icon: ImageIcon },
  { key: "berita", label: "Berita & Pengumuman", icon: Megaphone },
  { key: "penduduk", label: "Data Penduduk", icon: BarChart3 },
  { key: "layanan", label: "Layanan Publik", icon: Wrench },
  { key: "peta", label: "Peta Kelurahan", icon: Compass },
  { key: "kontak", label: "Kontak & Footer", icon: Phone },
] as const satisfies { key: string; label: string; icon: LucideIcon }[];

export type SectionKey = (typeof SECTIONS)[number]["key"];

export const SECTION_NOTES: Record<SectionKey, string> = {
  dashboard: "Ringkasan konten dan aksi cepat untuk mengelola situs.",
  beranda: "Judul hero dan teks sambutan yang tampil di halaman Beranda.",
  profil:
    "Sejarah, foto, dan perangkat kelurahan yang tampil di halaman Profil Kelurahan. Klik langsung teks atau foto untuk mengedit.",
  galeri: "Foto dokumentasi yang tampil di halaman Galeri Kelurahan.",
  berita: "Kelola daftar berita dan pengumuman yang tampil di Beranda dan halaman Berita.",
  penduduk: "Statistik penduduk, data RW, dan realisasi pajak yang tampil di halaman Data Penduduk.",
  layanan: "Jenis surat dan syarat yang tampil di halaman Layanan Publik.",
  peta: "Titik lokasi (fasilitas, RT/RW) dan label kelurahan tetangga yang tampil di peta interaktif halaman Peta Kelurahan.",
  kontak: "Alamat, email, dan jam layanan yang tampil di footer setiap halaman.",
};
