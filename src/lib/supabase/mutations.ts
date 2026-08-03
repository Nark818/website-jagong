import { createClient } from "./browser";
import { slugify } from "@/lib/slug";
import type { TablesInsert, TablesUpdate } from "./database.types";

// ---- content_blocks -------------------------------------------------------

export async function updateContentBlock(key: string, value: string) {
  const supabase = createClient();
  const { error } = await supabase.from("content_blocks").upsert({ key, value });
  if (error) throw error;
}

// ---- media storage ----------------------------------------------------------

export async function uploadMedia(file: File, folder: string) {
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) throw error;
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

// ---- hero_slides --------------------------------------------------------------

export async function createHeroSlide(input: TablesInsert<"hero_slides">) {
  const supabase = createClient();
  const { data, error } = await supabase.from("hero_slides").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateHeroSlide(id: string, patch: TablesUpdate<"hero_slides">) {
  const supabase = createClient();
  const { error } = await supabase.from("hero_slides").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteHeroSlide(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) throw error;
}

// ---- staff ------------------------------------------------------------------

export async function createStaff(input: TablesInsert<"staff">) {
  const supabase = createClient();
  const { data, error } = await supabase.from("staff").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateStaff(id: string, patch: TablesUpdate<"staff">) {
  const supabase = createClient();
  const { error } = await supabase.from("staff").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteStaff(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("staff").delete().eq("id", id);
  if (error) throw error;
}

// ---- gallery_items ------------------------------------------------------------

export async function createGalleryItem(input: TablesInsert<"gallery_items">) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateGalleryItem(id: string, patch: TablesUpdate<"gallery_items">) {
  const supabase = createClient();
  const { error } = await supabase.from("gallery_items").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteGalleryItem(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) throw error;
}

// ---- news_posts ---------------------------------------------------------------

async function uniqueNewsSlug(title: string) {
  const supabase = createClient();
  const base = slugify(title) || "berita";
  let slug = base;
  let n = 2;
  for (;;) {
    const { data } = await supabase
      .from("news_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

export async function createNewsPost(
  input: Omit<TablesInsert<"news_posts">, "slug">,
) {
  const supabase = createClient();
  const slug = await uniqueNewsSlug(input.title);
  const { data, error } = await supabase
    .from("news_posts")
    .insert({ ...input, slug })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateNewsPost(id: string, patch: TablesUpdate<"news_posts">) {
  const supabase = createClient();
  const { error } = await supabase.from("news_posts").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteNewsPost(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("news_posts").delete().eq("id", id);
  if (error) throw error;
}

// ---- population_snapshot -------------------------------------------------------

export async function updatePopulationSnapshot(patch: TablesUpdate<"population_snapshot">) {
  const supabase = createClient();
  const { error } = await supabase.from("population_snapshot").update(patch).eq("id", 1);
  if (error) throw error;
}

// ---- rw_areas -------------------------------------------------------------------

export async function createRwArea(input: TablesInsert<"rw_areas">) {
  const supabase = createClient();
  const { data, error } = await supabase.from("rw_areas").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateRwArea(id: string, patch: TablesUpdate<"rw_areas">) {
  const supabase = createClient();
  const { error } = await supabase.from("rw_areas").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteRwArea(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("rw_areas").delete().eq("id", id);
  if (error) throw error;
}

// ---- tax_year_targets / tax_monthly_realizations --------------------------------

export async function upsertTaxYearTarget(input: TablesInsert<"tax_year_targets">) {
  const supabase = createClient();
  const { error } = await supabase.from("tax_year_targets").upsert(input);
  if (error) throw error;
}

export async function createTaxMonth(input: TablesInsert<"tax_monthly_realizations">) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tax_monthly_realizations")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTaxMonth(
  id: string,
  patch: TablesUpdate<"tax_monthly_realizations">,
) {
  const supabase = createClient();
  const { error } = await supabase.from("tax_monthly_realizations").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteTaxMonth(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("tax_monthly_realizations").delete().eq("id", id);
  if (error) throw error;
}

// ---- service_types ------------------------------------------------------------

async function uniqueServiceSlug(title: string) {
  const supabase = createClient();
  const base = slugify(title) || "layanan";
  let slug = base;
  let n = 2;
  for (;;) {
    const { data } = await supabase
      .from("service_types")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

export async function createServiceType(
  input: Omit<TablesInsert<"service_types">, "slug">,
) {
  const supabase = createClient();
  const slug = await uniqueServiceSlug(input.title);
  const { data, error } = await supabase
    .from("service_types")
    .insert({ ...input, slug })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateServiceType(id: string, patch: TablesUpdate<"service_types">) {
  const supabase = createClient();
  const { error } = await supabase.from("service_types").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteServiceType(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("service_types").delete().eq("id", id);
  if (error) throw error;
}

// ---- map_points -------------------------------------------------------------

export async function createMapPoint(input: TablesInsert<"map_points">) {
  const supabase = createClient();
  const { data, error } = await supabase.from("map_points").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateMapPoint(id: string, patch: TablesUpdate<"map_points">) {
  const supabase = createClient();
  const { error } = await supabase.from("map_points").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteMapPoint(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("map_points").delete().eq("id", id);
  if (error) throw error;
}

// ---- kelurahan_boundaries -----------------------------------------------------

export async function updateKelurahanBoundaryLabel(id: string, kel_desa: string) {
  const supabase = createClient();
  const { error } = await supabase.from("kelurahan_boundaries").update({ kel_desa }).eq("id", id);
  if (error) throw error;
}
