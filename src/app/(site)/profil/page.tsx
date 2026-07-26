import Image from "next/image";
import { PageHeader } from "@/components/site/page-header";
import { ImagePlaceholder } from "@/components/site/image-placeholder";

const STAFF_DETAIL = [
  {
    name: "Elvira Septia Ansar, S.STP",
    role: "Lurah",
    nip: "NIP. 19920923 201609 2 001",
  },
  {
    name: "Sultan, S.IP",
    role: "Sekretaris",
    nip: "NIP. 19740325 200903 1 004",
  },
  {
    name: "Aisyah Intang, S.Sos",
    role: "Kasi Pemerintahan",
    nip: "NIP. 19710725 200701 2 016",
  },
  {
    name: "Patmawati, S.Sos",
    role: "Kasi Kesos",
    nip: "NIP. 1976065 200701 2 029",
  },
  {
    name: "Nurmi, SM",
    role: "Kasi Pembangunan",
    nip: "NIP. 19721225 200801 2 012",
  },
];

export default function ProfilPage() {
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
              Kelurahan Jagong merupakan salah satu kelurahan yang berada di
              Kecamatan Pangkajene, Kabupaten Pangkajene dan Kepulauan,
              Provinsi Sulawesi Selatan. Berlokasi strategis di dekat pusat
              pemerintahan kecamatan dan kabupaten, Kelurahan Jagong
              berkembang sebagai kawasan perkotaan dengan potensi di bidang
              pertanian, perdagangan, serta pelayanan masyarakat. Didukung
              oleh masyarakat yang menjunjung tinggi nilai budaya Bugis dan
              Makassar, Kelurahan Jagong terus berkembang melalui peningkatan
              kualitas pendidikan, kesehatan, dan infrastruktur demi
              mewujudkan kesejahteraan masyarakat.
            </p>
          </div>
          <ImagePlaceholder
            label="Foto arsip kelurahan (contoh)"
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

        {/* Diagram sebagai gambar — jika struktur berubah, cukup ganti file
            public/images/Struktur/Struktur_Organisasi_Kelurahan.jpg */}
        <div className="overflow-x-auto rounded-lg border border-border-default bg-surface-card p-4 sm:p-8">
          <Image
            src="/images/Struktur/Struktur_Organisasi_Kelurahan.jpg"
            alt="Bagan Struktur Organisasi Kelurahan Jagong"
            width={1348}
            height={531}
            className="h-auto w-full min-w-[640px]"
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
          {STAFF_DETAIL.map((person) => (
            <div
              key={person.name}
              className="flex flex-col overflow-hidden rounded-lg border border-border-default bg-surface-card"
            >
              <ImagePlaceholder label="Foto staf" className="h-[180px] w-full" />
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
