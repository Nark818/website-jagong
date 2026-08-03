import type {
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

export type ContentMap = Awaited<ReturnType<typeof getContentBlocks>>;
export type HeroSlideRow = Awaited<ReturnType<typeof getHeroSlides>>[number];
export type StaffRow = Awaited<ReturnType<typeof getStaff>>[number];
export type GalleryRow = Awaited<ReturnType<typeof getGalleryItems>>[number];
export type NewsRow = Awaited<ReturnType<typeof getNewsPosts>>[number];
export type PopulationRow = Awaited<ReturnType<typeof getPopulationSnapshot>>;
export type RwRow = Awaited<ReturnType<typeof getRwAreas>>[number];
export type MapPointRow = Awaited<ReturnType<typeof getMapPoints>>[number];
export type KelurahanBoundaryRow = Awaited<ReturnType<typeof getKelurahanBoundaries>>[number];
export type ServiceRow = Awaited<ReturnType<typeof getServiceTypes>>[number];
export type TaxTargetRow = Awaited<ReturnType<typeof getTaxYearTarget>>;
export type TaxMonthRow = Awaited<ReturnType<typeof getTaxMonthlyRealizations>>[number];

export type AdminInitialData = {
  content: ContentMap;
  heroSlides: HeroSlideRow[];
  staff: StaffRow[];
  gallery: GalleryRow[];
  news: NewsRow[];
  population: PopulationRow;
  rwAreas: RwRow[];
  mapPoints: MapPointRow[];
  kelurahanBoundaries: KelurahanBoundaryRow[];
  services: ServiceRow[];
  taxYear: number;
  taxTarget: TaxTargetRow;
  taxMonths: TaxMonthRow[];
};

export type Notify = (ok: boolean, message?: string, variant?: "add" | "delete") => void;
