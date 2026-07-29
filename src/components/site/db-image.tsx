import { ImagePlaceholder } from "./image-placeholder";
import { cn } from "@/lib/utils";

/** Renders a photo from the database, falling back to the placeholder box when unset. */
export function DbImage({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return <ImagePlaceholder label={alt} className={className} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- photo_url is an arbitrary admin-supplied URL, not a static local asset
    <img src={src} alt={alt} className={cn("object-cover", className)} />
  );
}
