import { useRef, useState } from "react";
import { Image as ImageIcon, MapPin, Upload, X } from "lucide-react";
import { EditableText, EditableImage } from "../editable";
import { AddRowButton, DeleteIconButton, Modal, Pagination, PreviewCard } from "../ui";
import {
  createMapPoint,
  deleteMapPoint,
  updateKelurahanBoundaryLabel,
  updateMapPoint,
  uploadMedia,
} from "@/lib/supabase/mutations";
import { MAP_CATEGORIES } from "@/lib/map-categories";
import type { KelurahanBoundaryRow, MapPointRow, Notify } from "../types";

const PAGE_SIZE = 5;
const DEFAULT_LAT = "-4.8376";
const DEFAULT_LNG = "119.5341";

const inputClass =
  "w-full rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-200";

function LatLngCell({
  value,
  onCommit,
}: {
  value: number;
  onCommit: (n: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  return (
    <input
      className="w-full min-w-0 rounded-sm border border-border-default bg-surface-card px-3 py-2 font-mono text-xs text-text-primary outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-200"
      value={draft}
      inputMode="decimal"
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const n = Number(draft.replace(/[^\d.-]/g, ""));
        onCommit(Number.isFinite(n) ? n : 0);
      }}
    />
  );
}

function emptyForm() {
  return {
    nama: "",
    category: MAP_CATEGORIES[0].value as string,
    deskripsi: "",
    map_url: "",
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
  };
}

export function PetaSection({
  mapPoints: initialPoints,
  kelurahanBoundaries: initialBoundaries,
  notify,
}: {
  mapPoints: MapPointRow[];
  kelurahanBoundaries: KelurahanBoundaryRow[];
  notify: Notify;
}) {
  const [points, setPoints] = useState(initialPoints);
  const [boundaries, setBoundaries] = useState(initialBoundaries);
  const [page, setPage] = useState(0);

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const pageCount = Math.max(1, Math.ceil(points.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pagedPoints = points.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  const savePoint = async (id: string, patch: Partial<MapPointRow>) => {
    setPoints((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    try {
      await updateMapPoint(id, patch);
      notify(true);
    } catch {
      notify(false, "Gagal menyimpan perubahan.");
    }
  };

  const removePoint = async (id: string) => {
    setPoints((rows) => rows.filter((r) => r.id !== id));
    try {
      await deleteMapPoint(id);
      notify(true, "Titik lokasi dihapus.", "delete");
    } catch {
      notify(false, "Gagal menghapus titik lokasi.");
    }
  };

  const saveBoundaryLabel = async (id: string, kel_desa: string) => {
    setBoundaries((rows) => rows.map((r) => (r.id === id ? { ...r, kel_desa } : r)));
    try {
      await updateKelurahanBoundaryLabel(id, kel_desa);
      notify(true);
    } catch {
      notify(false, "Gagal menyimpan perubahan.");
    }
  };

  const closeAddModal = () => {
    setAddOpen(false);
    setForm(emptyForm());
    clearPhoto();
  };

  const submitAdd = async () => {
    const lat = Number(form.lat.replace(/[^\d.-]/g, ""));
    const lng = Number(form.lng.replace(/[^\d.-]/g, ""));
    if (!form.nama.trim() || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      notify(false, "Nama, latitude, dan longitude wajib diisi dengan benar.");
      return;
    }

    setSubmitting(true);
    try {
      const photo_url = photoFile ? await uploadMedia(photoFile, "map") : null;
      const row = await createMapPoint({
        nama: form.nama.trim(),
        category: form.category,
        deskripsi: form.deskripsi.trim() || null,
        map_url: form.map_url.trim() || null,
        photo_url,
        lat,
        lng,
        sort_order: points.length,
      });
      setPoints((rows) => [...rows, row]);
      notify(true, "Titik lokasi baru ditambahkan.", "add");
      setPage(Math.ceil((points.length + 1) / PAGE_SIZE) - 1);
      closeAddModal();
    } catch {
      notify(false, "Gagal menambah titik lokasi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PreviewCard title="Titik Lokasi di Peta">
        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <AddRowButton onClick={() => setAddOpen(true)} label="Tambah titik lokasi" />
          {pagedPoints.map((point) => (
            <div
              key={point.id}
              className="relative flex flex-col gap-3 rounded-lg border border-border-default bg-surface-card p-5 sm:flex-row"
            >
              <EditableImage
                photo={point.photo_url}
                label="Foto lokasi"
                onUpload={async (file) => {
                  try {
                    const url = await uploadMedia(file, "map");
                    await savePoint(point.id, { photo_url: url });
                  } catch {
                    notify(false, "Gagal mengunggah foto.");
                  }
                }}
                className="h-[140px] w-full shrink-0 rounded-md sm:h-auto sm:w-[180px]"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <div className="flex items-center justify-between gap-3">
                  <EditableText
                    as="h3"
                    value={point.nama}
                    onChange={(v) => savePoint(point.id, { nama: v })}
                    className="text-[15px] font-semibold text-text-primary"
                  />
                  <DeleteIconButton onClick={() => removePoint(point.id)} label="Hapus titik" />
                </div>
                <select
                  value={point.category}
                  onChange={(e) => savePoint(point.id, { category: e.target.value })}
                  className="w-fit rounded-sm border border-border-default bg-surface-card px-2.5 py-1.5 text-xs font-medium text-text-primary outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-200"
                >
                  {MAP_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <EditableText
                  as="p"
                  multiline
                  value={point.deskripsi ?? ""}
                  onChange={(v) => savePoint(point.id, { deskripsi: v })}
                  placeholder="Deskripsi singkat (opsional)"
                  className="text-[13px] text-text-secondary"
                />
                <EditableText
                  as="div"
                  value={point.map_url ?? ""}
                  onChange={(v) => savePoint(point.id, { map_url: v })}
                  placeholder="Tautan Google Maps (opsional)"
                  className="text-xs text-ocean-700"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold tracking-wide text-text-muted uppercase">
                      Latitude
                    </label>
                    <LatLngCell
                      value={point.lat}
                      onCommit={(n) => savePoint(point.id, { lat: n })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold tracking-wide text-text-muted uppercase">
                      Longitude
                    </label>
                    <LatLngCell
                      value={point.lng}
                      onCommit={(n) => savePoint(point.id, { lng: n })}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onChange={setPage}
          />
        </div>
      </PreviewCard>

      <PreviewCard title="Label Kelurahan Tetangga">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-6 sm:p-8">
          {boundaries.map((b) => (
            <div key={b.id} className="rounded-md border border-border-default bg-surface-card p-5">
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="size-[15px] text-ocean-600" />
                <span className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  {b.is_self ? "Kelurahan ini" : "Tetangga"}
                </span>
              </div>
              <EditableText
                as="div"
                value={b.kel_desa}
                onChange={(v) => saveBoundaryLabel(b.id, v)}
                className="text-sm font-medium text-text-primary"
              />
            </div>
          ))}
        </div>
        <p className="m-0 px-6 pb-6 text-xs text-text-muted sm:px-8">
          Bentuk batas wilayah diambil dari data QGIS dan tidak dapat digambar ulang di sini —
          hanya nama yang bisa diedit.
        </p>
      </PreviewCard>

      <Modal open={addOpen} onClose={closeAddModal} title="Tambah Titik Lokasi">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              Nama
            </label>
            <input
              autoFocus
              className={inputClass}
              value={form.nama}
              onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
              placeholder="mis. Kantor Lurah"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              Kategori
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className={inputClass}
            >
              {MAP_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              Deskripsi (opsional)
            </label>
            <textarea
              rows={3}
              className={inputClass}
              value={form.deskripsi}
              onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))}
              placeholder="Deskripsi singkat"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              Tautan Google Maps (opsional)
            </label>
            <input
              className={inputClass}
              value={form.map_url}
              onChange={(e) => setForm((f) => ({ ...f, map_url: e.target.value }))}
              placeholder="https://maps.app.goo.gl/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                Latitude
              </label>
              <input
                className={inputClass}
                value={form.lat}
                inputMode="decimal"
                onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                Longitude
              </label>
              <input
                className={inputClass}
                value={form.lng}
                inputMode="decimal"
                onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              Foto (opsional)
            </label>
            <div className="flex items-center gap-3">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not a static asset
                <img
                  src={photoPreview}
                  alt="Pratinjau"
                  className="size-16 shrink-0 rounded-md border border-border-default object-cover"
                />
              ) : (
                <div className="flex size-16 shrink-0 items-center justify-center rounded-md border border-dashed border-border-strong text-text-muted">
                  <ImageIcon className="size-5" />
                </div>
              )}
              <div className="flex flex-col items-start gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-sunken"
                >
                  <Upload className="size-3.5" />
                  {photoFile ? "Ganti foto" : "Pilih foto"}
                </button>
                {photoFile && (
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#DC2626]"
                  >
                    <X className="size-3" /> Hapus foto
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setPhotoFile(file);
                  setPhotoPreview((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return URL.createObjectURL(file);
                  });
                }}
              />
            </div>
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
              {submitting ? "Menyimpan…" : "Tambah Titik"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
