import {
  BarChart3,
  Compass,
  Home,
  Image as ImageIcon,
  Megaphone,
  Phone,
  Plus,
  Upload,
  Users,
  Wrench,
} from "lucide-react";
import { StatTile, QuickAction } from "../ui";
import type { AdminInitialData } from "../types";
import type { SectionKey } from "../section-keys";

export function DashboardSection({
  data,
  goTo,
}: {
  data: AdminInitialData;
  goTo: (key: SectionKey) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile icon={Megaphone} value={data.news.length} label="Berita & Pengumuman" tone="ocean" />
        <StatTile icon={ImageIcon} value={data.gallery.length} label="Foto Galeri" tone="forest" />
        <StatTile icon={Users} value={data.staff.length} label="Perangkat Kelurahan" tone="ocean" />
        <StatTile
          icon={BarChart3}
          value={data.population?.total_penduduk?.toLocaleString("id-ID") ?? "-"}
          label="Total Penduduk"
          tone="forest"
        />
      </div>

      <div>
        <h2 className="mb-3 text-base text-text-primary">Aksi cepat</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <QuickAction
            icon={Plus}
            title="Tambah Berita/Pengumuman"
            desc="Buat pos berita atau pengumuman baru."
            onClick={() => goTo("berita")}
          />
          <QuickAction
            icon={Upload}
            title="Upload Foto Galeri"
            desc="Tambahkan foto baru ke galeri kelurahan."
            onClick={() => goTo("galeri")}
          />
          <QuickAction
            icon={Users}
            title="Edit Perangkat Kelurahan"
            desc="Ubah nama, jabatan, dan foto staf kelurahan."
            onClick={() => goTo("profil")}
          />
          <QuickAction
            icon={BarChart3}
            title="Edit Statistik Penduduk"
            desc="Perbarui data penduduk, RW, dan realisasi pajak."
            onClick={() => goTo("penduduk")}
          />
          <QuickAction
            icon={Home}
            title="Edit Halaman Beranda"
            desc="Ubah judul hero dan teks sambutan."
            onClick={() => goTo("beranda")}
          />
          <QuickAction
            icon={Wrench}
            title="Edit Layanan Publik"
            desc="Kelola jenis surat dan syarat pengajuan."
            onClick={() => goTo("layanan")}
          />
          <QuickAction
            icon={Compass}
            title="Edit Peta Kelurahan"
            desc="Perbarui nama kelurahan tetangga per arah mata angin."
            onClick={() => goTo("peta")}
          />
          <QuickAction
            icon={Phone}
            title="Edit Kontak & Footer"
            desc="Ubah alamat, email, dan jam layanan."
            onClick={() => goTo("kontak")}
          />
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-border-strong bg-surface-sunken px-5 py-4 text-[13px] text-text-secondary">
        Klik langsung pada teks atau foto di tiap halaman untuk mengeditnya di
        tempat — perubahan langsung tersimpan ke database.
      </div>
    </div>
  );
}
