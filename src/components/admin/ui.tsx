import { useEffect, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateContentBlock } from "@/lib/supabase/mutations";
import type { ContentMap, Notify } from "./types";

/** Shared state + save-on-edit for a set of content_blocks keys. */
export function useContentMap(initial: ContentMap, notify: Notify) {
  const [content, setContent] = useState(initial);

  const saveField = async (key: string, value: string) => {
    setContent((c) => ({ ...c, [key]: value }));
    try {
      await updateContentBlock(key, value);
      notify(true);
    } catch {
      notify(false, "Gagal menyimpan perubahan.");
    }
  };

  return { content, saveField };
}

export function StatTile({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: LucideIcon;
  value: ReactNode;
  label: string;
  tone: "ocean" | "forest";
}) {
  const badge = tone === "ocean" ? "bg-ocean-50 text-ocean-700" : "bg-forest-50 text-forest-700";
  return (
    <div className="flex flex-col gap-2.5 rounded-lg border border-border-default bg-surface-card p-5">
      <span className={cn("flex size-9 items-center justify-center rounded-sm", badge)}>
        <Icon className="size-[18px]" />
      </span>
      <div className="font-mono text-2xl font-semibold text-text-primary">{value}</div>
      <div className="text-[13px] text-text-secondary">{label}</div>
    </div>
  );
}

export function QuickAction({
  icon: Icon,
  title,
  desc,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-start gap-3.5 rounded-lg border border-border-default bg-surface-card p-5 text-left transition-shadow duration-150 hover:shadow-[0_2px_10px_rgba(74,56,32,.08)]"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-ocean-50 text-ocean-700">
        <Icon className="size-[19px]" />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-text-primary">{title}</span>
        <span className="text-[13px] leading-snug text-text-secondary">{desc}</span>
      </span>
    </button>
  );
}

export function PreviewCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border-default bg-surface-card">
      <div className="border-b border-border-default bg-surface-sunken px-5 py-3 text-xs font-semibold tracking-wide text-text-muted uppercase">
        {title}
      </div>
      {children}
    </div>
  );
}

export function AddRowButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-fit items-center gap-1.5 rounded-sm border border-dashed border-border-strong bg-transparent px-3.5 py-2 text-[13px] font-medium text-text-secondary"
    >
      <Plus className="size-3.5" /> {label}
    </button>
  );
}

export function DeleteIconButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-7 shrink-0 items-center justify-center rounded-sm text-[#DC2626] hover:bg-[#FEF2F2]"
    >
      <Trash2 className="size-[15px]" />
    </button>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
        {label}
      </label>
      <input
        className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-200"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/** Centered dialog — fill in a full form before creating something, instead
 * of creating a blank placeholder row and editing it in place afterward. */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-lg border border-border-default bg-surface-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
          <h3 className="m-0 text-base font-semibold text-text-primary">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex size-7 items-center justify-center rounded-sm text-text-muted hover:bg-surface-sunken hover:text-text-primary"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

/** Page-number pagination, hidden entirely when everything fits on one page. */
export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 pt-1">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        aria-label="Halaman sebelumnya"
        className="flex size-8 items-center justify-center rounded-sm border border-border-default text-text-secondary disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>
      {Array.from({ length: pageCount }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          aria-current={i === page}
          className={cn(
            "flex size-8 items-center justify-center rounded-sm text-[13px] font-medium",
            i === page
              ? "bg-ocean-600 text-white"
              : "text-text-secondary hover:bg-surface-sunken",
          )}
        >
          {i + 1}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount - 1}
        aria-label="Halaman berikutnya"
        className="flex size-8 items-center justify-center rounded-sm border border-border-default text-text-secondary disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
