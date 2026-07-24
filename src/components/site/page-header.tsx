import Link from "next/link";

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="bg-ocean-800 px-6 pt-12 pb-10">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-3 flex items-center gap-1.5 text-[13px]">
          <Link
            href="/"
            className="text-ocean-100 no-underline hover:underline"
          >
            Beranda
          </Link>
          <span className="text-ocean-300">/</span>
          <span className="text-white">{title}</span>
        </div>
        <h1 className="m-0 mb-2 text-[clamp(28px,4vw,40px)] text-white">
          {title}
        </h1>
        <p className="m-0 max-w-[60ch] text-base text-ocean-100">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
