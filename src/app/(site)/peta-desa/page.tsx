import { Info, Compass } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { ImagePlaceholder } from "@/components/site/image-placeholder";

const BOUNDARIES = [
  { dir: "Utara", value: "Kelurahan Bonto-Bonto (contoh)" },
  { dir: "Selatan", value: "Kelurahan Tumampua (contoh)" },
  { dir: "Timur", value: "Kelurahan Samalewa (contoh)" },
  { dir: "Barat", value: "Selat Makassar (contoh)" },
];

const DUSUN_ROWS = [
  { name: "Dusun I", area: "3,1 km²", coord: "4°51'S, 119°34'E" },
  { name: "Dusun II", area: "2,8 km²", coord: "4°52'S, 119°35'E" },
  { name: "Dusun III", area: "3,4 km²", coord: "4°53'S, 119°34'E" },
  { name: "Dusun IV", area: "3,1 km²", coord: "4°52'S, 119°33'E" },
];

export default function PetaKelurahanPage() {
  return (
    <main className="flex-1">
      <PageHeader
        title="Peta Kelurahan"
        subtitle="Peta batas wilayah dan sebaran dusun Kelurahan Jagong."
      />

      <section className="mx-auto max-w-[1120px] px-6 pt-12">
        <p className="mb-7 max-w-[80ch] text-[18px] leading-[1.7] text-text-secondary">
          Peta di bawah ini menampilkan batas administratif dan sebaran dusun
          Kelurahan Jagong. Peta interaktif hasil pemetaan QGIS akan
          ditampilkan di sini setelah tersedia.
        </p>

        {/* Replace with an iframe/map embed pointing at the QGIS export URL when ready */}
        <div id="qgis-map-slot">
          <ImagePlaceholder
            label="Peta Kelurahan Jagong (akan diisi dari hasil pemetaan QGIS)"
            className="h-[520px] w-full rounded-2xl"
          />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Info className="size-3.5 shrink-0 text-text-muted" />
          <span className="text-[13px] text-text-muted">
            Peta ini bersifat sementara dan akan diperbarui dengan peta
            resmi hasil pemetaan QGIS.
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pt-16">
        <h2 className="mb-5 text-[22px] text-text-primary">Batas Wilayah</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {BOUNDARIES.map((b) => (
            <div
              key={b.dir}
              className="rounded-md border border-border-default bg-surface-card p-5"
            >
              <div className="mb-2 flex items-center gap-2">
                <Compass className="size-[15px] text-ocean-600" />
                <span className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  {b.dir}
                </span>
              </div>
              <div className="text-sm font-medium text-text-primary">
                {b.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pt-16 pb-20">
        <h2 className="mb-2 text-[22px] text-text-primary">
          Sebaran Dusun
        </h2>
        <p className="mb-5 text-sm text-text-muted">
          Data luas dan koordinat contoh — akan diperbarui sesuai hasil
          pemetaan resmi.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border-default bg-surface-card">
          <table className="w-full min-w-[480px] border-collapse font-body">
            <thead>
              <tr>
                <th className="border-b-2 border-border-default px-4 py-3 text-left text-xs font-semibold tracking-wide text-text-muted uppercase">
                  Dusun
                </th>
                <th className="border-b-2 border-border-default px-4 py-3 text-left text-xs font-semibold tracking-wide text-text-muted uppercase">
                  Perkiraan Luas
                </th>
                <th className="border-b-2 border-border-default px-4 py-3 text-left text-xs font-semibold tracking-wide text-text-muted uppercase">
                  Koordinat (contoh)
                </th>
              </tr>
            </thead>
            <tbody>
              {DUSUN_ROWS.map((d) => (
                <tr key={d.name}>
                  <td className="border-b border-border-default px-4 py-3.5 text-sm font-medium text-text-primary">
                    {d.name}
                  </td>
                  <td className="border-b border-border-default px-4 py-3.5 text-sm text-text-primary">
                    {d.area}
                  </td>
                  <td className="border-b border-border-default px-4 py-3.5 font-mono text-[13px] text-text-secondary">
                    {d.coord}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
