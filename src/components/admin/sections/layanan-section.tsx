import { useState } from "react";
import { EditableText } from "../editable";
import { AddRowButton, DeleteIconButton, Modal, Pagination } from "../ui";
import { createServiceType, deleteServiceType, updateServiceType } from "@/lib/supabase/mutations";
import type { Notify, ServiceRow } from "../types";

const PAGE_SIZE = 5;

const inputClass =
  "w-full rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-200";

function emptyForm() {
  return { title: "", requirements: "" };
}

export function LayananSection({
  services: initial,
  notify,
}: {
  services: ServiceRow[];
  notify: Notify;
}) {
  const [services, setServices] = useState(initial);
  const [page, setPage] = useState(0);

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const pageCount = Math.max(1, Math.ceil(services.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pagedServices = services.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE,
  );

  const save = async (id: string, patch: Partial<ServiceRow>) => {
    setServices((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    try {
      await updateServiceType(id, patch);
      notify(true);
    } catch {
      notify(false, "Gagal menyimpan perubahan.");
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

  const closeAddModal = () => {
    setAddOpen(false);
    setForm(emptyForm());
  };

  const submitAdd = async () => {
    if (!form.title.trim()) {
      notify(false, "Nama layanan wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const requirements = form.requirements
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const row = await createServiceType({
        title: form.title.trim(),
        requirements,
        sort_order: services.length,
      });
      setServices((rows) => [...rows, row]);
      notify(true, "Layanan baru ditambahkan.", "add");
      setPage(Math.ceil((services.length + 1) / PAGE_SIZE) - 1);
      closeAddModal();
    } catch {
      notify(false, "Gagal menambah layanan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <AddRowButton onClick={() => setAddOpen(true)} label="Tambah layanan" />
      {pagedServices.map((svc) => (
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
      <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />

      <Modal open={addOpen} onClose={closeAddModal} title="Tambah Layanan">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              Nama Layanan
            </label>
            <input
              autoFocus
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="mis. Surat Keterangan Domisili"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              Syarat (satu per baris, opsional)
            </label>
            <textarea
              rows={4}
              className={inputClass}
              value={form.requirements}
              onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
              placeholder={"Fotokopi KTP\nFotokopi KK"}
            />
          </div>

          <div className="mt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={closeAddModal}
              className="rounded-sm border border-border-default px-4 py-2 text-sm font-medium text-text-secondary"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={submitAdd}
              disabled={submitting}
              className="rounded-sm bg-ocean-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {submitting ? "Menyimpan…" : "Tambah Layanan"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
