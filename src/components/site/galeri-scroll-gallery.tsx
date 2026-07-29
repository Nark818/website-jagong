"use client";

import { motion } from "motion/react";
import { DbImage } from "./db-image";
import type { getGalleryItems } from "@/lib/supabase/queries";

type GalleryItem = Awaited<ReturnType<typeof getGalleryItems>>[number];

function GalleryTile({ item, index }: { item: GalleryItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 0.98 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, delay: Math.min((index % 8) * 0.05, 0.3), ease: "easeOut" }}
      className="relative mb-3 break-inside-avoid overflow-hidden rounded-xl border border-border-default bg-surface-card"
    >
      {/* fit="natural" so each tile's height follows the actual uploaded photo's
          aspect ratio instead of being force-cropped into a fixed box. */}
      <DbImage
        src={item.photo_url}
        alt={item.label}
        fit="natural"
        className={item.photo_url ? "w-full" : "aspect-[4/3] w-full"}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent p-3 pt-8">
        <p className="m-0 truncate text-[13px] font-medium text-white">{item.label}</p>
      </div>
    </motion.div>
  );
}

export function GaleriScrollGallery({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
      {items.map((item, i) => (
        <GalleryTile key={item.id} item={item} index={i} />
      ))}
    </div>
  );
}
