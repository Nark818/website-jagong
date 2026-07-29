import { useState } from "react";
import { Landmark, Users } from "lucide-react";
import { AddRowButton, DeleteIconButton, StatTile } from "../ui";
import {
  createRwArea,
  createTaxMonth,
  deleteRwArea,
  deleteTaxMonth,
  updatePopulationSnapshot,
  updateRwArea,
  updateTaxMonth,
  upsertTaxYearTarget,
} from "@/lib/supabase/mutations";
import type { Notify, PopulationRow, RwRow, TaxMonthRow, TaxTargetRow } from "../types";

const fmtId = (n: number) => n.toLocaleString("id-ID");

function NumberCell({
  value,
  onCommit,
  placeholder,
}: {
  value: number;
  onCommit: (n: number) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState(String(value));
  return (
    <input
      className="w-full min-w-0 rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-200"
      value={draft}
      placeholder={placeholder}
      inputMode="numeric"
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const n = Number(draft.replace(/[^\d.-]/g, ""));
        onCommit(Number.isFinite(n) ? n : 0);
      }}
    />
  );
}

function TextCell({
  value,
  onCommit,
  placeholder,
}: {
  value: string;
  onCommit: (v: string) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <input
      className="w-full min-w-0 rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-200"
      value={draft}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => onCommit(draft)}
    />
  );
}

export function PendudukSection({
  population: initialPopulation,
  rwAreas: initialRw,
  taxYear,
  taxTarget: initialTarget,
  taxMonths: initialMonths,
  notify,
}: {
  population: PopulationRow;
  rwAreas: RwRow[];
  taxYear: number;
  taxTarget: TaxTargetRow;
  taxMonths: TaxMonthRow[];
  notify: Notify;
}) {
  const [population, setPopulation] = useState(
    initialPopulation ?? {
      id: 1,
      total_penduduk: 0,
      kepala_keluarga: 0,
      laki_laki: 0,
      perempuan: 0,
      luas_wilayah_km2: 0,
      period_label: "",
      updated_at: "",
    },
  );
  const [rwAreas, setRwAreas] = useState(initialRw);
  const [target, setTarget] = useState(
    initialTarget ?? {
      year: taxYear,
      pokok_stts: 0,
      pokok_rp: 0,
      tunggakan_awal_stts: 0,
      tunggakan_awal_rp: 0,
      updated_at: "",
    },
  );
  const [months, setMonths] = useState(initialMonths);

  const savePopulation = async (patch: Partial<NonNullable<PopulationRow>>) => {
    setPopulation((p) => (p ? { ...p, ...patch } : p));
    try {
      await updatePopulationSnapshot(patch);
      notify(true);
    } catch {
      notify(false, "Gagal menyimpan statistik penduduk.");
    }
  };

  const saveRw = async (id: string, patch: Partial<RwRow>) => {
    setRwAreas((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    try {
      await updateRwArea(id, patch);
      notify(true);
    } catch {
      notify(false, "Gagal menyimpan data RW.");
    }
  };

  const addRw = async () => {
    try {
      const row = await createRwArea({ name: `RW 0${rwAreas.length + 1}`, sort_order: rwAreas.length });
      setRwAreas((rows) => [...rows, row]);
      notify(true, "RW baru ditambahkan.", "add");
    } catch {
      notify(false, "Gagal menambah RW.");
    }
  };

  const removeRw = async (id: string) => {
    setRwAreas((rows) => rows.filter((r) => r.id !== id));
    try {
      await deleteRwArea(id);
      notify(true, "RW dihapus.", "delete");
    } catch {
      notify(false, "Gagal menghapus RW.");
    }
  };

  const saveTarget = async (patch: Partial<TaxTargetRow>) => {
    setTarget((t) => (t ? { ...t, ...patch } : t));
    try {
      await upsertTaxYearTarget({ ...target, ...patch, year: taxYear });
      notify(true);
    } catch {
      notify(false, "Gagal menyimpan target pajak.");
    }
  };

  const saveMonth = async (id: string, patch: Partial<TaxMonthRow>) => {
    setMonths((rows) => rows.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    try {
      await updateTaxMonth(id, patch);
      notify(true);
    } catch {
      notify(false, "Gagal menyimpan realisasi bulanan.");
    }
  };

  const addMonth = async () => {
    const used = new Set(months.map((m) => m.month));
    const nextMonth = Array.from({ length: 12 }, (_, i) => i + 1).find((m) => !used.has(m));
    if (!nextMonth) {
      notify(false, "Semua bulan tahun ini sudah ada.");
      return;
    }
    try {
      const row = await createTaxMonth({ year: taxYear, month: nextMonth });
      setMonths((rows) => [...rows, row].sort((a, b) => a.month - b.month));
      notify(true, "Bulan baru ditambahkan.", "add");
    } catch {
      notify(false, "Gagal menambah bulan.");
    }
  };

  const removeMonth = async (id: string) => {
    setMonths((rows) => rows.filter((m) => m.id !== id));
    try {
      await deleteTaxMonth(id);
      notify(true, "Bulan dihapus.", "delete");
    } catch {
      notify(false, "Gagal menghapus bulan.");
    }
  };

  const totalRumah = fmtId(rwAreas.reduce((s, r) => s + r.rumah_count, 0));
  const totalMasjid = fmtId(rwAreas.reduce((s, r) => s + r.masjid_count, 0));

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-border-default bg-surface-card p-6">
        <h2 className="m-0 mb-4 text-base text-text-primary">Statistik Penduduk</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile
            icon={Users}
            value={
              <NumberCell
                value={population?.total_penduduk ?? 0}
                onCommit={(n) => savePopulation({ total_penduduk: n })}
              />
            }
            label="Total Penduduk"
            tone="ocean"
          />
          <StatTile
            icon={Landmark}
            value={
              <NumberCell
                value={population?.kepala_keluarga ?? 0}
                onCommit={(n) => savePopulation({ kepala_keluarga: n })}
              />
            }
            label="Kepala Keluarga"
            tone="forest"
          />
          <StatTile
            icon={Users}
            value={
              <NumberCell
                value={population?.laki_laki ?? 0}
                onCommit={(n) => savePopulation({ laki_laki: n })}
              />
            }
            label="Laki-laki"
            tone="ocean"
          />
          <StatTile
            icon={Users}
            value={
              <NumberCell
                value={population?.perempuan ?? 0}
                onCommit={(n) => savePopulation({ perempuan: n })}
              />
            }
            label="Perempuan"
            tone="ocean"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              Luas wilayah (km²)
            </label>
            <NumberCell
              value={population?.luas_wilayah_km2 ?? 0}
              onCommit={(n) => savePopulation({ luas_wilayah_km2: n })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              Periode data
            </label>
            <TextCell
              value={population?.period_label ?? ""}
              placeholder="mis. Data per Juni 2026"
              onCommit={(v) => savePopulation({ period_label: v })}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border-default bg-surface-card p-6">
        <h2 className="m-0 text-base text-text-primary">Jumlah Rumah & Masjid per RW</h2>
        <AddRowButton onClick={addRw} label="Tambah RW" />
        <div className="flex flex-col gap-2">
          {rwAreas.map((r) => (
            <div key={r.id} className="grid grid-cols-[1.2fr_1fr_1fr_auto] items-center gap-2">
              <TextCell value={r.name} placeholder="RW" onCommit={(v) => saveRw(r.id, { name: v })} />
              <NumberCell
                value={r.rumah_count}
                placeholder="Jumlah rumah"
                onCommit={(n) => saveRw(r.id, { rumah_count: n })}
              />
              <NumberCell
                value={r.masjid_count}
                placeholder="Masjid"
                onCommit={(n) => saveRw(r.id, { masjid_count: n })}
              />
              <DeleteIconButton onClick={() => removeRw(r.id)} label="Hapus baris" />
            </div>
          ))}
        </div>
        <div className="flex gap-6 border-t border-border-default pt-2 text-[13px] text-text-muted">
          <span>
            Total rumah (otomatis): <strong className="font-mono text-text-primary">{totalRumah}</strong>
          </span>
          <span>
            Total masjid (otomatis): <strong className="font-mono text-text-primary">{totalMasjid}</strong>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-lg border border-border-default bg-surface-card p-6">
        <h2 className="m-0 text-base text-text-primary">
          Realisasi Pajak (PBB-P2) — Tahun {taxYear}
        </h2>

        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
            Target Pokok PBB-P2
          </label>
          <div className="grid grid-cols-2 gap-2">
            <NumberCell
              value={target?.pokok_stts ?? 0}
              placeholder="STTS"
              onCommit={(n) => saveTarget({ pokok_stts: n })}
            />
            <NumberCell
              value={target?.pokok_rp ?? 0}
              placeholder="Rp"
              onCommit={(n) => saveTarget({ pokok_rp: n })}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
            Tunggakan Awal Tahun
          </label>
          <div className="grid grid-cols-2 gap-2">
            <NumberCell
              value={target?.tunggakan_awal_stts ?? 0}
              placeholder="STTS"
              onCommit={(n) => saveTarget({ tunggakan_awal_stts: n })}
            />
            <NumberCell
              value={target?.tunggakan_awal_rp ?? 0}
              placeholder="Rp"
              onCommit={(n) => saveTarget({ tunggakan_awal_rp: n })}
            />
          </div>
        </div>

        <div className="border-t border-border-default pt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="m-0 text-sm font-semibold text-text-primary">
              Realisasi Bulanan
            </h3>
          </div>
          <p className="mb-3 text-[13px] text-text-muted">
            &ldquo;S/D Bulan Lalu&rdquo; dan &ldquo;Bulan Ini&rdquo; di halaman
            Data Penduduk dihitung otomatis dari baris-baris bulan di bawah
            ini — bulan dengan nomor tertinggi dianggap &ldquo;bulan
            ini&rdquo;.
          </p>
          <div className="mb-3">
            <AddRowButton onClick={addMonth} label="Tambah bulan" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_auto] gap-2 text-[11px] font-semibold tracking-wide text-text-muted uppercase">
              <span>Bulan</span>
              <span>STTS PBB</span>
              <span>Rp PBB</span>
              <span>STTS Tunggakan</span>
              <span>Rp Tunggakan</span>
              <span />
            </div>
            {months.map((m) => (
              <div key={m.id} className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_auto] items-center gap-2">
                <span className="font-mono text-sm text-text-primary">Bulan {m.month}</span>
                <NumberCell value={m.pbb_stts} onCommit={(n) => saveMonth(m.id, { pbb_stts: n })} />
                <NumberCell value={m.pbb_rp} onCommit={(n) => saveMonth(m.id, { pbb_rp: n })} />
                <NumberCell
                  value={m.tunggakan_stts}
                  onCommit={(n) => saveMonth(m.id, { tunggakan_stts: n })}
                />
                <NumberCell
                  value={m.tunggakan_rp}
                  onCommit={(n) => saveMonth(m.id, { tunggakan_rp: n })}
                />
                <DeleteIconButton onClick={() => removeMonth(m.id)} label="Hapus bulan" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
