import { ImagePlaceholder } from "./image-placeholder";
import { cn } from "@/lib/utils";

/**
 * Renders a photo from the database, falling back to the placeholder box when unset.
 * `fit="cover"` (default) crops to fill a fixed-size box. `fit="natural"` renders at
 * the image's own aspect ratio instead, for masonry-style layouts.
 */
export function DbImage({
  src,
  alt,
  className,
  fit = "cover",
}: {
  src: string | null;
  alt: string;
  className?: string;
  fit?: "cover" | "natural";
}) {
  if (!src) {
    return <ImagePlaceholder label={alt} className={className} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- photo_url is an arbitrary admin-supplied URL, not a static local asset
    <img
      src={src}
      alt={alt}
      className={cn(fit === "cover" ? "object-cover" : "h-auto w-full", className)}
    />
  );
}
