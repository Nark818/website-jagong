import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { PetaMapLoader } from "@/components/site/peta-map-loader";
import { getKelurahanBoundaries, getMapPoints } from "@/lib/supabase/queries";

export default async function PetaKelurahanPage() {
  const [points, boundaries] = await Promise.all([
    getMapPoints(),
    getKelurahanBoundaries(),
  ]);
  const neighbors = boundaries.filter((b) => !b.is_self);

  return (
    <main className="flex-1">
      <PageHeader
        title="Peta Kelurahan"
        subtitle="Peta batas wilayah dan titik lokasi penting di Kelurahan Jagong."
      />

      <section className="mx-auto max-w-[1120px] px-6 pt-12">
        <p className="mb-7 max-w-[80ch] text-[18px] leading-[1.7] text-text-secondary">
          Peta interaktif berikut menampilkan batas wilayah Kelurahan Jagong
          beserta kelurahan tetangga, dan titik lokasi fasilitas penting
          seperti kantor kelurahan, sekolah, sarana kesehatan, tempat ibadah,
          dan rumah pengurus RT/RW. Klik ikon pada peta untuk melihat detail,
          atau gunakan tombol kategori untuk menampilkan/menyembunyikan jenis
          lokasi tertentu.
        </p>

        <PetaMapLoader points={points} boundaries={boundaries} />
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pt-16 pb-20">
        <h2 className="mb-5 text-[22px] text-text-primary">Kelurahan Tetangga</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {neighbors.map((b) => (
            <div
              key={b.id}
              className="rounded-md border border-border-default bg-surface-card p-5"
            >
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="size-[15px] text-ocean-600" />
                <span className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  Tetangga
                </span>
              </div>
              <div className="text-sm font-medium text-text-primary">{b.kel_desa}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
