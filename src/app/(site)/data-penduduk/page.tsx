import { Info, Users, Home, User } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { DonutChart, PercentRing } from "@/components/site/donut-chart";
import {
  getPopulationSnapshot,
  getRwAreas,
  getTaxSummary,
} from "@/lib/supabase/queries";

const fmt = (n: number) => n.toLocaleString("id-ID");
const pct = (n: number) => n.toFixed(2).replace(".", ",");

const RW_CHART_COLORS = ["#0891B2", "#1F8347", "#CA8A04"];

const TONE = {
  ocean: { badge: "bg-ocean-50", icon: "text-ocean-700" },
  forest: { badge: "bg-forest-50", icon: "text-forest-700" },
};

function TaxRow({
  label,
  stts,
  rp,
  highlight,
  bold,
}: {
  label: string;
  stts: string;
  rp: string;
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
      className={`grid grid-cols-[1.4fr_0.8fr_1.1fr] border-t border-border-default first:border-t-0 ${highlightBg}`}
    >
      <div
        className={`px-5 py-3 font-body text-sm text-text-primary ${bold ? "font-semibold" : "font-medium"}`}
      >
        {label}
      </div>
      <div
        className={`px-4 py-3 font-mono text-sm text-text-primary ${bold ? "font-semibold" : ""}`}
      >
        {stts}
      </div>
      <div
        className={`px-4 py-3 font-mono text-sm text-text-primary ${bold ? "font-semibold" : ""}`}
      >
        {rp}
      </div>
    </div>
  );
}

export default async function DataPendudukPage() {
  const [population, rwAreas, tax] = await Promise.all([
    getPopulationSnapshot(),
    getRwAreas(),
    getTaxSummary(2026),
  ]);

  const totalPenduduk = population?.total_penduduk ?? 0;
  const laki = population?.laki_laki ?? 0;
  const perempuan = population?.perempuan ?? 0;
  const lakiPct = totalPenduduk > 0 ? pct((laki / totalPenduduk) * 100) : "0";
  const perempuanPct =
    totalPenduduk > 0 ? pct((perempuan / totalPenduduk) * 100) : "0";

  const STATS = [
    { icon: Users, value: fmt(totalPenduduk), label: "Total Penduduk", tone: "ocean" as const },
    { icon: Home, value: fmt(population?.kepala_keluarga ?? 0), label: "Kepala Keluarga", tone: "forest" as const },
    { icon: User, value: fmt(laki), label: `Laki-laki (${lakiPct}%)`, tone: "ocean" as const },
    { icon: User, value: fmt(perempuan), label: `Perempuan (${perempuanPct}%)`, tone: "ocean" as const },
  ];

  const GENDER_DATA = [
    { label: "Laki-laki", value: laki, color: "#0891B2" },
    { label: "Perempuan", value: perempuan, color: "#1F8347" },
  ];

  const RW_DATA = rwAreas.map((r, i) => ({
    label: r.name,
    value: r.rumah_count,
    color: RW_CHART_COLORS[i % RW_CHART_COLORS.length],
  }));

  const totalRumah = rwAreas.reduce((sum, r) => sum + r.rumah_count, 0);
  const totalMasjid = rwAreas.reduce((sum, r) => sum + r.masjid_count, 0);

  const penerimaan = tax
    ? {
        stts: tax.pbbSdIni.stts + tax.tdSdIni.stts,
        rp: tax.pbbSdIni.rp + tax.tdSdIni.rp,
      }
    : { stts: 0, rp: 0 };
  const pctRealisasi = tax && tax.pokok.rp > 0 ? pct((tax.pbbSdIni.rp / tax.pokok.rp) * 100) : "0";
  const pctPenerimaan = tax && tax.pokok.rp > 0 ? pct((penerimaan.rp / tax.pokok.rp) * 100) : "0";
  const pctTunggakan =
    tax && tax.tunggakanAwal.rp > 0 ? pct((tax.tdSdIni.rp / tax.tunggakanAwal.rp) * 100) : "0";

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
          Komposisi Penduduk
        </h2>
        <p className="mb-5 text-sm text-text-muted">
          Sebaran penduduk menurut jenis kelamin.
        </p>
        <div className="rounded-lg border border-border-default bg-surface-card p-6 sm:p-8">
          <DonutChart data={GENDER_DATA} />
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
        <div className="mb-5 rounded-lg border border-border-default bg-surface-card p-6 sm:p-8">
          <DonutChart data={RW_DATA} />
        </div>
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
            {rwAreas.map((r) => (
              <div key={r.id} className="grid grid-cols-[1.2fr_1fr_1fr]">
                <div className="border-b border-border-default px-4 py-3.5 text-sm font-medium text-text-primary">
                  {r.name}
                </div>
                <div className="border-b border-border-default px-4 py-3.5 font-mono text-sm text-text-primary">
                  {r.rumah_count}
                </div>
                <div className="border-b border-border-default px-4 py-3.5 font-mono text-sm text-text-primary">
                  {r.masjid_count}
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

      {tax && (
        <section className="mx-auto max-w-[1120px] px-6 pt-16 pb-16">
          <h2 className="mb-2 text-[22px] text-text-primary">
            Realisasi Pajak (PBB-P2)
          </h2>
          <p className="mb-1 text-sm text-text-muted">
            Laporan Bulanan Realisasi Penerimaan dan Tunggakan PBB-P2 Tahun
            2026, Kecamatan Pangkajene. Data Kelurahan Jagong.
          </p>
          <p className="mb-6 text-[12.5px] text-text-muted">
            STTS = jumlah Surat Tanda Terima Setoran (bukti pembayaran) yang
            diterbitkan.
          </p>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="overflow-hidden rounded-lg border border-border-default bg-surface-card">
              <div className="border-b border-border-default bg-surface-sunken px-5 py-3.5">
                <div className="text-sm font-semibold text-text-primary">
                  Realisasi PBB-P2 Tahun 2026
                </div>
                <div className="mt-0.5 text-[12px] text-text-muted">
                  Pokok: {fmt(tax.pokok.stts)} STTS · Rp {fmt(tax.pokok.rp)}
                </div>
              </div>
              <div className="grid grid-cols-[1.4fr_0.8fr_1.1fr] border-b border-border-default">
                <div className="px-5 py-2.5 font-body text-[11px] font-semibold tracking-wide text-text-muted uppercase">
                  Uraian
                </div>
                <div className="px-4 py-2.5 font-body text-[11px] font-semibold tracking-wide text-text-muted uppercase">
                  STTS
                </div>
                <div className="px-4 py-2.5 font-body text-[11px] font-semibold tracking-wide text-text-muted uppercase">
                  Rp
                </div>
              </div>
              <TaxRow label="S/D Bulan Lalu" stts={fmt(tax.pbbLalu.stts)} rp={fmt(tax.pbbLalu.rp)} />
              <TaxRow label="Bulan Ini" stts={fmt(tax.pbbIni.stts)} rp={fmt(tax.pbbIni.rp)} />
              <TaxRow
                label="S/D Bulan Ini"
                stts={fmt(tax.pbbSdIni.stts)}
                rp={fmt(tax.pbbSdIni.rp)}
                bold
                highlight="ocean"
              />
              <div className="grid grid-cols-[1.4fr_0.8fr_1.1fr] items-center border-t border-border-default bg-ocean-50">
                <span className="col-span-2 px-5 py-3 text-[12.5px] font-medium text-ocean-800">
                  Persentase realisasi terhadap pokok
                </span>
                <div className="flex justify-center px-2 py-2">
                  <PercentRing value={parseFloat(pctRealisasi.replace(",", "."))} color="#0891B2" />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-border-default bg-surface-card">
              <div className="border-b border-border-default bg-surface-sunken px-5 py-3.5">
                <div className="text-sm font-semibold text-text-primary">
                  Tunggakan + Denda Tahun 2025
                </div>
                <div className="mt-0.5 text-[12px] text-text-muted">
                  Jumlah tunggakan: {fmt(tax.tunggakanAwal.stts)} STTS · Rp{" "}
                  {fmt(tax.tunggakanAwal.rp)}
                </div>
              </div>
              <div className="grid grid-cols-[1.4fr_0.8fr_1.1fr] border-b border-border-default">
                <div className="px-5 py-2.5 font-body text-[11px] font-semibold tracking-wide text-text-muted uppercase">
                  Uraian
                </div>
                <div className="px-4 py-2.5 font-body text-[11px] font-semibold tracking-wide text-text-muted uppercase">
                  STTS
                </div>
                <div className="px-4 py-2.5 font-body text-[11px] font-semibold tracking-wide text-text-muted uppercase">
                  Rp
                </div>
              </div>
              <TaxRow label="S/D Bulan Lalu" stts={fmt(tax.tdLalu.stts)} rp={fmt(tax.tdLalu.rp)} />
              <TaxRow label="Bulan Ini" stts={fmt(tax.tdIni.stts)} rp={fmt(tax.tdIni.rp)} />
              <TaxRow
                label="S/D Bulan Ini"
                stts={fmt(tax.tdSdIni.stts)}
                rp={fmt(tax.tdSdIni.rp)}
                bold
                highlight="forest"
              />
              <div className="grid grid-cols-[1.4fr_0.8fr_1.1fr] items-center border-t border-border-default bg-forest-50">
                <span className="col-span-2 px-5 py-3 text-[12.5px] font-medium text-forest-800">
                  Persentase penagihan terhadap tunggakan
                </span>
                <div className="flex justify-center px-2 py-2">
                  <PercentRing value={parseFloat(pctTunggakan.replace(",", "."))} color="#1F8347" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-forest-200 bg-forest-50 px-5 py-4">
            <div>
              <div className="text-sm font-semibold text-forest-800">
                Jumlah Penerimaan Keseluruhan
              </div>
              <div className="text-[12px] text-forest-700">
                PBB-P2 + Tunggakan &amp; Denda, s/d Juni 2026
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-lg font-semibold text-forest-800">
                Rp {fmt(penerimaan.rp)}
              </div>
              <div className="font-mono text-[12px] text-forest-700">
                {fmt(penerimaan.stts)} STTS · {pctPenerimaan}% dari pokok
              </div>
            </div>
          </div>
        </section>
      )}

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
