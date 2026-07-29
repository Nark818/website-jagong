import { useState } from "react";
import { EditableText } from "../editable";
import { AddRowButton, DeleteIconButton } from "../ui";
import { createServiceType, deleteServiceType, updateServiceType } from "@/lib/supabase/mutations";
import type { Notify, ServiceRow } from "../types";

export function LayananSection({
  services: initial,
  notify,
}: {
  services: ServiceRow[];
  notify: Notify;
}) {
  const [services, setServices] = useState(initial);

  const save = async (id: string, patch: Partial<ServiceRow>) => {
    setServices((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    try {
      await updateServiceType(id, patch);
      notify(true);
    } catch {
      notify(false, "Gagal menyimpan perubahan.");
    }
  };

  const addService = async () => {
    try {
      const row = await createServiceType({ title: "Layanan baru", sort_order: services.length });
      setServices((rows) => [...rows, row]);
      notify(true, "Layanan baru ditambahkan.", "add");
    } catch {
      notify(false, "Gagal menambah layanan.");
    }
  };

  const removeService = async (id: string) => {
    setServices((rows) => rows.filter((r) => r.id !== id));
    try {
      await deleteServiceType(id);
      notify(true, "Layanan dihapus.", "delete");
    } catch {
      notify(false, "Gagal menghapus layanan.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <AddRowButton onClick={addService} label="Tambah layanan" />
      {services.map((svc) => (
        <div
          key={svc.id}
          className="flex flex-col gap-3 rounded-lg border border-border-default bg-surface-card p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <EditableText
              as="h3"
              value={svc.title}
              onChange={(v) => save(svc.id, { title: v })}
              className="text-base font-semibold text-text-primary"
            />
            <DeleteIconButton onClick={() => removeService(svc.id)} label="Hapus layanan" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
              Syarat (satu per baris)
            </label>
            <textarea
              defaultValue={svc.requirements.join("\n")}
              rows={4}
              onBlur={(e) =>
                save(svc.id, {
                  requirements: e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                })
              }
              className="w-full resize-y rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-200"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
