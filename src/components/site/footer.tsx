import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Clock } from "lucide-react";
import { getContentBlocks } from "@/lib/supabase/queries";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/berita", label: "Berita & Pengumuman" },
  { href: "/data-penduduk", label: "Data Penduduk" },
  { href: "/layanan-publik", label: "Layanan Publik" },
  { href: "/peta-desa", label: "Peta Kelurahan" },
];

export async function Footer() {
  const content = await getContentBlocks();

  return (
    <footer className="bg-ocean-900 text-neutral-100">
      <div className="mx-auto grid max-w-[1120px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-10 px-6 py-16 pb-8">
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <Image
              src="/images/Logo/Logo_Kelurahan_Jagong.png"
              alt="Lambang Kelurahan Jagong"
              width={42}
              height={42}
              className="size-[42px] rounded-md object-contain"
            />
            <span className="font-display text-lg font-semibold text-white">
              Kelurahan Jagong
            </span>
          </div>
          <p className="max-w-[34ch] text-sm leading-relaxed text-ocean-100">
            Situs resmi Pemerintah Kelurahan Jagong, Kecamatan Pangkajene,
            Kabupaten Pangkep, Sulawesi Selatan.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs tracking-wide text-ocean-300 uppercase">
            Tautan
          </h3>
          <div className="flex flex-col gap-2.5">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ocean-200 no-underline hover:text-white hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs tracking-wide text-ocean-300 uppercase">
            Kontak
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-ocean-300" />
              <span className="text-sm leading-relaxed text-ocean-100">
                {content["contact.address"] ??
                  "Jl. Pelelangan, Kel. Jagong, Kec. Pangkep, Sulawesi Selatan"}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-ocean-300" />
              <span className="text-sm text-ocean-100">
                {content["contact.email"] ?? "jagong2025@g.mail"}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-ocean-300" />
              <span className="text-sm leading-relaxed text-ocean-100">
                {content["contact.hours_weekday"] ?? "Senin–Kamis, 08.00–16.00 WITA"}
                <br />
                {content["contact.hours_friday"] ?? "Jumat, 08.00–16.30 WITA"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-ocean-800 px-6 py-5 text-center">
        <p className="text-[13px] text-ocean-300">
          © 2026 Pemerintah Kelurahan Jagong. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
