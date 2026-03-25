import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "KicksMtaani - Premium Sneakers for Kenya",
    template: "%s | KicksMtaani",
  },
  description:
    "Shop premium Nike, Adidas, and more sneakers in Kenya. Free delivery in Nairobi & Mombasa. Authentic shoes for the whole family.",
  keywords: [
    "sneakers",
    "shoes",
    "Kenya",
    "Nairobi",
    "Nike",
    "Adidas",
    "KicksMtaani",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "KicksMtaani",
    title: "KicksMtaani - Premium Sneakers for Kenya",
    description:
      "Shop premium sneakers in Kenya. Free delivery in Nairobi & Mombasa.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartSidebar />
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
