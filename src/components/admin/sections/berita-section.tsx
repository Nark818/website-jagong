import { useState } from "react";
import { EditableText, EditableImage } from "../editable";
import { AddRowButton, DeleteIconButton } from "../ui";
import { createNewsPost, deleteNewsPost, updateNewsPost, uploadMedia } from "@/lib/supabase/mutations";
import { cn } from "@/lib/utils";
import type { NewsRow, Notify } from "../types";

export function BeritaSection({ news: initial, notify }: { news: NewsRow[]; notify: Notify }) {
  const [news, setNews] = useState(initial);

  const save = async (id: string, patch: Partial<NewsRow>) => {
    setNews((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    try {
      await updateNewsPost(id, patch);
      notify(true);
    } catch {
      notify(false, "Gagal menyimpan perubahan.");
    }
  };

  const addPost = async () => {
    try {
      const row = await createNewsPost({
        category: "berita",
        title: "Judul berita baru",
        excerpt: "",
        body: "",
        published_at: new Date().toISOString(),
      });
      setNews((items) => [row, ...items]);
      notify(true);
    } catch {
      notify(false, "Gagal menambah berita.");
    }
  };

  const removePost = async (id: string) => {
    setNews((items) => items.filter((item) => item.id !== id));
    try {
      await deleteNewsPost(id);
      notify(true);
    } catch {
      notify(false, "Gagal menghapus berita.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {news.map((post) => (
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
                className="rounded-sm border border-border-default bg-surface-card px-2 py-1 text-xs font-medium text-text-primary"
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
      <AddRowButton onClick={addPost} label="Tambah Berita/Pengumuman" />
    </div>
  );
}
