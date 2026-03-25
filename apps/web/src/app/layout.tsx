import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "KicksMtaani - Premium Shoes in Kenya",
  description:
    "Shop the best shoes for the whole family. Men, Women, Kids - Free delivery in Nairobi & Mombasa.",
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
