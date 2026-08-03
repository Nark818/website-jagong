import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminPanel from "@/components/admin/admin-panel";
import {
  getContentBlocks,
  getGalleryItems,
  getHeroSlides,
  getKelurahanBoundaries,
  getMapPoints,
  getNewsPosts,
  getPopulationSnapshot,
  getRwAreas,
  getServiceTypes,
  getStaff,
  getTaxMonthlyRealizations,
  getTaxYearTarget,
} from "@/lib/supabase/queries";

const TAX_YEAR = 2026;

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [
    content,
    heroSlides,
    staff,
    gallery,
    news,
    population,
    rwAreas,
    mapPoints,
    kelurahanBoundaries,
    services,
    taxTarget,
    taxMonths,
  ] = await Promise.all([
    getContentBlocks(),
    getHeroSlides(),
    getStaff(),
    getGalleryItems(),
    getNewsPosts(),
    getPopulationSnapshot(),
    getRwAreas(),
    getMapPoints(),
    getKelurahanBoundaries(),
    getServiceTypes(),
    getTaxYearTarget(TAX_YEAR),
    getTaxMonthlyRealizations(TAX_YEAR),
  ]);

  return (
    <AdminPanel
      userEmail={user.email ?? ""}
      initialData={{
        content,
        heroSlides,
        staff,
        gallery,
        news,
        population,
        rwAreas,
        mapPoints,
        kelurahanBoundaries,
        services,
        taxYear: TAX_YEAR,
        taxTarget,
        taxMonths,
      }}
    />
  );
}
