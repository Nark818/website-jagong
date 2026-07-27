import { Info, Compass } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { ImagePlaceholder } from "@/components/site/image-placeholder";

const BOUNDARIES = [
  { dir: "Utara", value: "Kelurahan Mappasaile" },
  { dir: "Selatan", value: "Kelurahan Anrong Appaka" },
  { dir: "Timur", value: "Kelurahan Tumampua" },
  { dir: "Barat", value: "Kelurahan Tekolabbua" },
];

export default function PetaKelurahanPage() {
  return (
    <main className="flex-1">
      <PageHeader
        title="Peta Kelurahan"
        subtitle="Peta batas wilayah Kelurahan Jagong."
      />

      <section className="mx-auto max-w-[1120px] px-6 pt-12">
        <p className="mb-7 max-w-[80ch] text-[18px] leading-[1.7] text-text-secondary">
          Peta di bawah ini menampilkan batas administratif Kelurahan Jagong.
          Peta interaktif hasil pemetaan QGIS akan ditampilkan di sini
          setelah tersedia.
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

      <section className="mx-auto max-w-[1120px] px-6 pt-16 pb-20">
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
    </main>
  );
}
