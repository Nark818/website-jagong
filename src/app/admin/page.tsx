import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminPanel from "@/components/admin/admin-panel";
import {
  getContentBlocks,
  getGalleryItems,
  getMapBoundaries,
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
    staff,
    gallery,
    news,
    population,
    rwAreas,
    boundaries,
    services,
    taxTarget,
    taxMonths,
  ] = await Promise.all([
    getContentBlocks(),
    getStaff(),
    getGalleryItems(),
    getNewsPosts(),
    getPopulationSnapshot(),
    getRwAreas(),
    getMapBoundaries(),
    getServiceTypes(),
    getTaxYearTarget(TAX_YEAR),
    getTaxMonthlyRealizations(TAX_YEAR),
  ]);

  return (
    <AdminPanel
      userEmail={user.email ?? ""}
      initialData={{
        content,
        staff,
        gallery,
        news,
        population,
        rwAreas,
        boundaries,
        services,
        taxYear: TAX_YEAR,
        taxTarget,
        taxMonths,
      }}
    />
  );
}
