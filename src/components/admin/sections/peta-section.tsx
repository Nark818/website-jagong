import { useState } from "react";
import { Compass } from "lucide-react";
import { EditableText } from "../editable";
import { updateMapBoundary } from "@/lib/supabase/mutations";
import type { BoundaryRow, Notify } from "../types";

const DIRECTION_ORDER = ["utara", "selatan", "timur", "barat"];
const DIRECTION_LABEL: Record<string, string> = {
  utara: "Utara",
  selatan: "Selatan",
  timur: "Timur",
  barat: "Barat",
};

export function PetaSection({
  boundaries: initial,
  notify,
}: {
  boundaries: BoundaryRow[];
  notify: Notify;
}) {
  const [boundaries, setBoundaries] = useState(initial);
  const sorted = [...boundaries].sort(
    (a, b) => DIRECTION_ORDER.indexOf(a.direction) - DIRECTION_ORDER.indexOf(b.direction),
  );

  const save = async (id: string, neighbor_name: string) => {
    setBoundaries((rows) => rows.map((r) => (r.id === id ? { ...r, neighbor_name } : r)));
    try {
      await updateMapBoundary(id, neighbor_name);
      notify(true);
    } catch {
      notify(false, "Gagal menyimpan perubahan.");
    }
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
      {sorted.map((b) => (
        <div key={b.id} className="rounded-md border border-border-default bg-surface-card p-5">
          <div className="mb-2 flex items-center gap-2">
            <Compass className="size-[15px] text-ocean-600" />
            <span className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              {DIRECTION_LABEL[b.direction]}
            </span>
          </div>
          <EditableText
            as="div"
            value={b.neighbor_name}
            onChange={(v) => save(b.id, v)}
            className="text-sm font-medium text-text-primary"
          />
        </div>
      ))}
    </div>
  );
}
