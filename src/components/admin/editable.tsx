"use client";

import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Loader2, Pencil, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type Tag = "span" | "div" | "h2" | "h3" | "p";

/** Click-to-edit text — renders as plain text; click swaps it for an input/textarea. */
export function EditableText({
  value,
  onChange,
  as = "span",
  className,
  placeholder,
  multiline,
}: {
  value: string;
  onChange: (v: string) => void;
  as?: Tag;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!editing) return;
    const el = multiline ? areaRef.current : inputRef.current;
    el?.focus();
    el?.select();
  }, [editing, multiline]);

  const commit = () => {
    onChange(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (editing) {
    return multiline ? (
      <textarea
        ref={areaRef}
        value={draft}
        rows={3}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Escape" && cancel()}
        className={cn(
          "w-full resize-y rounded-sm border border-ocean-500 bg-white px-2 py-1.5 text-inherit outline-none ring-2 ring-ocean-200",
          className,
        )}
      />
    ) : (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
        className={cn(
          "w-full rounded-sm border border-ocean-500 bg-white px-2 py-1 text-inherit outline-none ring-2 ring-ocean-200",
          className,
        )}
      />
    );
  }

  const Comp = as as "span";
  return (
    <Comp
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      title="Klik untuk edit"
      className={cn(
        "-mx-1 cursor-text rounded-sm px-1 break-words outline-dashed outline-1 outline-transparent transition-colors hover:bg-ocean-50/70 hover:outline-ocean-300",
        className,
      )}
    >
      {value || <span className="text-text-muted italic">{placeholder ?? "Klik untuk isi"}</span>}
      <Pencil className="ml-1.5 inline-block size-3 shrink-0 align-middle text-ocean-500 opacity-0 transition-opacity group-hover:opacity-100" />
    </Comp>
  );
}

/** Click-to-upload image — shows the photo (or a placeholder) with a hover overlay to replace it. */
export function EditableImage({
  photo,
  label,
  onUpload,
  className,
  imgClassName,
}: {
  photo: string | null;
  label: string;
  onUpload: (file: File) => Promise<void>;
  className?: string;
  imgClassName?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG, PNG, dll).");
      window.setTimeout(() => setError(null), 3000);
      return;
    }
    setError(null);
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={cn(
        "group/img relative overflow-hidden border border-border-default bg-surface-sunken",
        className,
      )}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt={label} className={cn("size-full object-cover", imgClassName)} />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-1.5 p-2 text-text-muted">
          <ImageIcon className="size-6" />
          <span className="text-center text-[11px] leading-tight">{label}</span>
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white transition-all duration-150",
          uploading
            ? "bg-ocean-900/55 opacity-100"
            : "bg-ocean-900/0 opacity-0 group-hover/img:bg-ocean-900/55 group-hover/img:opacity-100",
        )}
      >
        {uploading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Upload className="size-5" />
        )}
        <span className="text-xs font-medium">
          {uploading ? "Mengunggah…" : "Ganti foto"}
        </span>
      </button>
      {error && (
        <div className="absolute inset-x-0 bottom-0 bg-[#DC2626] px-2 py-1.5 text-center text-[11px] font-medium text-white">
          {error}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
