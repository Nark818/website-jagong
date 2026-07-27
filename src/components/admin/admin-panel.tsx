"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Landmark,
  Megaphone,
  BarChart3,
  Image as ImageIcon,
  Users,
  LayoutDashboard,
  ExternalLink,
  Save,
  CheckCircle2,
  Trash2,
  Plus,
  Upload,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText, EditableImage } from "./editable";

const numFromId = (str: string) => parseInt(str.replace(/[^\d]/g, ""), 10) || 0;
const fmtId = (n: number) => n.toLocaleString("id-ID");

type BeritaPost = {
  cat: "berita" | "pengumuman";
  title: string;
  date: string;
  excerpt: string;
  full: string;
  photo: string | null;
};

type StaffMember = { name: string; role: string; nip: string; photo: string | null };
type GalleryItem = { label: string; photo: string | null };
type RwRow = { name: string; rumah: string; masjid: string };

type Tax = {
  pokokStts: string;
  pokokRp: string;
  pbbLaluStts: string;
  pbbLaluRp: string;
  pbbIniStts: string;
  pbbIniRp: string;
  tunggakanStts: string;
  tunggakanRp: string;
  tdLaluStts: string;
  tdLaluRp: string;
  tdIniStts: string;
  tdIniRp: string;
};

const SECTIONS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "profil", label: "Profil Kelurahan", icon: Landmark },
  { key: "galeri", label: "Galeri", icon: ImageIcon },
  { key: "berita", label: "Berita & Pengumuman", icon: Megaphone },
  { key: "penduduk", label: "Data Penduduk", icon: BarChart3 },
] as const;

const NOTES: Record<(typeof SECTIONS)[number]["key"], string> = {
  dashboard: "Ringkasan konten dan aksi cepat untuk mengelola situs.",
  profil:
    "Sejarah, foto, dan perangkat kelurahan yang tampil di halaman Profil Kelurahan. Klik langsung teks atau foto untuk mengedit.",
  galeri: "Foto dokumentasi yang tampil di halaman Galeri Kelurahan.",
  berita: "Kelola daftar berita dan pengumuman yang tampil di Beranda dan halaman Berita.",
  penduduk: "Statistik penduduk, data RW, dan realisasi pajak yang tampil di halaman Data Penduduk.",
};

const SEED_STAFF: StaffMember[] = [
  { name: "Elvira Septia Ansar, S.STP", role: "Lurah", nip: "NIP. 19920923 201609 2 001", photo: null },
  { name: "Sultan, S.IP", role: "Sekretaris", nip: "NIP. 19740325 200903 1 004", photo: null },
  { name: "Aisyah Intang, S.Sos", role: "Kasi Pemerintahan", nip: "NIP. 19710725 200701 2 016", photo: null },
  { name: "Patmawati, S.Sos", role: "Kasi Kesos", nip: "NIP. 1976065 200701 2 029", photo: null },
  { name: "Nurmi, SM", role: "Kasi Pembangunan", nip: "NIP. 19721225 200801 2 012", photo: null },
];

const SEED_GALLERY_LABELS = [
  "Balai Kelurahan",
  "Kegiatan gotong royong",
  "Lahan pertanian warga",
  "Tambak ikan bandeng",
  "Posyandu kelurahan",
  "Panen raya jagung",
  "Kantor kelurahan",
  "Pasar kelurahan",
];

function StatTile({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: LucideIcon;
  value: ReactNode;
  label: string;
  tone: "ocean" | "forest";
}) {
  const badge = tone === "ocean" ? "bg-ocean-50 text-ocean-700" : "bg-forest-50 text-forest-700";
  return (
    <div className="flex flex-col gap-2.5 rounded-lg border border-border-default bg-surface-card p-5">
      <span className={cn("flex size-9 items-center justify-center rounded-sm", badge)}>
        <Icon className="size-[18px]" />
      </span>
      <div className="font-mono text-2xl font-semibold text-text-primary">{value}</div>
      <div className="text-[13px] text-text-secondary">{label}</div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  desc,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-start gap-3.5 rounded-lg border border-border-default bg-surface-card p-5 text-left transition-shadow duration-150 hover:shadow-[0_2px_10px_rgba(74,56,32,.08)]"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-ocean-50 text-ocean-700">
        <Icon className="size-[19px]" />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-text-primary">{title}</span>
        <span className="text-[13px] leading-snug text-text-secondary">{desc}</span>
      </span>
    </button>
  );
}

function VideoUpload({ url, onChange }: { url: string | null; onChange: (u: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-2">
      {url ? (
        <div className="relative overflow-hidden rounded-lg border border-border-default">
          <video src={url} controls className="aspect-video w-full bg-black" />
          <button
            type="button"
            aria-label="Hapus video"
            onClick={() => {
              URL.revokeObjectURL(url);
              onChange(null);
            }}
            className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-white/90 text-[#DC2626] shadow-sm"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-video w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong bg-surface-sunken text-text-secondary"
        >
          <Video className="size-6" />
          <span className="text-xs font-medium">Unggah video</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(URL.createObjectURL(file));
        }}
      />
    </div>
  );
}

export default function AdminPanel() {
  const [activeSection, setActiveSection] =
    useState<(typeof SECTIONS)[number]["key"]>("dashboard");
  const [showSaved, setShowSaved] = useState(false);

  const [historyBody1, setHistoryBody1] = useState(
    "Kelurahan Jagong merupakan salah satu kelurahan yang berada di Kecamatan Pangkajene, Kabupaten Pangkajene dan Kepulauan, Provinsi Sulawesi Selatan. Berlokasi strategis di dekat pusat pemerintahan kecamatan dan kabupaten, Kelurahan Jagong berkembang sebagai kawasan perkotaan dengan potensi di bidang pertanian, perdagangan, serta pelayanan masyarakat.",
  );
  const [historyBody2, setHistoryBody2] = useState(
    "Didukung oleh masyarakat yang menjunjung tinggi nilai budaya Bugis dan Makassar, Kelurahan Jagong terus berkembang melalui peningkatan kualitas pendidikan, kesehatan, dan infrastruktur demi mewujudkan kesejahteraan masyarakat.",
  );
  const [historyPhoto, setHistoryPhoto] = useState<string | null>(null);
  const [profileVideo, setProfileVideo] = useState<string | null>(null);

  const [staff, setStaff] = useState<StaffMember[]>(SEED_STAFF);
  const [gallery, setGallery] = useState<GalleryItem[]>(
    SEED_GALLERY_LABELS.map((label) => ({ label, photo: null })),
  );

  const [berita, setBerita] = useState<BeritaPost[]>([
    {
      cat: "pengumuman",
      title: "Jadwal Musyawarah Kelurahan Tahun 2026",
      date: "18 Juli 2026",
      excerpt:
        "Musyawarah kelurahan membahas RKP Kelurahan 2027 akan dilaksanakan di Balai Kelurahan Jagong.",
      full: "Seluruh kepala keluarga diundang untuk hadir dalam musyawarah kelurahan membahas Rencana Kerja Pemerintah (RKP) Kelurahan tahun 2027.",
      photo: null,
    },
    {
      cat: "berita",
      title: "Panen Raya Jagung di Dusun Bontoa Berjalan Lancar",
      date: "12 Juli 2026",
      excerpt:
        "Musim panen jagung tahun ini mencatat hasil yang baik berkat program penyuluhan pertanian kelurahan.",
      full: "Kelompok tani Dusun Bontoa berhasil memanen jagung dengan hasil di atas rata-rata tahun sebelumnya.",
      photo: null,
    },
    {
      cat: "pengumuman",
      title: "Pembukaan Pendaftaran Bantuan Sosial Tahap II",
      date: "5 Juli 2026",
      excerpt:
        "Pendaftaran bantuan sosial tahap II dibuka mulai 8 Juli hingga 20 Juli 2026 di kantor kelurahan.",
      full: "Warga yang memenuhi kriteria dapat mendaftar dengan membawa KTP, KK, dan surat keterangan tidak mampu.",
      photo: null,
    },
  ]);

  const [total, setTotal] = useState("4.244");
  const [kk, setKk] = useState("1.280");
  const [laki, setLaki] = useState("2.098 (49,43%)");
  const [perempuan, setPerempuan] = useState("2.146 (50,57%)");
  const [rwRows, setRwRows] = useState<RwRow[]>([
    { name: "RW 01", rumah: "346", masjid: "6" },
    { name: "RW 02", rumah: "559", masjid: "3" },
    { name: "RW 03", rumah: "193", masjid: "3" },
  ]);
  const [tax, setTax] = useState<Tax>({
    pokokStts: "1.408",
    pokokRp: "74.636.534",
    pbbLaluStts: "399",
    pbbLaluRp: "17.062.485",
    pbbIniStts: "200",
    pbbIniRp: "8.768.427",
    tunggakanStts: "471",
    tunggakanRp: "23.719.175",
    tdLaluStts: "43",
    tdLaluRp: "4.262.816",
    tdIniStts: "4",
    tdIniRp: "411.318",
  });

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 4000);
  };

  const totalRumah = fmtId(rwRows.reduce((s, r) => s + numFromId(r.rumah), 0));
  const totalMasjid = fmtId(rwRows.reduce((s, r) => s + numFromId(r.masjid), 0));

  const pbbSdIniStts = numFromId(tax.pbbLaluStts) + numFromId(tax.pbbIniStts);
  const pbbSdIniRp = numFromId(tax.pbbLaluRp) + numFromId(tax.pbbIniRp);
  const tdSdIniStts = numFromId(tax.tdLaluStts) + numFromId(tax.tdIniStts);
  const tdSdIniRp = numFromId(tax.tdLaluRp) + numFromId(tax.tdIniRp);
  const penerimaanStts = pbbSdIniStts + tdSdIniStts;
  const penerimaanRp = pbbSdIniRp + tdSdIniRp;
  const pokokRpNum = numFromId(tax.pokokRp) || 1;
  const pctRealisasi = ((pbbSdIniRp / pokokRpNum) * 100).toFixed(2).replace(".", ",");
  const pctPenerimaan = ((penerimaanRp / pokokRpNum) * 100).toFixed(2).replace(".", ",");

  const updateStaff = (i: number, patch: Partial<StaffMember>) =>
    setStaff((s) => s.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const removeStaff = (i: number) => setStaff((s) => s.filter((_, idx) => idx !== i));
  const addStaff = () =>
    setStaff((s) => [...s, { name: "Nama staf baru", role: "Jabatan", nip: "NIP. -", photo: null }]);

  const updateGallery = (i: number, patch: Partial<GalleryItem>) =>
    setGallery((g) => g.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const removeGallery = (i: number) => setGallery((g) => g.filter((_, idx) => idx !== i));
  const addGalleryItem = () => setGallery((g) => [...g, { label: "Foto baru", photo: null }]);

  const updateBerita = (i: number, patch: Partial<BeritaPost>) =>
    setBerita((items) => items.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  const removeBerita = (i: number) =>
    setBerita((items) => items.filter((_, idx) => idx !== i));
  const addBerita = () =>
    setBerita((items) => [
      ...items,
      { cat: "berita", title: "Judul berita baru", date: "", excerpt: "", full: "", photo: null },
    ]);

  const updateRw = (i: number, patch: Partial<RwRow>) =>
    setRwRows((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const removeRw = (i: number) => setRwRows((rows) => rows.filter((_, idx) => idx !== i));
  const addRw = () =>
    setRwRows((rows) => [...rows, { name: `RW 0${rows.length + 1}`, rumah: "0", masjid: "0" }]);

  const goTo = (key: (typeof SECTIONS)[number]["key"]) => setActiveSection(key);

  return (
    <div className="flex min-h-screen flex-col bg-surface-page md:flex-row">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between gap-3 bg-ocean-900 px-4 py-3 md:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-ocean-600 text-white">
            <Landmark className="size-4" />
          </span>
          <div>
            <div className="font-display text-sm leading-tight font-semibold text-white">
              Admin Panel
            </div>
            <div className="text-[10px] text-ocean-300">Kelurahan Jagong</div>
          </div>
        </div>
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 text-xs text-ocean-200 no-underline"
        >
          <ExternalLink className="size-3.5" /> Situs publik
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto bg-ocean-900 px-4 pb-3 md:hidden">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const active = activeSection === sec.key;
          return (
            <button
              key={sec.key}
              type="button"
              onClick={() => setActiveSection(sec.key)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-sm px-3.5 py-2 text-left text-[13px] font-medium whitespace-nowrap text-ocean-100",
                active && "bg-ocean-700 font-semibold text-white",
              )}
            >
              <Icon className="size-[15px] shrink-0" />
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-ocean-900 px-4 py-6 md:flex">
        <div className="flex items-center gap-2.5 px-2 pb-6">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-ocean-600 text-white">
            <Landmark className="size-[18px]" />
          </span>
          <div>
            <div className="font-display text-[15px] leading-tight font-semibold text-white">
              Admin Panel
            </div>
            <div className="text-[11px] text-ocean-300">Kelurahan Jagong</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const active = activeSection === sec.key;
            return (
              <button
                key={sec.key}
                type="button"
                onClick={() => setActiveSection(sec.key)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-sm px-4 py-2.5 text-left text-sm font-medium text-ocean-100",
                  active && "bg-ocean-700 font-semibold text-white",
                )}
              >
                <Icon className="size-[17px] shrink-0" />
                {sec.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-ocean-800 pt-3">
          <Link
            href="/"
            className="flex items-center gap-2 pt-3 text-[13px] text-ocean-200 no-underline"
          >
            <ExternalLink className="size-3.5" /> Lihat situs publik
          </Link>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border-default bg-surface-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 sm:py-5">
          <div>
            <h1 className="m-0 text-xl text-text-primary">
              {SECTIONS.find((s) => s.key === activeSection)?.label}
            </h1>
            <p className="mt-1 mb-0 text-[13px] text-text-muted">
              {NOTES[activeSection]}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-sm bg-ocean-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Save className="size-4" /> Simpan Perubahan
          </button>
        </header>

        {showSaved && (
          <div className="mx-4 mt-4 flex items-center gap-2.5 rounded-md border border-forest-200 bg-forest-50 px-4 py-3 sm:mx-8">
            <CheckCircle2 className="size-4 shrink-0 text-forest-700" />
            <span className="text-[13px] text-forest-800">
              Perubahan disimpan sementara di panel ini — belum tersambung ke
              situs publik (tahap desain).
            </span>
          </div>
        )}

        <div className="w-full max-w-[1000px] flex-1 box-border p-4 sm:p-8">
          {activeSection === "dashboard" && (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatTile icon={Megaphone} value={berita.length} label="Berita & Pengumuman" tone="ocean" />
                <StatTile icon={ImageIcon} value={gallery.length} label="Foto Galeri" tone="forest" />
                <StatTile icon={Users} value={staff.length} label="Perangkat Kelurahan" tone="ocean" />
                <StatTile icon={BarChart3} value={total} label="Total Penduduk" tone="forest" />
              </div>

              <div>
                <h2 className="mb-3 text-base text-text-primary">Aksi cepat</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <QuickAction
                    icon={Plus}
                    title="Tambah Berita/Pengumuman"
                    desc="Buat pos berita atau pengumuman baru."
                    onClick={() => {
                      addBerita();
                      goTo("berita");
                    }}
                  />
                  <QuickAction
                    icon={Upload}
                    title="Upload Foto Galeri"
                    desc="Tambahkan foto baru ke galeri kelurahan."
                    onClick={() => {
                      addGalleryItem();
                      goTo("galeri");
                    }}
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
                </div>
              </div>

              <div className="rounded-lg border border-dashed border-border-strong bg-surface-sunken px-5 py-4 text-[13px] text-text-secondary">
                Klik langsung pada teks atau foto di tiap halaman untuk
                mengeditnya di tempat — mirip mengedit tampilan aslinya.
              </div>
            </div>
          )}

          {activeSection === "profil" && (
            <div className="group flex flex-col gap-6">
              <div className="overflow-hidden rounded-lg border border-border-default bg-surface-card">
                <div className="border-b border-border-default bg-surface-sunken px-5 py-3 text-xs font-semibold tracking-wide text-text-muted uppercase">
                  Pratinjau — Sejarah Kelurahan
                </div>
                <div className="grid grid-cols-1 gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                  <div className="flex flex-col gap-3">
                    <EditableText
                      as="p"
                      multiline
                      value={historyBody1}
                      onChange={setHistoryBody1}
                      className="text-[15px] leading-relaxed text-text-secondary"
                    />
                    <EditableText
                      as="p"
                      multiline
                      value={historyBody2}
                      onChange={setHistoryBody2}
                      className="text-[15px] leading-relaxed text-text-secondary"
                    />
                  </div>
                  <EditableImage
                    photo={historyPhoto}
                    label="Foto arsip kelurahan"
                    onPhotoChange={setHistoryPhoto}
                    className="h-[220px] w-full rounded-lg"
                  />
                </div>
                <div className="border-t border-border-default p-6 sm:p-8">
                  <div className="mb-2 text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Video Profil Kelurahan (opsional)
                  </div>
                  <VideoUpload url={profileVideo} onChange={setProfileVideo} />
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-border-default bg-surface-card">
                <div className="border-b border-border-default bg-surface-sunken px-5 py-3 text-xs font-semibold tracking-wide text-text-muted uppercase">
                  Pratinjau — Perangkat Kelurahan
                </div>
                <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 sm:p-8 lg:grid-cols-5">
                  {staff.map((person, i) => (
                    <div
                      key={i}
                      className="group/staff relative flex flex-col overflow-hidden rounded-lg border border-border-default"
                    >
                      <EditableImage
                        photo={person.photo}
                        label="Foto staf"
                        onPhotoChange={(url) => updateStaff(i, { photo: url })}
                        className="h-[130px] w-full"
                      />
                      <div className="flex flex-col gap-1 p-3 text-center">
                        <EditableText
                          as="div"
                          value={person.name}
                          onChange={(v) => updateStaff(i, { name: v })}
                          className="text-[13px] font-semibold text-text-primary"
                        />
                        <EditableText
                          as="div"
                          value={person.role}
                          onChange={(v) => updateStaff(i, { role: v })}
                          className="text-xs font-medium text-ocean-700"
                        />
                        <EditableText
                          as="div"
                          value={person.nip}
                          onChange={(v) => updateStaff(i, { nip: v })}
                          className="font-mono text-[10px] text-text-muted"
                        />
                      </div>
                      <button
                        type="button"
                        aria-label="Hapus staf"
                        onClick={() => removeStaff(i)}
                        className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-white/90 text-[#DC2626] opacity-0 shadow-sm transition-opacity group-hover/staff:opacity-100"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addStaff}
                    className="flex min-h-[190px] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong text-text-secondary"
                  >
                    <Plus className="size-5" />
                    <span className="text-xs font-medium">Tambah staf</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "galeri" && (
            <div className="overflow-hidden rounded-lg border border-border-default bg-surface-card">
              <div className="border-b border-border-default bg-surface-sunken px-5 py-3 text-xs font-semibold tracking-wide text-text-muted uppercase">
                Pratinjau — Galeri Kelurahan
              </div>
              <div className="grid grid-cols-2 gap-5 p-6 sm:grid-cols-4 sm:p-8">
                {gallery.map((item, i) => (
                  <div key={i} className="group/gal relative flex flex-col gap-2">
                    <EditableImage
                      photo={item.photo}
                      label={item.label}
                      onPhotoChange={(url) => updateGallery(i, { photo: url })}
                      className="h-[130px] w-full rounded-lg"
                    />
                    <EditableText
                      as="div"
                      value={item.label}
                      onChange={(v) => updateGallery(i, { label: v })}
                      className="text-center text-xs text-text-secondary"
                    />
                    <button
                      type="button"
                      aria-label="Hapus foto"
                      onClick={() => removeGallery(i)}
                      className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-white/90 text-[#DC2626] opacity-0 shadow-sm transition-opacity group-hover/gal:opacity-100"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addGalleryItem}
                  className="flex h-[130px] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong text-text-secondary"
                >
                  <Plus className="size-5" />
                  <span className="text-xs font-medium">Tambah foto</span>
                </button>
              </div>
            </div>
          )}

          {activeSection === "berita" && (
            <div className="flex flex-col gap-5">
              {berita.map((b, i) => (
                <div
                  key={i}
                  className="group/post relative overflow-hidden rounded-lg border border-border-default bg-surface-card sm:flex"
                >
                  <EditableImage
                    photo={b.photo}
                    label="Foto berita"
                    onPhotoChange={(url) => updateBerita(i, { photo: url })}
                    className="h-[160px] w-full shrink-0 sm:h-auto sm:w-[220px]"
                  />
                  <div className="flex flex-1 flex-col gap-2.5 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <select
                        value={b.cat}
                        onChange={(e) =>
                          updateBerita(i, { cat: e.target.value as BeritaPost["cat"] })
                        }
                        className={cn(
                          "w-fit rounded-full border-0 px-2.5 py-[3px] text-[11px] font-semibold uppercase outline-none",
                          b.cat === "pengumuman"
                            ? "bg-forest-50 text-forest-700"
                            : "bg-ocean-50 text-ocean-700",
                        )}
                      >
                        <option value="berita">Berita</option>
                        <option value="pengumuman">Pengumuman</option>
                      </select>
                      <button
                        type="button"
                        aria-label="Hapus pos"
                        onClick={() => removeBerita(i)}
                        className="flex size-7 items-center justify-center rounded-sm text-[#DC2626] opacity-0 transition-opacity group-hover/post:opacity-100"
                      >
                        <Trash2 className="size-[15px]" />
                      </button>
                    </div>
                    <EditableText
                      as="h3"
                      value={b.title}
                      onChange={(v) => updateBerita(i, { title: v })}
                      className="text-[17px] font-semibold text-text-primary"
                    />
                    <EditableText
                      as="p"
                      multiline
                      value={b.excerpt}
                      onChange={(v) => updateBerita(i, { excerpt: v })}
                      className="text-sm text-text-secondary"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted">Tanggal:</span>
                      <EditableText
                        as="span"
                        value={b.date}
                        onChange={(v) => updateBerita(i, { date: v })}
                        className="text-xs font-medium text-text-primary"
                      />
                    </div>
                    <div className="mt-1 border-t border-border-default pt-2.5">
                      <div className="mb-1 text-[11px] font-semibold tracking-wide text-text-muted uppercase">
                        Isi lengkap
                      </div>
                      <EditableText
                        as="p"
                        multiline
                        value={b.full}
                        onChange={(v) => updateBerita(i, { full: v })}
                        className="text-[13px] leading-relaxed text-text-secondary"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addBerita}
                className="inline-flex w-fit items-center gap-1.5 rounded-sm border border-dashed border-border-strong bg-transparent px-3.5 py-2 text-[13px] font-medium text-text-secondary"
              >
                <Plus className="size-3.5" /> Tambah Berita/Pengumuman
              </button>
            </div>
          )}

          {activeSection === "penduduk" && (
            <div className="flex flex-col gap-6">
              <div className="rounded-lg border border-border-default bg-surface-card p-6">
                <h2 className="m-0 mb-4 text-base text-text-primary">Statistik Penduduk</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <StatTile icon={Users} value={<EditableText value={total} onChange={setTotal} className="font-mono text-2xl font-semibold text-text-primary" />} label="Total Penduduk" tone="ocean" />
                  <StatTile icon={Landmark} value={<EditableText value={kk} onChange={setKk} className="font-mono text-2xl font-semibold text-text-primary" />} label="Kepala Keluarga" tone="forest" />
                  <StatTile icon={Users} value={<EditableText value={laki} onChange={setLaki} className="font-mono text-lg font-semibold text-text-primary" />} label="Laki-laki" tone="ocean" />
                  <StatTile icon={Users} value={<EditableText value={perempuan} onChange={setPerempuan} className="font-mono text-lg font-semibold text-text-primary" />} label="Perempuan" tone="ocean" />
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-lg border border-border-default bg-surface-card p-6">
                <h2 className="m-0 text-base text-text-primary">
                  Jumlah Rumah & Masjid per RW
                </h2>
                <div className="flex flex-col gap-2">
                  {rwRows.map((r, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1.2fr_1fr_1fr_auto] items-center gap-2"
                    >
                      <input
                        className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                        value={r.name}
                        placeholder="RW"
                        onChange={(e) => updateRw(i, { name: e.target.value })}
                      />
                      <input
                        className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                        value={r.rumah}
                        placeholder="Jumlah rumah"
                        onChange={(e) => updateRw(i, { rumah: e.target.value })}
                      />
                      <input
                        className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                        value={r.masjid}
                        placeholder="Masjid"
                        onChange={(e) => updateRw(i, { masjid: e.target.value })}
                      />
                      <button
                        type="button"
                        aria-label="Hapus baris"
                        onClick={() => removeRw(i)}
                        className="flex size-8 items-center justify-center rounded-sm border border-border-default bg-surface-card text-[#DC2626]"
                      >
                        <Trash2 className="size-[15px]" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addRw}
                  className="inline-flex w-fit items-center gap-1.5 rounded-sm border border-dashed border-border-strong bg-transparent px-3.5 py-2 text-[13px] font-medium text-text-secondary"
                >
                  <Plus className="size-3.5" /> Tambah RW
                </button>
                <div className="flex gap-6 border-t border-border-default pt-2 text-[13px] text-text-muted">
                  <span>
                    Total rumah (otomatis):{" "}
                    <strong className="font-mono text-text-primary">{totalRumah}</strong>
                  </span>
                  <span>
                    Total masjid (otomatis):{" "}
                    <strong className="font-mono text-text-primary">{totalMasjid}</strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-5 rounded-lg border border-border-default bg-surface-card p-6">
                <h2 className="m-0 text-base text-text-primary">
                  Realisasi Pajak (PBB-P2)
                </h2>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Pokok PBB-P2 Tahun 2026
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                      value={tax.pokokStts}
                      placeholder="STTS"
                      onChange={(e) => setTax({ ...tax, pokokStts: e.target.value })}
                    />
                    <input
                      className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                      value={tax.pokokRp}
                      placeholder="Rp"
                      onChange={(e) => setTax({ ...tax, pokokRp: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Realisasi Penerimaan PBB — S/D Bulan Lalu
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                      value={tax.pbbLaluStts}
                      placeholder="STTS"
                      onChange={(e) => setTax({ ...tax, pbbLaluStts: e.target.value })}
                    />
                    <input
                      className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                      value={tax.pbbLaluRp}
                      placeholder="Rp"
                      onChange={(e) => setTax({ ...tax, pbbLaluRp: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Realisasi Penerimaan PBB — Bulan Ini
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                      value={tax.pbbIniStts}
                      placeholder="STTS"
                      onChange={(e) => setTax({ ...tax, pbbIniStts: e.target.value })}
                    />
                    <input
                      className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                      value={tax.pbbIniRp}
                      placeholder="Rp"
                      onChange={(e) => setTax({ ...tax, pbbIniRp: e.target.value })}
                    />
                  </div>
                </div>
                <div className="rounded-sm bg-ocean-50 px-4 py-3 text-[13px] text-ocean-800">
                  S/D Bulan Ini (otomatis):{" "}
                  <strong className="font-mono">
                    {fmtId(pbbSdIniStts)} STTS · Rp {fmtId(pbbSdIniRp)}
                  </strong>{" "}
                  — Persentase realisasi (otomatis): <strong>{pctRealisasi}%</strong>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Jumlah Tunggakan Tahun 2025
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                      value={tax.tunggakanStts}
                      placeholder="STTS"
                      onChange={(e) => setTax({ ...tax, tunggakanStts: e.target.value })}
                    />
                    <input
                      className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                      value={tax.tunggakanRp}
                      placeholder="Rp"
                      onChange={(e) => setTax({ ...tax, tunggakanRp: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Tunggakan + Denda — S/D Bulan Lalu
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                      value={tax.tdLaluStts}
                      placeholder="STTS"
                      onChange={(e) => setTax({ ...tax, tdLaluStts: e.target.value })}
                    />
                    <input
                      className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                      value={tax.tdLaluRp}
                      placeholder="Rp"
                      onChange={(e) => setTax({ ...tax, tdLaluRp: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Tunggakan + Denda — Bulan Ini
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                      value={tax.tdIniStts}
                      placeholder="STTS"
                      onChange={(e) => setTax({ ...tax, tdIniStts: e.target.value })}
                    />
                    <input
                      className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                      value={tax.tdIniRp}
                      placeholder="Rp"
                      onChange={(e) => setTax({ ...tax, tdIniRp: e.target.value })}
                    />
                  </div>
                </div>
                <div className="rounded-sm bg-forest-50 px-4 py-3 text-[13px] text-forest-800">
                  Jumlah Penerimaan (otomatis):{" "}
                  <strong className="font-mono">
                    {fmtId(penerimaanStts)} STTS · Rp {fmtId(penerimaanRp)}
                  </strong>{" "}
                  — Persentase penerimaan (otomatis): <strong>{pctPenerimaan}%</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
