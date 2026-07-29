import { PageHeader } from "@/components/site/page-header";
import { BeritaBrowser } from "@/components/site/berita-browser";
import { getNewsPosts } from "@/lib/supabase/queries";

export default async function BeritaPage() {
  const posts = await getNewsPosts();

  return (
    <main className="flex-1">
      <PageHeader
        title="Berita & Pengumuman"
        subtitle="Informasi resmi dan kabar terbaru seputar kegiatan Kelurahan Jagong."
      />

      <section className="mx-auto max-w-[1120px] px-6 pt-10 pb-20">
        <BeritaBrowser posts={posts} />
      </section>
    </main>
  );
}
