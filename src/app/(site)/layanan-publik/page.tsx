"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, FileText, AlertCircle, CheckCircle2, Send, Clock, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";

const SERVICES = [
  {
    key: "domisili",
    title: "Surat Keterangan Domisili",
    desc: "Bukti tempat tinggal warga untuk keperluan administrasi.",
    reqs: ["FC Kartu Keluarga (KK)"],
  },
  {
    key: "sktm",
    title: "Surat Keterangan Tidak Mampu",
    desc: "Untuk keperluan bantuan sosial, beasiswa, atau keringanan biaya.",
    reqs: ["FC Kartu Keluarga (KK)"],
  },
  {
    key: "pengantar-ktp-kk",
    title: "Surat Pengantar KTP/KK",
    desc: "Pengantar untuk pembuatan atau perubahan data KTP/KK di Dukcapil.",
    reqs: ["KK lama", "FC KTP"],
  },
  {
    key: "nib",
    title: "Surat Pengantar NIB",
    desc: "Pengantar untuk penerbitan Nomor Induk Berusaha (NIB).",
    reqs: ["FC KK", "FC KTP", "FC NPWP (Nomor Pokok Wajib Pajak)", "Foto usaha"],
  },
  {
    key: "kelahiran",
    title: "Keterangan Akta Kelahiran",
    desc: "Pengantar pencatatan akta kelahiran ke Dinas Dukcapil.",
    reqs: [
      "FC KTP orang tua",
      "FC surat kelahiran bidan/RS",
      "FC buku nikah",
      "Saksi dua orang (opsional)",
    ],
  },
  {
    key: "kematian",
    title: "Surat Keterangan Kematian",
    desc: "Pengantar pencatatan kematian warga ke Dinas Dukcapil.",
    reqs: ["FC KK yang bersangkutan"],
  },
  {
    key: "pengantar-nikah",
    title: "Surat Pengantar Nikah",
    desc: "Pengantar ke KUA untuk keperluan pernikahan.",
    reqs: [
      "FC KK orang tua kedua calon mempelai",
      "FC KTP kedua calon mempelai",
      "Pas foto 2x3",
      "FC ijazah calon mempelai",
    ],
  },
  {
    key: "belum-menikah",
    title: "Surat Keterangan Belum Menikah",
    desc: "Untuk keperluan administrasi pernikahan atau lamaran kerja.",
    reqs: ["FC KK", "FC KTP"],
  },
  {
    key: "izin-keramaian",
    title: "Izin Keramaian",
    desc: "Izin untuk penyelenggaraan acara/kegiatan yang mengundang keramaian.",
    reqs: ["FC KK", "FC KTP"],
  },
  {
    key: "penghasilan",
    title: "Surat Keterangan Penghasilan",
    desc: "Untuk keperluan administrasi yang membutuhkan bukti penghasilan.",
    reqs: ["FC KK", "FC KTP"],
  },
  {
    key: "janda-duda",
    title: "Surat Keterangan Janda/Duda",
    desc: "Bukti status janda atau duda untuk keperluan administrasi.",
    reqs: ["FC KK"],
  },
];

const STEPS = [
  "Pilih jenis layanan dan isi formulir.",
  "Petugas memverifikasi data dalam 1–3 hari kerja.",
  "Ambil surat di kantor kelurahan atau sesuai arahan petugas.",
];

export default function LayananPublikPage() {
  const [formName, setFormName] = useState("");
  const [formNik, setFormNik] = useState("");
  const [formService, setFormService] = useState("");
  const [formNeed, setFormNeed] = useState("");
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const selectService = (key: string) => {
    setFormService(key);
    setFormError("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formNik.trim() || !formService) {
      setFormError("Mohon lengkapi nama, NIK, dan jenis layanan.");
      return;
    }
    const ref = "SRV-2026-" + Math.floor(1000 + Math.random() * 9000);
    setRefNumber(ref);
    setSubmitted(true);
    setFormError("");
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormName("");
    setFormNik("");
    setFormService("");
    setFormNeed("");
    setFormError("");
    setRefNumber("");
  };

  return (
    <main className="flex-1">
      <PageHeader
        title="Layanan Publik"
        subtitle="Ajukan surat keterangan dan dokumen administrasi kelurahan secara daring."
      />

      <section className="mx-auto max-w-[1120px] px-6 pt-16">
        <h2 className="mb-2 text-2xl text-text-primary">
          Jenis layanan surat
        </h2>
        <p className="mb-8 text-sm text-text-muted">
          Pilih layanan sesuai kebutuhan, lalu ajukan permohonan melalui
          formulir di bawah.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-stretch gap-5">
          {SERVICES.map((svc) => (
            <div
              key={svc.key}
              className="box-border flex h-full flex-col gap-3 rounded-lg border border-border-default bg-surface-card p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-sm bg-ocean-50">
                <FileText className="size-5 text-ocean-700" />
              </span>
              <h3 className="m-0 text-base font-semibold text-text-primary">
                {svc.title}
              </h3>
              <p className="m-0 text-[13px] leading-relaxed text-text-secondary">
                {svc.desc}
              </p>
              <div className="mt-1 text-xs font-semibold tracking-wide text-text-muted uppercase">
                Syarat
              </div>
              <ul className="m-0 flex flex-col gap-1 pl-[18px]">
                {svc.reqs.map((r) => (
                  <li
                    key={r}
                    className="text-[13px] leading-relaxed text-text-secondary"
                  >
                    {r}
                  </li>
                ))}
              </ul>
              <a
                href="#form-permohonan"
                onClick={() => selectService(svc.key)}
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-sm bg-ocean-600 px-4 py-2.5 text-sm font-semibold text-white no-underline"
              >
                Ajukan <ArrowRight className="size-[15px]" />
              </a>
            </div>
          ))}
        </div>
      </section>

      <section
        id="form-permohonan"
        className="mx-auto max-w-[1120px] px-6 py-20"
      >
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(240px,1fr)]">
          <div className="rounded-lg border border-border-default bg-surface-card p-8">
            {!submitted ? (
              <>
                <h2 className="mb-2 text-2xl text-text-primary">
                  Formulir permohonan
                </h2>
                <p className="mb-7 text-sm text-text-muted">
                  Isi data berikut. Petugas kelurahan akan menghubungi Anda
                  untuk verifikasi.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary">
                      Nama lengkap
                    </label>
                    <input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Sesuai KTP"
                      className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-ocean-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary">
                      NIK
                    </label>
                    <input
                      value={formNik}
                      onChange={(e) => setFormNik(e.target.value)}
                      placeholder="16 digit Nomor Induk Kependudukan"
                      className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-ocean-500"
                    />
                    <span className="text-xs text-text-muted">
                      Data NIK hanya digunakan untuk verifikasi layanan.
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary">
                      Jenis layanan
                    </label>
                    <select
                      value={formService}
                      onChange={(e) => selectService(e.target.value)}
                      className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-ocean-500"
                    >
                      <option value="">Pilih jenis layanan</option>
                      {SERVICES.map((svc) => (
                        <option key={svc.key} value={svc.key}>
                          {svc.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary">
                      Keperluan / keterangan tambahan
                    </label>
                    <textarea
                      value={formNeed}
                      onChange={(e) => setFormNeed(e.target.value)}
                      placeholder="Jelaskan singkat keperluan surat ini"
                      className="min-h-24 resize-y rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-ocean-500"
                    />
                  </div>
                  {formError && (
                    <div className="flex items-center gap-2 rounded-sm bg-[#FCE8E6] px-3.5 py-2.5 text-[13px] text-[#DC2626]">
                      <AlertCircle className="size-[15px] shrink-0" />
                      {formError}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="inline-flex w-fit items-center gap-2 rounded-sm bg-ocean-600 px-6 py-3 text-base font-semibold text-white"
                  >
                    Kirim permohonan <Send className="size-[17px]" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-start gap-4">
                <span className="flex size-[52px] items-center justify-center rounded-full bg-forest-50">
                  <CheckCircle2 className="size-[26px] text-forest-600" />
                </span>
                <h2 className="m-0 text-[22px] text-text-primary">
                  Permohonan terkirim
                </h2>
                <p className="m-0 text-[15px] leading-relaxed text-text-secondary">
                  Permohonan Anda telah kami terima. Petugas kelurahan akan
                  menghubungi Anda dalam 1–3 hari kerja untuk verifikasi dan
                  pengambilan surat.
                </p>
                <div className="rounded-sm bg-ocean-50 px-4 py-2.5 font-mono text-[15px] font-semibold text-ocean-700">
                  {refNumber}
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-2 rounded-sm border border-border-strong bg-transparent px-4.5 py-2.5 text-sm font-semibold text-text-primary"
                >
                  Ajukan permohonan baru
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
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
                Jam & kontak layanan
              </h3>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 size-[15px] shrink-0 text-ocean-600" />
                  <span className="text-[13px] leading-relaxed text-text-secondary">
                    Senin–Jumat, 08.00–16.00 WITA
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 size-[15px] shrink-0 text-ocean-600" />
                  <span className="text-[13px] leading-relaxed text-text-secondary">
                    (0410) 000-000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
