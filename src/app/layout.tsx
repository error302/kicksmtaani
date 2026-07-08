import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/lib/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KicksMtaani — Kenya's Premium Sneaker Marketplace",
  description:
    "Shop authentic Nike, Adidas, Jordan, Yeezy, New Balance, On Running, Salomon, Travis Scott, Off-White and 20+ more premium sneaker brands. Free delivery in Nairobi & Mombasa. 7-day returns.",
  keywords: [
    "sneakers Kenya",
    "Nike Kenya",
    "Adidas Kenya",
    "Jordan Kenya",
    "Yeezy Kenya",
    "New Balance Kenya",
    "sneaker marketplace Nairobi",
    "KicksMtaani",
    "premium sneakers",
    "authentic sneakers",
  ],
  authors: [{ name: "KicksMtaani" }],
  openGraph: {
    title: "KicksMtaani — Kenya's Premium Sneaker Marketplace",
    description:
      "Authentic sneakers from 25+ brands. Free delivery in Nairobi & Mombasa.",
    siteName: "KicksMtaani",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "KicksMtaani — Premium Sneakers",
    description: "Kenya's premium sneaker marketplace.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
