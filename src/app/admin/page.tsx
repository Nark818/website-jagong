"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Landmark,
  Megaphone,
  BarChart3,
  ExternalLink,
  Save,
  CheckCircle2,
  Trash2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const numFromId = (str: string) => parseInt(str.replace(/[^\d]/g, ""), 10) || 0;
const fmtId = (n: number) => n.toLocaleString("id-ID");

type BeritaPost = {
  cat: "berita" | "pengumuman";
  title: string;
  date: string;
  excerpt: string;
  full: string;
};

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
  { key: "profil", label: "Profil Kelurahan", icon: Landmark },
  { key: "berita", label: "Berita & Pengumuman", icon: Megaphone },
  { key: "penduduk", label: "Data Penduduk", icon: BarChart3 },
] as const;

const NOTES: Record<(typeof SECTIONS)[number]["key"], string> = {
  profil:
    "Sejarah, visi misi, dan struktur pemerintahan yang tampil di halaman Profil Kelurahan.",
  berita: "Kelola daftar berita dan pengumuman yang tampil di Beranda dan halaman Berita.",
  penduduk:
    "Statistik penduduk, data RW, dan realisasi pajak yang tampil di halaman Data Penduduk.",
};

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
        {label}
      </label>
      <input
        className="w-full rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:ring-2 focus:ring-ocean-500"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  minHeight,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  minHeight?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
        {label}
      </label>
      <textarea
        className="w-full resize-y rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:ring-2 focus:ring-ocean-500"
        style={{ minHeight: minHeight ?? 70 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function EditableList({
  label,
  items,
  onChangeItem,
  onRemoveItem,
  onAdd,
  addLabel,
}: {
  label: string;
  items: string[];
  onChangeItem: (i: number, v: string) => void;
  onRemoveItem: (i: number) => void;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
        {label}
      </label>
      <div className="flex flex-col gap-2">
        {items.map((text, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className="w-full rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:ring-2 focus:ring-ocean-500"
              value={text}
              onChange={(e) => onChangeItem(i, e.target.value)}
            />
            <button
              type="button"
              aria-label="Hapus"
              onClick={() => onRemoveItem(i)}
              className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-border-default bg-surface-card text-[#DC2626]"
            >
              <Trash2 className="size-[15px]" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-2.5 inline-flex items-center gap-1.5 rounded-sm border border-dashed border-border-strong bg-transparent px-3.5 py-2 text-[13px] font-medium text-text-secondary"
      >
        <Plus className="size-3.5" /> {addLabel}
      </button>
    </div>
  );
}

export default function AdminPanelPage() {
  const [activeSection, setActiveSection] =
    useState<(typeof SECTIONS)[number]["key"]>("profil");
  const [showSaved, setShowSaved] = useState(false);

  const [historyBody1, setHistoryBody1] = useState(
    'Kelurahan Jagong terbentuk dari beberapa dusun yang bergabung menjadi satu wilayah administratif di Kecamatan Pangkajene. Nama "Jagong" berasal dari kebiasaan warga bermusyawarah di bawah pohon besar di tengah kelurahan.',
  );
  const [historyBody2, setHistoryBody2] = useState(
    "Sejak dimekarkan, Kelurahan Jagong berkembang sebagai kawasan agraris dengan mata pencaharian utama warga di bidang pertanian, perikanan tambak, dan perdagangan hasil bumi.",
  );
  const [visionText, setVisionText] = useState(
    "Mewujudkan Kelurahan Jagong yang mandiri, sejahtera, dan berbudaya melalui tata kelola pemerintahan yang transparan dan partisipatif.",
  );
  const [missionItems, setMissionItems] = useState([
    "Meningkatkan kualitas pelayanan publik yang cepat dan transparan.",
    "Mendorong pertumbuhan ekonomi kelurahan berbasis potensi lokal.",
    "Memperkuat partisipasi warga dalam pembangunan kelurahan.",
    "Menjaga kelestarian lingkungan dan sumber daya alam kelurahan.",
  ]);
  const [headName, setHeadName] = useState("H. Abdul Rahman, S.Sos.");
  const [secretaryName, setSecretaryName] = useState("Sekretaris Kelurahan");
  const [kaurList, setKaurList] = useState([
    "Kaur Keuangan",
    "Kaur Umum & TU",
    "Kaur Perencanaan",
  ]);
  const [dusunList, setDusunList] = useState([
    "Kepala Dusun I",
    "Kepala Dusun II",
    "Kepala Dusun III",
    "Kepala Dusun IV",
  ]);

  const [berita, setBerita] = useState<BeritaPost[]>([
    {
      cat: "pengumuman",
      title: "Jadwal Musyawarah Kelurahan Tahun 2026",
      date: "18 Juli 2026",
      excerpt:
        "Musyawarah kelurahan membahas RKP Kelurahan 2027 akan dilaksanakan di Balai Kelurahan Jagong.",
      full: "Seluruh kepala keluarga diundang untuk hadir dalam musyawarah kelurahan membahas Rencana Kerja Pemerintah (RKP) Kelurahan tahun 2027.",
    },
    {
      cat: "berita",
      title: "Panen Raya Jagung di Dusun Bontoa Berjalan Lancar",
      date: "12 Juli 2026",
      excerpt:
        "Musim panen jagung tahun ini mencatat hasil yang baik berkat program penyuluhan pertanian kelurahan.",
      full: "Kelompok tani Dusun Bontoa berhasil memanen jagung dengan hasil di atas rata-rata tahun sebelumnya.",
    },
    {
      cat: "pengumuman",
      title: "Pembukaan Pendaftaran Bantuan Sosial Tahap II",
      date: "5 Juli 2026",
      excerpt:
        "Pendaftaran bantuan sosial tahap II dibuka mulai 8 Juli hingga 20 Juli 2026 di kantor kelurahan.",
      full: "Warga yang memenuhi kriteria dapat mendaftar dengan membawa KTP, KK, dan surat keterangan tidak mampu.",
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

  const updateBerita = (i: number, patch: Partial<BeritaPost>) =>
    setBerita((items) => items.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  const removeBerita = (i: number) =>
    setBerita((items) => items.filter((_, idx) => idx !== i));
  const addBerita = () =>
    setBerita((items) => [
      ...items,
      { cat: "berita", title: "Judul berita baru", date: "", excerpt: "", full: "" },
    ]);

  const updateRw = (i: number, patch: Partial<RwRow>) =>
    setRwRows((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const removeRw = (i: number) => setRwRows((rows) => rows.filter((_, idx) => idx !== i));
  const addRw = () =>
    setRwRows((rows) => [...rows, { name: `RW 0${rows.length + 1}`, rumah: "0", masjid: "0" }]);

  const listOps = (list: string[], setList: (v: string[]) => void) => ({
    onChange: (i: number, v: string) =>
      setList(list.map((item, idx) => (idx === i ? v : item))),
    onRemove: (i: number) => setList(list.filter((_, idx) => idx !== i)),
  });

  return (
    <div className="flex min-h-screen flex-col bg-surface-page md:flex-row">
      {/* Mobile top bar (sidebar replacement below md) */}
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

        <div className="w-full max-w-[920px] flex-1 box-border p-4 sm:p-8">
          {activeSection === "profil" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 rounded-lg border border-border-default bg-surface-card p-6">
                <h2 className="m-0 text-base text-text-primary">
                  Sejarah Kelurahan
                </h2>
                <TextField label="Paragraf 1" value={historyBody1} onChange={setHistoryBody1} />
                <TextField label="Paragraf 2" value={historyBody2} onChange={setHistoryBody2} />
              </div>

              <div className="flex flex-col gap-4 rounded-lg border border-border-default bg-surface-card p-6">
                <h2 className="m-0 text-base text-text-primary">Visi & Misi</h2>
                <TextField label="Visi" value={visionText} onChange={setVisionText} />
                <EditableList
                  label="Misi"
                  items={missionItems}
                  onChangeItem={listOps(missionItems, setMissionItems).onChange}
                  onRemoveItem={listOps(missionItems, setMissionItems).onRemove}
                  onAdd={() => setMissionItems([...missionItems, "Poin misi baru"])}
                  addLabel="Tambah poin misi"
                />
              </div>

              <div className="flex flex-col gap-4 rounded-lg border border-border-default bg-surface-card p-6">
                <h2 className="m-0 text-base text-text-primary">
                  Struktur Pemerintahan
                </h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                  <Field label="Nama Kepala Kelurahan" value={headName} onChange={setHeadName} />
                  <Field label="Nama Sekretaris" value={secretaryName} onChange={setSecretaryName} />
                </div>
                <EditableList
                  label="Kaur / Kasi"
                  items={kaurList}
                  onChangeItem={listOps(kaurList, setKaurList).onChange}
                  onRemoveItem={listOps(kaurList, setKaurList).onRemove}
                  onAdd={() => setKaurList([...kaurList, "Kaur baru"])}
                  addLabel="Tambah Kaur/Kasi"
                />
                <EditableList
                  label="Kepala Dusun"
                  items={dusunList}
                  onChangeItem={listOps(dusunList, setDusunList).onChange}
                  onRemoveItem={listOps(dusunList, setDusunList).onRemove}
                  onAdd={() => setDusunList([...dusunList, "Kepala Dusun baru"])}
                  addLabel="Tambah Dusun"
                />
              </div>
            </div>
          )}

          {activeSection === "berita" && (
            <div className="flex flex-col gap-5">
              {berita.map((b, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-lg border border-border-default bg-surface-card p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                      Pos #{i + 1}
                    </span>
                    <button
                      type="button"
                      aria-label="Hapus pos"
                      onClick={() => removeBerita(i)}
                      className="flex size-8 items-center justify-center rounded-sm border border-border-default bg-surface-card text-[#DC2626]"
                    >
                      <Trash2 className="size-[15px]" />
                    </button>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
                        Kategori
                      </label>
                      <select
                        className="w-full rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
                        value={b.cat}
                        onChange={(e) =>
                          updateBerita(i, { cat: e.target.value as BeritaPost["cat"] })
                        }
                      >
                        <option value="berita">Berita</option>
                        <option value="pengumuman">Pengumuman</option>
                      </select>
                    </div>
                    <Field
                      label="Tanggal"
                      value={b.date}
                      onChange={(v) => updateBerita(i, { date: v })}
                    />
                  </div>
                  <Field
                    label="Judul"
                    value={b.title}
                    onChange={(v) => updateBerita(i, { title: v })}
                  />
                  <TextField
                    label="Ringkasan"
                    value={b.excerpt}
                    onChange={(v) => updateBerita(i, { excerpt: v })}
                  />
                  <TextField
                    label="Isi lengkap"
                    value={b.full}
                    onChange={(v) => updateBerita(i, { full: v })}
                    minHeight={100}
                  />
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
              <div className="flex flex-col gap-4 rounded-lg border border-border-default bg-surface-card p-6">
                <h2 className="m-0 text-base text-text-primary">
                  Statistik Penduduk
                </h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
                  <Field label="Total Penduduk" value={total} onChange={setTotal} />
                  <Field label="Kepala Keluarga" value={kk} onChange={setKk} />
                  <Field label="Laki-laki" value={laki} onChange={setLaki} />
                  <Field label="Perempuan" value={perempuan} onChange={setPerempuan} />
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
