import { EditableText } from "../editable";
import { PreviewCard, useContentMap } from "../ui";
import type { ContentMap, Notify } from "../types";

export function KontakSection({
  content: initial,
  notify,
}: {
  content: ContentMap;
  notify: Notify;
}) {
  const { content, saveField } = useContentMap(initial, notify);

  return (
    <PreviewCard title="Pratinjau — Footer">
      <div className="flex flex-col gap-4 p-6 sm:p-8">
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
            Alamat
          </label>
          <EditableText
            as="div"
            value={content["contact.address"] ?? ""}
            onChange={(v) => saveField("contact.address", v)}
            className="text-sm text-text-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
            Email
          </label>
          <EditableText
            as="div"
            value={content["contact.email"] ?? ""}
            onChange={(v) => saveField("contact.email", v)}
            className="text-sm text-text-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
            Jam layanan — Senin–Kamis
          </label>
          <EditableText
            as="div"
            value={content["contact.hours_weekday"] ?? ""}
            onChange={(v) => saveField("contact.hours_weekday", v)}
            className="text-sm text-text-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
            Jam layanan — Jumat
          </label>
          <EditableText
            as="div"
            value={content["contact.hours_friday"] ?? ""}
            onChange={(v) => saveField("contact.hours_friday", v)}
            className="text-sm text-text-primary"
          />
        </div>
      </div>
    </PreviewCard>
  );
}
