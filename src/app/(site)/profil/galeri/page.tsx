import { PageHeader } from "@/components/site/page-header";
import { GaleriScrollGallery } from "@/components/site/galeri-scroll-gallery";
import { getGalleryItems } from "@/lib/supabase/queries";

export default async function GaleriPage() {
  const gallery = await getGalleryItems();

  return (
    <main className="flex-1">
      <PageHeader
        title="Galeri Kelurahan"
        subtitle="Dokumentasi kegiatan dan lingkungan Kelurahan Jagong."
      />
      <section className="mx-auto max-w-[1320px] px-6 py-16">
        <GaleriScrollGallery items={gallery} />
      </section>
    </main>
  );
}
