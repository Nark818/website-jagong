"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DbImage } from "./db-image";
import type { getHeroSlides } from "@/lib/supabase/queries";

type Slide = Awaited<ReturnType<typeof getHeroSlides>>[number];

const INTERVAL_MS = 5000;

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <DbImage src={null} alt="Kelurahan Jagong" className="size-full" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {slides.map((slide, i) => (
        <DbImage
          key={slide.id}
          src={slide.photo_url}
          alt={slide.alt}
          className={cn(
            "absolute inset-0 size-full transition-opacity duration-1000 ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Foto ${i + 1} dari ${slides.length}`}
              aria-current={i === index}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index ? "w-6 bg-white" : "w-2 bg-white/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
