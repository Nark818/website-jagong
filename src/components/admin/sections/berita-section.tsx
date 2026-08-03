import { useRef, useState } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { EditableText, EditableImage } from "../editable";
import { AddRowButton, DeleteIconButton, Modal, Pagination } from "../ui";
import { createNewsPost, deleteNewsPost, updateNewsPost, uploadMedia } from "@/lib/supabase/mutations";
import { cn } from "@/lib/utils";
import type { NewsRow, Notify } from "../types";

const PAGE_SIZE = 5;

const inputClass =
  "w-full rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-200";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm() {
  return {
    category: "berita" as NewsRow["category"],
    title: "",
    excerpt: "",
    body: "",
    published_at: todayIso(),
  };
}

export function BeritaSection({ news: initial, notify }: { news: NewsRow[]; notify: Notify }) {
  const [news, setNews] = useState(initial);
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

  const sortedNews = [...news].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
  );
  const pageCount = Math.max(1, Math.ceil(sortedNews.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pagedNews = sortedNews.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  const save = async (id: string, patch: Partial<NewsRow>) => {
    setNews((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    try {
      await updateNewsPost(id, patch);
      notify(true);
    } catch {
      notify(false, "Gagal menyimpan perubahan.");
    }
  };

  const removePost = async (id: string) => {
    setNews((items) => items.filter((item) => item.id !== id));
    try {
      await deleteNewsPost(id);
      notify(true, "Berita dihapus.", "delete");
    } catch {
      notify(false, "Gagal menghapus berita.");
    }
  };

  const closeAddModal = () => {
    setAddOpen(false);
    setForm(emptyForm());
    clearPhoto();
  };

  const submitAdd = async () => {
    if (!form.title.trim()) {
      notify(false, "Judul wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const photo_url = photoFile ? await uploadMedia(photoFile, "news") : null;
      const row = await createNewsPost({
        category: form.category,
        title: form.title.trim(),
        excerpt: form.excerpt.trim() || null,
        body: form.body.trim() || null,
        photo_url,
        published_at: new Date(form.published_at || todayIso()).toISOString(),
      });
      setNews((items) => [row, ...items]);
      const index = [row, ...news].sort(
        (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
      ).findIndex((item) => item.id === row.id);
      notify(true, "Berita baru ditambahkan.", "add");
      setPage(Math.max(0, Math.floor(index / PAGE_SIZE)));
      closeAddModal();
    } catch {
      notify(false, "Gagal menambah berita.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <AddRowButton onClick={() => setAddOpen(true)} label="Tambah Berita/Pengumuman" />
      {pagedNews.map((post) => (
        <div
          key={post.id}
          className="relative overflow-hidden rounded-lg border border-border-default bg-surface-card sm:flex"
        >
          <EditableImage
            photo={post.photo_url}
            label="Foto berita"
            onUpload={async (file) => {
              try {
                const url = await uploadMedia(file, "news");
                await save(post.id, { photo_url: url });
              } catch {
                notify(false, "Gagal mengunggah foto.");
              }
            }}
            className="h-[160px] w-full shrink-0 sm:h-auto sm:w-[220px]"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-5">
            <div className="flex items-center justify-between gap-3">
              <select
                value={post.category}
                onChange={(e) => save(post.id, { category: e.target.value as NewsRow["category"] })}
                className={cn(
                  "w-fit rounded-full border-0 px-2.5 py-[3px] text-[11px] font-semibold uppercase outline-none",
                  post.category === "pengumuman"
                    ? "bg-forest-50 text-forest-700"
                    : "bg-ocean-50 text-ocean-700",
                )}
              >
                <option value="berita">Berita</option>
                <option value="pengumuman">Pengumuman</option>
              </select>
              <DeleteIconButton onClick={() => removePost(post.id)} label="Hapus pos" />
            </div>
            <EditableText
              as="h3"
              value={post.title}
              onChange={(v) => save(post.id, { title: v })}
              className="text-[17px] font-semibold text-text-primary"
            />
            <EditableText
              as="p"
              multiline
              value={post.excerpt ?? ""}
              onChange={(v) => save(post.id, { excerpt: v })}
              placeholder="Ringkasan singkat"
              className="text-sm text-text-secondary"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">Tanggal:</span>
              <input
                type="date"
                value={post.published_at.slice(0, 10)}
                onChange={(e) => {
                  if (!e.target.value) return;
                  save(post.id, { published_at: new Date(e.target.value).toISOString() });
                }}
                className="rounded-sm border border-border-default bg-surface-card px-2 py-1 text-xs font-medium text-text-primary outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-200"
              />
            </div>
            <div className="mt-1 border-t border-border-default pt-2.5">
              <div className="mb-1 text-[11px] font-semibold tracking-wide text-text-muted uppercase">
                Isi lengkap
              </div>
              <EditableText
                as="p"
                multiline
                value={post.body ?? ""}
                onChange={(v) => save(post.id, { body: v })}
                placeholder="Isi lengkap berita"
                className="text-[13px] leading-relaxed text-text-secondary"
              />
            </div>
          </div>
        </div>
      ))}
      <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />

      <Modal open={addOpen} onClose={closeAddModal} title="Tambah Berita/Pengumuman">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              Kategori
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value as NewsRow["category"] }))
              }
              className={inputClass}
            >
              <option value="berita">Berita</option>
              <option value="pengumuman">Pengumuman</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              Judul
            </label>
            <input
              autoFocus
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="mis. Kegiatan Gotong Royong Warga"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              Ringkasan (opsional)
            </label>
            <textarea
              rows={2}
              className={inputClass}
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="Ringkasan singkat"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              Isi lengkap (opsional)
            </label>
            <textarea
              rows={4}
              className={inputClass}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="Isi lengkap berita"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              Tanggal
            </label>
            <input
              type="date"
              className={inputClass}
              value={form.published_at}
              onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
            />
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
              {submitting ? "Menyimpan…" : "Tambah Berita"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
