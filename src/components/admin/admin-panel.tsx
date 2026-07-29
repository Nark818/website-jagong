"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Landmark, ExternalLink, LogOut, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/browser";
import { SECTIONS, SECTION_NOTES, type SectionKey } from "./section-keys";
import type { AdminInitialData, Notify } from "./types";
import { DashboardSection } from "./sections/dashboard-section";
import { BerandaSection } from "./sections/beranda-section";
import { ProfilSection } from "./sections/profil-section";
import { GaleriSection } from "./sections/galeri-section";
import { BeritaSection } from "./sections/berita-section";
import { PendudukSection } from "./sections/penduduk-section";
import { LayananSection } from "./sections/layanan-section";
import { PetaSection } from "./sections/peta-section";
import { KontakSection } from "./sections/kontak-section";

export default function AdminPanel({
  userEmail,
  initialData,
}: {
  userEmail: string;
  initialData: AdminInitialData;
}) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const notify: Notify = (ok, message) => {
    setToast({ ok, message: message ?? (ok ? "Tersimpan." : "Terjadi kesalahan.") });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2500);
  };

  const goTo = (key: SectionKey) => setActiveSection(key);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-page md:flex-row">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between gap-3 bg-ocean-900 px-4 py-3 md:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-ocean-600 text-white">
            <Landmark className="size-4" />
          </span>
          <div>
            <div className="font-display text-sm leading-tight font-semibold text-white">
              Admin Panel
            </div>
            <div className="text-[10px] text-ocean-300">Kelurahan Jagong</div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 text-xs text-ocean-200"
        >
          <LogOut className="size-3.5" /> Keluar
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto bg-ocean-900 px-4 pb-3 md:hidden">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const active = activeSection === sec.key;
          return (
            <button
              key={sec.key}
              type="button"
              onClick={() => setActiveSection(sec.key)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-sm px-3.5 py-2 text-left text-[13px] font-medium whitespace-nowrap text-ocean-100",
                active && "bg-ocean-700 font-semibold text-white",
              )}
            >
              <Icon className="size-[15px] shrink-0" />
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-ocean-900 px-4 py-6 md:flex">
        <div className="flex items-center gap-2.5 px-2 pb-6">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-ocean-600 text-white">
            <Landmark className="size-[18px]" />
          </span>
          <div>
            <div className="font-display text-[15px] leading-tight font-semibold text-white">
              Admin Panel
            </div>
            <div className="text-[11px] text-ocean-300">Kelurahan Jagong</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const active = activeSection === sec.key;
            return (
              <button
                key={sec.key}
                type="button"
                onClick={() => setActiveSection(sec.key)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-sm px-4 py-2.5 text-left text-sm font-medium text-ocean-100",
                  active && "bg-ocean-700 font-semibold text-white",
                )}
              >
                <Icon className="size-[17px] shrink-0" />
                {sec.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-3 border-t border-ocean-800 pt-3">
          <div className="truncate px-1 text-[11px] text-ocean-300">{userEmail}</div>
          <Link
            href="/"
            className="flex items-center gap-2 text-[13px] text-ocean-200 no-underline"
          >
            <ExternalLink className="size-3.5" /> Lihat situs publik
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-[13px] text-ocean-200"
          >
            <LogOut className="size-3.5" /> Keluar
          </button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex flex-col gap-1 border-b border-border-default bg-surface-card px-4 py-4 sm:px-8 sm:py-5">
          <h1 className="m-0 text-xl text-text-primary">
            {SECTIONS.find((s) => s.key === activeSection)?.label}
          </h1>
          <p className="mt-1 mb-0 text-[13px] text-text-muted">{SECTION_NOTES[activeSection]}</p>
        </header>

        {toast && (
          <div
            className={cn(
              "mx-4 mt-4 flex items-center gap-2.5 rounded-md border px-4 py-3 sm:mx-8",
              toast.ok
                ? "border-forest-200 bg-forest-50 text-forest-800"
                : "border-[#FCA5A5] bg-[#FEF2F2] text-[#B91C1C]",
            )}
          >
            {toast.ok ? (
              <CheckCircle2 className="size-4 shrink-0" />
            ) : (
              <XCircle className="size-4 shrink-0" />
            )}
            <span className="text-[13px]">{toast.message}</span>
          </div>
        )}

        <div className="w-full max-w-[1000px] flex-1 box-border p-4 sm:p-8">
          {activeSection === "dashboard" && <DashboardSection data={initialData} goTo={goTo} />}
          {activeSection === "beranda" && (
            <BerandaSection content={initialData.content} notify={notify} />
          )}
          {activeSection === "profil" && (
            <ProfilSection content={initialData.content} staff={initialData.staff} notify={notify} />
          )}
          {activeSection === "galeri" && (
            <GaleriSection gallery={initialData.gallery} notify={notify} />
          )}
          {activeSection === "berita" && <BeritaSection news={initialData.news} notify={notify} />}
          {activeSection === "penduduk" && (
            <PendudukSection
              population={initialData.population}
              rwAreas={initialData.rwAreas}
              taxYear={initialData.taxYear}
              taxTarget={initialData.taxTarget}
              taxMonths={initialData.taxMonths}
              notify={notify}
            />
          )}
          {activeSection === "layanan" && (
            <LayananSection services={initialData.services} notify={notify} />
          )}
          {activeSection === "peta" && (
            <PetaSection boundaries={initialData.boundaries} notify={notify} />
          )}
          {activeSection === "kontak" && (
            <KontakSection content={initialData.content} notify={notify} />
          )}
        </div>
      </main>
    </div>
  );
}
