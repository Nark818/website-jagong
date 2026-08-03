"use client";

import dynamic from "next/dynamic";
import { ImagePlaceholder } from "./image-placeholder";
import type { getKelurahanBoundaries, getMapPoints } from "@/lib/supabase/queries";

const PetaMap = dynamic(() => import("./peta-map").then((mod) => mod.PetaMap), {
  ssr: false,
  loading: () => (
    <ImagePlaceholder
      label="Memuat peta…"
      className="h-[520px] w-full rounded-xl sm:h-[600px]"
    />
  ),
});

export function PetaMapLoader({
  points,
  boundaries,
}: {
  points: Awaited<ReturnType<typeof getMapPoints>>;
  boundaries: Awaited<ReturnType<typeof getKelurahanBoundaries>>;
}) {
  return <PetaMap points={points} boundaries={boundaries} />;
}
