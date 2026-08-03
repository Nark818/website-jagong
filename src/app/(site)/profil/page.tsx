import { PageHeader } from "@/components/site/page-header";
import { DbImage } from "@/components/site/db-image";
import { getContentBlocks, getStaff } from "@/lib/supabase/queries";

export default async function ProfilPage() {
  const [content, staff] = await Promise.all([getContentBlocks(), getStaff()]);

  return (
    <main className="flex-1">
      <PageHeader
        title="Profil Kelurahan"
        subtitle="Sejarah, struktur pemerintahan, dan perangkat Kelurahan Jagong."
      />

      {/* Sejarah */}
      <section className="mx-auto max-w-[1120px] px-6 pt-16">
        <span className="text-[13px] font-semibold tracking-wide text-forest-600 uppercase">
          Profil Kelurahan
        </span>
        <div className="mt-3 grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,1fr)]">
          <div>
            <h2 className="mb-4 text-[clamp(24px,3vw,30px)] text-text-primary">
              Sejarah Kelurahan
            </h2>
            <p className="text-justify text-[18px] leading-[1.75] text-text-secondary">
              {content["sejarah.body_1"] ??
                "Kelurahan Jagong merupakan salah satu kelurahan yang berada di Kecamatan Pangkajene, Kabupaten Pangkajene dan Kepulauan, Provinsi Sulawesi Selatan."}
            </p>
          </div>
          <DbImage
            src={content["sejarah.photo_url"] ?? null}
            alt="Foto arsip kelurahan"
            className="h-[300px] w-full rounded-lg"
          />
        </div>
      </section>

      {/* Struktur Pemerintahan */}
      <section className="mx-auto max-w-[1120px] px-6 pt-16">
        <h2 className="mb-2 text-2xl text-text-primary">
          Struktur Pemerintahan
        </h2>
        <p className="mb-8 text-sm text-text-muted">
          Struktur Organisasi Kelurahan Jagong.
        </p>

        <div className="overflow-x-auto rounded-lg border border-border-default bg-surface-card p-4 sm:p-8">
          <DbImage
            src={
              content["profil.struktur_image_url"] ??
              "/images/Struktur/Struktur_Organisasi_Kelurahan.jpg"
            }
            alt="Bagan Struktur Organisasi Kelurahan Jagong"
            fit="natural"
            className="min-w-[640px]"
          />
        </div>
      </section>

      {/* Detail Perangkat Kelurahan */}
      <section className="mx-auto max-w-[1120px] px-6 py-16">
        <h2 className="mb-2 text-2xl text-text-primary">
          Perangkat Kelurahan
        </h2>
        <p className="mb-8 text-sm text-text-muted">
          Detail pejabat Kelurahan Jagong.
        </p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {staff.map((person) => (
            <div
              key={person.id}
              className="flex flex-col overflow-hidden rounded-lg border border-border-default bg-surface-card"
            >
              <DbImage
                src={person.photo_url}
                alt="Foto staf"
                className="h-[180px] w-full object-[center_25%]"
              />
              <div className="p-4 text-center">
                <div className="text-sm font-semibold text-text-primary">
                  {person.name}
                </div>
                <div className="mt-1 text-xs font-medium text-ocean-700">
                  {person.role}
                </div>
                <div className="mt-1 font-mono text-[10.5px] text-text-muted">
                  {person.nip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
