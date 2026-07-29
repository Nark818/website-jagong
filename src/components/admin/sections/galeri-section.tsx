import { useState } from "react";
import { EditableText, EditableImage } from "../editable";
import { DeleteIconButton, PreviewCard } from "../ui";
import {
  createGalleryItem,
  deleteGalleryItem,
  updateGalleryItem,
  uploadMedia,
} from "@/lib/supabase/mutations";
import type { GalleryRow, Notify } from "../types";

export function GaleriSection({
  gallery: initial,
  notify,
}: {
  gallery: GalleryRow[];
  notify: Notify;
}) {
  const [gallery, setGallery] = useState(initial);

  const save = async (id: string, patch: Partial<GalleryRow>) => {
    setGallery((g) => g.map((it) => (it.id === id ? { ...it, ...patch } : it)));
    try {
      await updateGalleryItem(id, patch);
      notify(true);
    } catch {
      notify(false, "Gagal menyimpan perubahan.");
    }
  };

  const addItem = async () => {
    try {
      const row = await createGalleryItem({ label: "Foto baru", sort_order: gallery.length });
      setGallery((g) => [...g, row]);
      notify(true, "Foto baru ditambahkan.", "add");
    } catch {
      notify(false, "Gagal menambah foto.");
    }
  };

  const removeItem = async (id: string) => {
    setGallery((g) => g.filter((it) => it.id !== id));
    try {
      await deleteGalleryItem(id);
      notify(true, "Foto dihapus.", "delete");
    } catch {
      notify(false, "Gagal menghapus foto.");
    }
  };

  return (
    <PreviewCard title="Pratinjau — Galeri Kelurahan">
      <div className="grid grid-cols-2 gap-5 p-6 sm:grid-cols-4 sm:p-8">
        {gallery.map((item) => (
          <div key={item.id} className="relative flex flex-col gap-2">
            <EditableImage
              photo={item.photo_url}
              label={item.label}
              onUpload={async (file) => {
                try {
                  const url = await uploadMedia(file, "gallery");
                  await save(item.id, { photo_url: url });
                } catch {
                  notify(false, "Gagal mengunggah foto.");
                }
              }}
              className="h-[130px] w-full rounded-lg"
            />
            <EditableText
              as="div"
              value={item.label}
              onChange={(v) => save(item.id, { label: v })}
              className="text-center text-xs text-text-secondary"
            />
            <div className="absolute top-1.5 right-1.5">
              <DeleteIconButton onClick={() => removeItem(item.id)} label="Hapus foto" />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex h-[130px] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong text-text-secondary"
        >
          <span className="text-xs font-medium">+ Tambah foto</span>
        </button>
      </div>
    </PreviewCard>
  );
}
