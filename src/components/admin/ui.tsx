import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Plus, Trash2 } from "lucide-react";
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
        className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
