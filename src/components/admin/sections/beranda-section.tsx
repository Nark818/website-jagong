import { useState } from "react";
import { EditableText, EditableImage } from "../editable";
import { DeleteIconButton, PreviewCard, useContentMap } from "../ui";
import {
  createHeroSlide,
  deleteHeroSlide,
  updateHeroSlide,
  uploadMedia,
} from "@/lib/supabase/mutations";
import type { ContentMap, HeroSlideRow, Notify } from "../types";

export function BerandaSection({
  content: initial,
  heroSlides: initialSlides,
  notify,
}: {
  content: ContentMap;
  heroSlides: HeroSlideRow[];
  notify: Notify;
}) {
  const { content, saveField } = useContentMap(initial, notify);
  const [slides, setSlides] = useState(initialSlides);

  const saveSlide = async (id: string, patch: Partial<HeroSlideRow>) => {
    setSlides((s) => s.map((sl) => (sl.id === id ? { ...sl, ...patch } : sl)));
    try {
      await updateHeroSlide(id, patch);
      notify(true);
    } catch {
      notify(false, "Gagal menyimpan perubahan.");
    }
  };

  const addSlide = async () => {
    try {
      const row = await createHeroSlide({ alt: "Foto kelurahan", sort_order: slides.length });
      setSlides((s) => [...s, row]);
      notify(true, "Foto baru ditambahkan.", "add");
    } catch {
      notify(false, "Gagal menambah foto.");
    }
  };

  const removeSlide = async (id: string) => {
    setSlides((s) => s.filter((sl) => sl.id !== id));
    try {
      await deleteHeroSlide(id);
      notify(true, "Foto dihapus.", "delete");
    } catch {
      notify(false, "Gagal menghapus foto.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PreviewCard title="Pratinjau — Hero Beranda">
        <div className="flex flex-col gap-3 p-6 sm:p-8">
          <EditableText
            as="div"
            value={content["hero.title"] ?? ""}
            onChange={(v) => saveField("hero.title", v)}
            placeholder="Judul hero"
            className="font-display text-xl font-semibold text-text-primary"
          />
          <EditableText
            as="p"
            multiline
            value={content["hero.subtitle"] ?? ""}
            onChange={(v) => saveField("hero.subtitle", v)}
            placeholder="Subjudul hero"
            className="text-sm text-text-secondary"
          />
        </div>
      </PreviewCard>

      <PreviewCard title="Pratinjau — Carousel Foto Hero">
        <div className="grid grid-cols-2 gap-5 p-6 sm:grid-cols-3 sm:p-8">
          {slides.map((slide) => (
            <div key={slide.id} className="relative flex flex-col gap-2">
              <EditableImage
                photo={slide.photo_url}
                label={slide.alt}
                onUpload={async (file) => {
                  try {
                    const url = await uploadMedia(file, "hero");
                    await saveSlide(slide.id, { photo_url: url });
                  } catch {
                    notify(false, "Gagal mengunggah foto.");
                  }
                }}
                className="aspect-video w-full rounded-lg"
              />
              <EditableText
                as="div"
                value={slide.alt}
                onChange={(v) => saveSlide(slide.id, { alt: v })}
                placeholder="Keterangan foto"
                className="text-center text-xs text-text-secondary"
              />
              <div className="absolute top-1.5 right-1.5">
                <DeleteIconButton onClick={() => removeSlide(slide.id)} label="Hapus foto" />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addSlide}
            className="flex aspect-video w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong text-text-secondary"
          >
            <span className="text-xs font-medium">+ Tambah foto</span>
          </button>
        </div>
        <p className="m-0 px-6 pb-6 text-xs text-text-muted sm:px-8">
          Foto akan tampil bergantian di latar hero Beranda. Urutan mengikuti
          urutan penambahan.
        </p>
      </PreviewCard>

      <PreviewCard title="Pratinjau — Sambutan Lurah">
        <div className="flex flex-col gap-3 p-6 sm:p-8">
          <EditableImage
            photo={content["sambutan.photo_url"] ?? null}
            label="Foto Kantor Kelurahan Jagong"
            onUpload={async (file) => {
              try {
                const url = await uploadMedia(file, "content");
                await saveField("sambutan.photo_url", url);
              } catch {
                notify(false, "Gagal mengunggah foto.");
              }
            }}
            className="h-[220px] w-full rounded-lg"
          />
          <EditableText
            as="div"
            value={content["sambutan.title"] ?? ""}
            onChange={(v) => saveField("sambutan.title", v)}
            placeholder="Judul sambutan"
            className="text-lg font-semibold text-text-primary"
          />
          <EditableText
            as="p"
            multiline
            value={content["sambutan.body_1"] ?? ""}
            onChange={(v) => saveField("sambutan.body_1", v)}
            placeholder="Paragraf pertama"
            className="text-[15px] leading-relaxed text-text-secondary"
          />
          <EditableText
            as="p"
            multiline
            value={content["sambutan.body_2"] ?? ""}
            onChange={(v) => saveField("sambutan.body_2", v)}
            placeholder="Paragraf kedua"
            className="text-[15px] leading-relaxed text-text-secondary"
          />
          <p className="m-0 text-xs text-text-muted">
            Nama dan foto penanda tangan diambil otomatis dari staf pertama di
            daftar Perangkat Kelurahan (bagian Profil Kelurahan).
          </p>
        </div>
      </PreviewCard>
    </div>
  );
}
