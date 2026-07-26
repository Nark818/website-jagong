import { PageHeader } from "@/components/site/page-header";
import { ImagePlaceholder } from "@/components/site/image-placeholder";

const GALLERY = [
  "Balai Kelurahan",
  "Kegiatan gotong royong",
  "Lahan pertanian warga",
  "Tambak ikan bandeng",
  "Posyandu kelurahan",
  "Panen raya jagung",
  "Kantor kelurahan",
  "Pasar kelurahan",
];

// TODO: replace this plain grid with an animated "memory lane" scroll
// experience once the real photo set is ready.
export default function GaleriPage() {
  return (
    <main className="flex-1">
      <PageHeader
        title="Galeri Kelurahan"
        subtitle="Dokumentasi kegiatan dan lingkungan Kelurahan Jagong."
      />

      <section className="mx-auto max-w-[1120px] px-6 py-16">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {GALLERY.map((label) => (
            <ImagePlaceholder
              key={label}
              label={label}
              className="h-[200px] w-full rounded-[14px]"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
