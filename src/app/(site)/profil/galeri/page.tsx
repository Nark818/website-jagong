import { PageHeader } from "@/components/site/page-header";
import { DbImage } from "@/components/site/db-image";
import { getGalleryItems } from "@/lib/supabase/queries";

// TODO: replace this plain grid with an animated "memory lane" scroll
// experience once the real photo set is ready.
export default async function GaleriPage() {
  const gallery = await getGalleryItems();

  return (
    <main className="flex-1">
      <PageHeader
        title="Galeri Kelurahan"
        subtitle="Dokumentasi kegiatan dan lingkungan Kelurahan Jagong."
      />
      <section className="mx-auto max-w-[1120px] px-6 py-16">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {gallery.map((item) => (
            <DbImage
              key={item.id}
              src={item.photo_url}
              alt={item.label}
              className="h-[200px] w-full rounded-[14px]"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
