import { useState } from "react";
import { EditableText, EditableImage } from "../editable";
import { DeleteIconButton, PreviewCard, useContentMap } from "../ui";
import { createStaff, deleteStaff, updateStaff, uploadMedia } from "@/lib/supabase/mutations";
import type { ContentMap, Notify, StaffRow } from "../types";

export function ProfilSection({
  content: initialContent,
  staff: initialStaff,
  notify,
}: {
  content: ContentMap;
  staff: StaffRow[];
  notify: Notify;
}) {
  const { content, saveField } = useContentMap(initialContent, notify);
  const [staff, setStaff] = useState(initialStaff);

  const patchStaff = (id: string, patch: Partial<StaffRow>) =>
    setStaff((s) => s.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const saveStaff = async (id: string, patch: Partial<StaffRow>) => {
    patchStaff(id, patch);
    try {
      await updateStaff(id, patch);
      notify(true);
    } catch {
      notify(false, "Gagal menyimpan perubahan staf.");
    }
  };

  const addStaff = async () => {
    try {
      const row = await createStaff({
        name: "Nama staf baru",
        role: "Jabatan",
        nip: "NIP. -",
        sort_order: staff.length,
      });
      setStaff((s) => [...s, row]);
      notify(true);
    } catch {
      notify(false, "Gagal menambah staf.");
    }
  };

  const removeStaff = async (id: string) => {
    setStaff((s) => s.filter((p) => p.id !== id));
    try {
      await deleteStaff(id);
      notify(true);
    } catch {
      notify(false, "Gagal menghapus staf.");
    }
  };

  const uploadStaffPhoto = async (id: string, file: File) => {
    try {
      const url = await uploadMedia(file, "staff");
      await saveStaff(id, { photo_url: url });
    } catch {
      notify(false, "Gagal mengunggah foto.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PreviewCard title="Pratinjau — Sejarah Kelurahan">
        <div className="grid grid-cols-1 gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <EditableText
            as="p"
            multiline
            value={content["sejarah.body_1"] ?? ""}
            onChange={(v) => saveField("sejarah.body_1", v)}
            placeholder="Paragraf sejarah kelurahan"
            className="text-[15px] leading-relaxed text-text-secondary"
          />
          <EditableImage
            photo={content["sejarah.photo_url"] ?? null}
            label="Foto arsip kelurahan"
            onUpload={async (file) => {
              const url = await uploadMedia(file, "content");
              await saveField("sejarah.photo_url", url);
            }}
            className="h-[220px] w-full rounded-lg"
          />
        </div>
      </PreviewCard>

      <PreviewCard title="Pratinjau — Struktur Organisasi">
        <div className="p-6 sm:p-8">
          <EditableImage
            photo={content["profil.struktur_image_url"] ?? null}
            label="Bagan struktur organisasi"
            onUpload={async (file) => {
              const url = await uploadMedia(file, "content");
              await saveField("profil.struktur_image_url", url);
            }}
            className="h-[260px] w-full rounded-lg"
          />
        </div>
      </PreviewCard>

      <PreviewCard title="Pratinjau — Perangkat Kelurahan">
        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 sm:p-8 lg:grid-cols-5">
          {staff.map((person) => (
            <div
              key={person.id}
              className="relative flex flex-col overflow-hidden rounded-lg border border-border-default"
            >
              <EditableImage
                photo={person.photo_url}
                label="Foto staf"
                onUpload={(file) => uploadStaffPhoto(person.id, file)}
                className="h-[130px] w-full"
                imgClassName="object-[center_25%]"
              />
              <div className="flex flex-col gap-1 p-3 text-center">
                <EditableText
                  as="div"
                  value={person.name}
                  onChange={(v) => saveStaff(person.id, { name: v })}
                  className="text-[13px] font-semibold text-text-primary"
                />
                <EditableText
                  as="div"
                  value={person.role}
                  onChange={(v) => saveStaff(person.id, { role: v })}
                  className="text-xs font-medium text-ocean-700"
                />
                <EditableText
                  as="div"
                  value={person.nip ?? ""}
                  onChange={(v) => saveStaff(person.id, { nip: v })}
                  className="font-mono text-[10px] text-text-muted"
                />
              </div>
              <div className="absolute top-1.5 right-1.5">
                <DeleteIconButton onClick={() => removeStaff(person.id)} label="Hapus staf" />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addStaff}
            className="flex min-h-[190px] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong text-text-secondary"
          >
            <span className="text-xs font-medium">+ Tambah staf</span>
          </button>
        </div>
      </PreviewCard>
    </div>
  );
}
