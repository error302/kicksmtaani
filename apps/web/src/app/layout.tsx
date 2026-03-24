import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
