import { Info, Users, Home, User } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";

const fmt = (n: number) => n.toLocaleString("id-ID");

const STATS = [
  { icon: Users, value: "4.244", label: "Total Penduduk", tone: "ocean" as const },
  { icon: Home, value: "1.280", label: "Kepala Keluarga", tone: "forest" as const },
  { icon: User, value: "2.098", label: "Laki-laki (49,43%)", tone: "ocean" as const },
  { icon: User, value: "2.146", label: "Perempuan (50,57%)", tone: "ocean" as const },
];

const RW_ROWS = [
  { name: "RW 01", rumah: 346, masjid: 6 },
  { name: "RW 02", rumah: 559, masjid: 3 },
  { name: "RW 03", rumah: 193, masjid: 3 },
];

const totalRumah = RW_ROWS.reduce((sum, r) => sum + r.rumah, 0);
const totalMasjid = RW_ROWS.reduce((sum, r) => sum + r.masjid, 0);

const pokok = { stts: 1408, rp: 74636534 };
const pbbLalu = { stts: 399, rp: 17062485 };
const pbbIni = { stts: 200, rp: 8768427 };
const pbbSdIni = { stts: pbbLalu.stts + pbbIni.stts, rp: pbbLalu.rp + pbbIni.rp };
const tunggakan = { stts: 471, rp: 23719175 };
const tdLalu = { stts: 43, rp: 4262816 };
const tdIni = { stts: 4, rp: 411318 };
const tdSdIni = { stts: tdLalu.stts + tdIni.stts, rp: tdLalu.rp + tdIni.rp };
const penerimaan = { stts: pbbSdIni.stts + tdSdIni.stts, rp: pbbSdIni.rp + tdSdIni.rp };
const pctRealisasi = ((pbbSdIni.rp / pokok.rp) * 100).toFixed(2).replace(".", ",");
const pctPenerimaan = ((penerimaan.rp / pokok.rp) * 100).toFixed(2).replace(".", ",");

const TONE = {
  ocean: { badge: "bg-ocean-50", icon: "text-ocean-700" },
  forest: { badge: "bg-forest-50", icon: "text-forest-700" },
};

function TaxRow({
  label,
  stts,
  rp,
  indent,
  highlight,
  bold,
}: {
  label: string;
  stts: string;
  rp: string;
  indent?: boolean;
  highlight?: "ocean" | "forest";
  bold?: boolean;
}) {
  const highlightBg =
    highlight === "ocean"
      ? "bg-ocean-50"
      : highlight === "forest"
        ? "bg-forest-50"
        : "";
  return (
    <div
      className={`grid grid-cols-[2.2fr_0.8fr_1.2fr] border-t border-border-default first:border-t-0 ${highlightBg}`}
    >
      <div
        className={`px-4 py-3.5 font-body text-sm text-text-primary ${indent ? "pl-6" : ""} ${bold ? "font-semibold" : "font-medium"}`}
      >
        {label}
      </div>
      <div
        className={`px-4 py-3.5 font-mono text-sm text-text-primary ${bold ? "font-semibold" : ""}`}
      >
        {stts}
      </div>
      <div
        className={`px-4 py-3.5 font-mono text-sm text-text-primary ${bold ? "font-semibold" : ""}`}
      >
        {rp}
      </div>
    </div>
  );
}

export default function DataPendudukPage() {
  return (
    <main className="flex-1">
      <PageHeader
        title="Data Penduduk"
        subtitle="Statistik penduduk Kelurahan Jagong, Kecamatan Pangkajene."
      />

      <section className="mx-auto max-w-[1120px] px-6 pt-8">
        <div className="flex items-start gap-3 rounded-md border border-[#F0D989] bg-[#FDF3D8] px-5 py-4">
          <Info className="mt-px size-[18px] shrink-0 text-[#CA8A04]" />
          <p className="m-0 text-sm leading-relaxed text-[#6B5410]">
            Data jumlah penduduk, KK, rumah, dan masjid bersumber dari Buku
            Agregat Kependudukan Kecamatan Pangkajene Jilid II Tahun 2025.
            Data realisasi pajak bersumber dari Laporan Bulanan Realisasi
            Penerimaan dan Tunggakan PBB-P2 Tahun 2026, Kecamatan Pangkajene.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pt-10">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          {STATS.map((s) => {
            const Icon = s.icon;
            const tone = TONE[s.tone];
            return (
              <div
                key={s.label}
                className="flex flex-col gap-2.5 rounded-lg border border-border-default bg-surface-card p-6"
              >
                <span
                  className={`flex size-[38px] items-center justify-center rounded-sm ${tone.badge}`}
                >
                  <Icon className={`size-[19px] ${tone.icon}`} />
                </span>
                <div className="font-mono text-[28px] font-semibold text-text-primary">
                  {s.value}
                </div>
                <div className="text-[13px] text-text-secondary">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pt-16">
        <h2 className="mb-2 text-[22px] text-text-primary">
          Jumlah Rumah & Masjid per RW
        </h2>
        <p className="mb-5 text-sm text-text-muted">
          Sumber: Buku Agregat Kependudukan Kecamatan Pangkajene, Jilid II
          Tahun 2025.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border-default bg-surface-card">
          <div className="min-w-[480px]">
            <div className="grid grid-cols-[1.2fr_1fr_1fr]">
              <div className="border-b-2 border-border-default px-4 py-3 font-body text-xs font-semibold tracking-wide text-text-muted uppercase">
                RW
              </div>
              <div className="border-b-2 border-border-default px-4 py-3 font-body text-xs font-semibold tracking-wide text-text-muted uppercase">
                Jumlah Rumah
              </div>
              <div className="border-b-2 border-border-default px-4 py-3 font-body text-xs font-semibold tracking-wide text-text-muted uppercase">
                Masjid
              </div>
            </div>
            {RW_ROWS.map((r) => (
              <div key={r.name} className="grid grid-cols-[1.2fr_1fr_1fr]">
                <div className="border-b border-border-default px-4 py-3.5 text-sm font-medium text-text-primary">
                  {r.name}
                </div>
                <div className="border-b border-border-default px-4 py-3.5 font-mono text-sm text-text-primary">
                  {r.rumah}
                </div>
                <div className="border-b border-border-default px-4 py-3.5 font-mono text-sm text-text-primary">
                  {r.masjid}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-[1.2fr_1fr_1fr]">
              <div className="px-4 py-3.5 text-sm font-medium text-text-primary">
                Jumlah
              </div>
              <div className="px-4 py-3.5 font-mono text-sm font-semibold text-text-primary">
                {totalRumah}
              </div>
              <div className="px-4 py-3.5 font-mono text-sm font-semibold text-text-primary">
                {totalMasjid}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pt-16 pb-16">
        <h2 className="mb-2 text-[22px] text-text-primary">
          Realisasi Pajak (PBB-P2)
        </h2>
        <p className="mb-6 text-sm text-text-muted">
          Laporan Bulanan Realisasi Penerimaan dan Tunggakan PBB-P2 Tahun
          2026, Kecamatan Pangkajene — s/d 30 Juni 2026. Data Kelurahan
          Jagong.
        </p>

        <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
          <div className="rounded-lg bg-ocean-50 p-6">
            <div className="mb-1.5 text-[13px] text-ocean-700">
              Persentase Realisasi PBB s/d Juni 2026
            </div>
            <div className="font-mono text-[32px] font-semibold text-ocean-800">
              {pctRealisasi}%
            </div>
          </div>
          <div className="rounded-lg bg-forest-50 p-6">
            <div className="mb-1.5 text-[13px] text-forest-700">
              Persentase Jumlah Penerimaan
            </div>
            <div className="font-mono text-[32px] font-semibold text-forest-800">
              {pctPenerimaan}%
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border-default bg-surface-card">
          <div className="min-w-[460px]">
          <div className="grid grid-cols-[2.2fr_0.8fr_1.2fr]">
            <div className="px-4 py-3 font-body text-xs font-semibold tracking-wide text-text-muted uppercase">
              Uraian
            </div>
            <div className="px-4 py-3 font-body text-xs font-semibold tracking-wide text-text-muted uppercase">
              STTS
            </div>
            <div className="px-4 py-3 font-body text-xs font-semibold tracking-wide text-text-muted uppercase">
              Rp
            </div>
          </div>

          <TaxRow
            label="Pokok PBB-P2 Tahun 2026"
            stts={fmt(pokok.stts)}
            rp={fmt(pokok.rp)}
          />

          <div className="border-t border-border-default px-4 pt-3 font-body text-xs font-semibold tracking-wide text-text-muted uppercase">
            Realisasi Penerimaan PBB Tahun 2026
          </div>
          <TaxRow label="S/D Bulan Lalu" stts={fmt(pbbLalu.stts)} rp={fmt(pbbLalu.rp)} indent />
          <TaxRow label="Bulan Ini" stts={fmt(pbbIni.stts)} rp={fmt(pbbIni.rp)} indent />
          <TaxRow
            label="S/D Bulan Ini"
            stts={fmt(pbbSdIni.stts)}
            rp={fmt(pbbSdIni.rp)}
            indent
            bold
            highlight="ocean"
          />

          <TaxRow
            label="Jumlah Tunggakan Tahun 2025"
            stts={fmt(tunggakan.stts)}
            rp={fmt(tunggakan.rp)}
          />

          <div className="border-t border-border-default px-4 pt-3 font-body text-xs font-semibold tracking-wide text-text-muted uppercase">
            Realisasi Penerimaan Tunggakan + Denda
          </div>
          <TaxRow label="S/D Bulan Lalu" stts={fmt(tdLalu.stts)} rp={fmt(tdLalu.rp)} indent />
          <TaxRow label="Bulan Ini" stts={fmt(tdIni.stts)} rp={fmt(tdIni.rp)} indent />
          <TaxRow
            label="S/D Bulan Ini"
            stts={fmt(tdSdIni.stts)}
            rp={fmt(tdSdIni.rp)}
            indent
            bold
            highlight="ocean"
          />

          <TaxRow
            label="Jumlah Penerimaan"
            stts={fmt(penerimaan.stts)}
            rp={fmt(penerimaan.rp)}
            bold
            highlight="forest"
          />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border-default bg-surface-sunken p-6">
          <div>
            <div className="mb-1 text-[15px] font-semibold text-text-primary">
              Sumber data
            </div>
            <div className="text-[13px] text-text-muted">
              Buku Agregat Kependudukan Kecamatan Pangkajene, Jilid II Tahun
              2025; Laporan Bulanan Realisasi Penerimaan dan Tunggakan PBB-P2
              Tahun 2026, Kecamatan Pangkajene.
            </div>
          </div>
          <span className="rounded-sm border border-border-default bg-surface-card px-3 py-1.5 font-mono text-xs text-text-muted">
            Tahun 2025 / Juni 2026
          </span>
        </div>
      </section>
    </main>
  );
}
