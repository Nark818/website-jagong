import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImagePlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 bg-surface-sunken border border-border-default text-text-muted",
        className,
      )}
    >
      <ImageIcon className="size-6" strokeWidth={1.5} />
      <span className="px-3 text-center text-xs">{label}</span>
    </div>
  );
}
