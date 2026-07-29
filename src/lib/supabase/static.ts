import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * A cookie-free client for contexts with no HTTP request — generateStaticParams,
 * generateMetadata at build time, etc. Public reads only, no session needed.
 */
export function createStaticClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
