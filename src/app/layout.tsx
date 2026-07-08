import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/lib/providers";
import { getSettings } from "@/lib/settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const siteName = `${s.siteName}${s.siteNameAccent}`;
  return {
    title: {
      default: `${siteName} — Kenya's Premium Sneaker Marketplace`,
      template: `%s | ${siteName}`,
    },
    description: s.tagline,
    keywords: [
      "sneakers Kenya",
      "Nike Kenya",
      "Adidas Kenya",
      "Jordan Kenya",
      "Yeezy Kenya",
      "New Balance Kenya",
      "sneaker marketplace Nairobi",
      siteName,
      "premium sneakers",
      "authentic sneakers",
    ],
    authors: [{ name: siteName }],
    icons: s.faviconUrl
      ? { icon: s.faviconUrl, shortcut: s.faviconUrl, apple: s.faviconUrl }
      : undefined,
    openGraph: {
      title: `${siteName} — Kenya's Premium Sneaker Marketplace`,
      description: s.tagline,
      siteName,
      type: "website",
      locale: "en_KE",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} — Premium Sneakers`,
      description: "Kenya's premium sneaker marketplace.",
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Theme init script — runs before hydration to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('kicksmtaani-theme')||'light';if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
