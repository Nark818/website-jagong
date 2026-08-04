import { FileText, Clock } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { getServiceTypes, getContentBlocks } from "@/lib/supabase/queries";

const STEPS = [
  "Siapkan syarat sesuai jenis surat yang dibutuhkan.",
  "Datang ke kantor kelurahan pada jam layanan dan sampaikan keperluan ke petugas.",
  "Petugas memverifikasi berkas dan menerbitkan surat.",
];

export default async function LayananPublikPage() {
  const [services, content] = await Promise.all([
    getServiceTypes(),
    getContentBlocks(),
  ]);

  return (
    <main className="flex-1">
      <PageHeader
        title="Layanan Publik"
        subtitle="Jenis surat keterangan dan dokumen administrasi yang dilayani Kelurahan Jagong. Pengajuan dilakukan langsung di kantor kelurahan."
      />

      <section className="mx-auto max-w-[1120px] px-6 pt-16 pb-20">
        <h2 className="mb-2 text-2xl text-text-primary">
          Jenis layanan surat
        </h2>
        <p className="mb-8 text-sm text-text-muted">
          Siapkan syarat berikut sebelum datang ke kantor kelurahan.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-stretch gap-5">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="box-border flex h-full flex-col gap-3 rounded-lg border border-border-default bg-surface-card p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-sm bg-ocean-50">
                <FileText className="size-5 text-ocean-700" />
              </span>
              <h3 className="m-0 text-base font-semibold text-text-primary">
                {svc.title}
              </h3>
              <div className="mt-1 text-xs font-semibold tracking-wide text-text-muted uppercase">
                Syarat
              </div>
              <ul className="m-0 flex flex-col gap-1 pl-[18px]">
                {svc.requirements.map((r) => (
                  <li
                    key={r}
                    className="text-[13px] leading-relaxed text-text-secondary"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pb-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-lg border border-border-default bg-surface-sunken p-6">
            <h3 className="mb-4 text-[15px] font-semibold text-text-primary">
              Cara pengajuan
            </h3>
            <div className="flex flex-col gap-4">
              {STEPS.map((step, i) => (
                <div key={step} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ocean-600 font-mono text-xs text-white">
                    {i + 1}
                  </span>
                  <span className="text-[13px] leading-relaxed text-text-secondary">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border-default bg-surface-card p-6">
            <h3 className="mb-4 text-[15px] font-semibold text-text-primary">
              Jam layanan
            </h3>
            <div className="flex items-start gap-2.5">
              <Clock className="mt-0.5 size-[15px] shrink-0 text-ocean-600" />
              <span className="text-[13px] leading-relaxed text-text-secondary">
                {content["contact.hours_weekday"] || "Senin–Kamis, 08.00–16.00 WITA"}
                <br />
                {content["contact.hours_friday"] || "Jumat, 08.00–16.30 WITA"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
