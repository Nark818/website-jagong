import type { Metadata } from "next";
import { Lora, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = "https://kelurahanjagong.vercel.app";
const siteName = "Website Kelurahan Jagong";
// Short brand name for the site-name chip Google shows next to the URL in
// search results. Kept distinct from `siteName` (the full <title>) because
// on a *.vercel.app domain Google otherwise tends to fall back to showing
// "Vercel" there unless structured data spells out the real brand name.
const siteBrand = "Kelurahan Jagong";
const siteDescription =
  "Situs resmi Pemerintah Kelurahan Jagong, Kecamatan Pangkajene, Kabupaten Pangkep, Sulawesi Selatan. Profil, berita, layanan publik, data penduduk, dan peta kelurahan.";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteBrand,
    url: siteUrl,
  },
  {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: siteBrand,
    url: siteUrl,
    logo: `${siteUrl}/images/Logo/Logo_Kelurahan_Jagong.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pangkajene",
      addressRegion: "Sulawesi Selatan",
      addressCountry: "ID",
    },
  },
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "Website Kelurahan Jagong",
    "Kelurahan Jagong",
    "Pemerintah Kelurahan Jagong",
    "Kecamatan Pangkajene",
    "Kabupaten Pangkep",
  ],
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "9QNM8-2HFELpRc99tVSV8G8iljBL7GBZxQKws21jMaw",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: siteBrand,
    title: siteName,
    description: siteDescription,
    images: [{ url: "/images/Logo/Logo_Kelurahan_Jagong.png" }],
  },
  twitter: {
    card: "summary",
    title: siteName,
    description: siteDescription,
    images: ["/images/Logo/Logo_Kelurahan_Jagong.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${lora.variable} ${workSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
