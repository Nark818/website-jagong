import { createClient } from "./server";

export async function getContentBlocks(): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("content_blocks").select("key, value");
  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    if (row.value !== null) map[row.key] = row.value;
  }
  return map;
}

export async function getStaff() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("staff")
    .select("id, name, role, nip, photo_url")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getHeroSlides() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hero_slides")
    .select("id, photo_url, alt")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getGalleryItems() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_items")
    .select("id, label, photo_url")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getNewsPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news_posts")
    .select("id, category, title, slug, excerpt, body, photo_url, published_at")
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getNewsPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news_posts")
    .select("id, category, title, slug, excerpt, body, photo_url, published_at")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getPopulationSnapshot() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("population_snapshot")
    .select(
      "total_penduduk, kepala_keluarga, laki_laki, perempuan, luas_wilayah_km2, period_label",
    )
    .eq("id", 1)
    .maybeSingle();
  return data;
}

export async function getRwAreas() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rw_areas")
    .select("id, name, rumah_count, masjid_count")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getMapBoundaries() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("map_boundaries")
    .select("id, direction, neighbor_name");
  return data ?? [];
}

export async function getServiceTypes() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service_types")
    .select("id, title, slug, requirements")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

/** Raw target row for a year (unlike getTaxSummary, not aggregated — for admin editing). */
export async function getTaxYearTarget(year: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tax_year_targets")
    .select("year, pokok_stts, pokok_rp, tunggakan_awal_stts, tunggakan_awal_rp")
    .eq("year", year)
    .maybeSingle();
  return data;
}

/** Raw monthly rows for a year (unlike getTaxSummary, not summed — for admin editing). */
export async function getTaxMonthlyRealizations(year: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tax_monthly_realizations")
    .select("id, year, month, pbb_stts, pbb_rp, tunggakan_stts, tunggakan_rp")
    .eq("year", year)
    .order("month", { ascending: true });
  return data ?? [];
}

/**
 * PBB realization for a year, derived from the monthly rows rather than
 * hand-tracked "lalu"/"ini" fields — S/D Bulan Lalu is every month before the
 * latest one, Bulan Ini is the latest month, S/D Bulan Ini is both summed.
 */
export async function getTaxSummary(year: number) {
  const supabase = await createClient();
  const [{ data: target }, { data: months }] = await Promise.all([
    supabase
      .from("tax_year_targets")
      .select("year, pokok_stts, pokok_rp, tunggakan_awal_stts, tunggakan_awal_rp")
      .eq("year", year)
      .maybeSingle(),
    supabase
      .from("tax_monthly_realizations")
      .select("month, pbb_stts, pbb_rp, tunggakan_stts, tunggakan_rp")
      .eq("year", year)
      .order("month", { ascending: true }),
  ]);

  if (!target || !months || months.length === 0) return null;

  const latest = months[months.length - 1];
  const prior = months.slice(0, -1);
  const sum = (rows: typeof months, key: "pbb_stts" | "pbb_rp" | "tunggakan_stts" | "tunggakan_rp") =>
    rows.reduce((acc, r) => acc + r[key], 0);

  return {
    pokok: { stts: target.pokok_stts, rp: target.pokok_rp },
    tunggakanAwal: { stts: target.tunggakan_awal_stts, rp: target.tunggakan_awal_rp },
    pbbLalu: { stts: sum(prior, "pbb_stts"), rp: sum(prior, "pbb_rp") },
    pbbIni: { stts: latest.pbb_stts, rp: latest.pbb_rp },
    pbbSdIni: { stts: sum(months, "pbb_stts"), rp: sum(months, "pbb_rp") },
    tdLalu: { stts: sum(prior, "tunggakan_stts"), rp: sum(prior, "tunggakan_rp") },
    tdIni: { stts: latest.tunggakan_stts, rp: latest.tunggakan_rp },
    tdSdIni: { stts: sum(months, "tunggakan_stts"), rp: sum(months, "tunggakan_rp") },
  };
}
