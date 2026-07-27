"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };
type NavGroup = { label: string; children: NavLink[] };
type NavEntry = NavLink | NavGroup;

const NAV_ITEMS: NavEntry[] = [
  { href: "/", label: "Beranda" },
  {
    label: "Profil Kelurahan",
    children: [
      { href: "/profil", label: "Profil Kelurahan" },
      { href: "/profil/galeri", label: "Galeri" },
    ],
  },
  { href: "/berita", label: "Berita & Pengumuman" },
  { href: "/data-penduduk", label: "Data Penduduk" },
  { href: "/layanan-publik", label: "Layanan Publik" },
  { href: "/peta-desa", label: "Peta Kelurahan" },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface-card">
      <div className="flex h-[76px] items-center justify-between gap-4 px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/images/Logo/Logo_Kelurahan_Jagong.png"
            alt="Lambang Kelurahan Jagong"
            width={48}
            height={48}
            className="size-12 shrink-0 object-contain"
            priority
          />
          <span className="flex min-w-0 flex-col">
            <span className="whitespace-nowrap font-display text-[19px] font-semibold leading-tight text-text-primary">
              Kelurahan Jagong
            </span>
            <span className="truncate text-xs text-text-secondary">
              Kec. Pangkajene, Kab. Pangkep, Prov. Sulawesi Selatan
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <nav
            aria-label="Navigasi utama"
            className="hidden min-[900px]:flex items-center gap-1"
          >
            {NAV_ITEMS.map((item) => {
              if ("children" in item) {
                const active = item.children.some(
                  (child) => pathname === child.href,
                );
                return (
                  <div key={item.label} className="group relative">
                    <button
                      type="button"
                      className={cn(
                        "flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] transition-all duration-300 ease-out",
                        active
                          ? "bg-gradient-to-r from-ocean-600 to-ocean-500 font-semibold text-white shadow-sm shadow-ocean-600/25"
                          : "font-normal text-text-secondary hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-ocean-50 hover:to-forest-50 hover:text-ocean-700 hover:shadow-sm",
                      )}
                    >
                      {item.label}
                      <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180" />
                    </button>
                    <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <div className="min-w-[170px] rounded-lg border border-border-default bg-surface-card p-1.5 shadow-lg">
                        {item.children.map((child) => {
                          const childActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "block rounded-md px-3 py-2 text-[13.5px] no-underline transition-colors duration-150",
                                childActive
                                  ? "bg-ocean-50 font-semibold text-ocean-700"
                                  : "text-text-secondary hover:bg-surface-sunken hover:text-ocean-700",
                              )}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] no-underline transition-all duration-300 ease-out",
                    active
                      ? "bg-gradient-to-r from-ocean-600 to-ocean-500 font-semibold text-white shadow-sm shadow-ocean-600/25"
                      : "font-normal text-text-secondary hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-ocean-50 hover:to-forest-50 hover:text-ocean-700 hover:shadow-sm",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2.5">
            <Link
              href="/admin"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-dashed border-border-strong px-3 py-2 text-xs font-medium text-text-secondary no-underline hover:text-ocean-700"
              title="Sementara — tautan cepat ke admin panel"
            >
              <LayoutDashboard className="size-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={mobileOpen}
              className="flex size-10 min-[900px]:hidden items-center justify-center rounded-sm border border-border-default bg-surface-card text-text-primary"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <nav
        aria-label="Navigasi utama"
        className={cn(
          "min-[900px]:hidden border-t border-border-default bg-surface-card px-4 py-3",
          mobileOpen ? "flex flex-col gap-1" : "hidden",
        )}
      >
        {NAV_ITEMS.flatMap((item) =>
          "children" in item ? item.children : [item],
        ).map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "rounded-lg px-4 py-3 text-base no-underline transition-all duration-300",
                active
                  ? "bg-gradient-to-r from-ocean-600 to-ocean-500 font-semibold text-white shadow-sm"
                  : "font-normal text-text-secondary active:bg-gradient-to-r active:from-ocean-50 active:to-forest-50 active:text-ocean-700",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
