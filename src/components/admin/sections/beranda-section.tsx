import { EditableText } from "../editable";
import { PreviewCard, useContentMap } from "../ui";
import type { ContentMap, Notify } from "../types";

export function BerandaSection({
  content: initial,
  notify,
}: {
  content: ContentMap;
  notify: Notify;
}) {
  const { content, saveField } = useContentMap(initial, notify);

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

      <PreviewCard title="Pratinjau — Sambutan Lurah">
        <div className="flex flex-col gap-3 p-6 sm:p-8">
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
