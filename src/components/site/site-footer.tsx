"use client";

import Link from "next/link";
import { Instagram, Twitter, Facebook, MapPin, Mail, Phone } from "lucide-react";

const SHOP = [
  { label: "New Arrivals", href: "#new" },
  { label: "All Brands", href: "#brands" },
  { label: "Men", href: "#men" },
  { label: "Women", href: "#women" },
  { label: "Kids", href: "#kids" },
  { label: "Sale", href: "#sale" },
];

const SUPPORT = [
  { label: "Contact", href: "#" },
  { label: "FAQs", href: "#" },
  { label: "Shipping & Returns", href: "#" },
  { label: "Size Guide", href: "#" },
  { label: "Track Order", href: "#" },
];

const LEGAL = [
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Cookie Policy", href: "#" },
  { label: "Authenticity Guarantee", href: "#" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
          {/* Shop */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {SHOP.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {SUPPORT.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {LEGAL.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-foreground/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span>Nairobi · Mombasa · Kisumu, Kenya</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a href="mailto:hello@kicksmtaani.co.ke" className="hover:text-foreground transition-colors">
                  hello@kicksmtaani.co.ke
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a href="tel:+254700000000" className="hover:text-foreground transition-colors">
                  +254 700 000 000
                </a>
              </li>
            </ul>
            <div className="flex gap-2 mt-5">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="h-9 w-9 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Big wordmark */}
        <div className="border-t border-border pt-8 sm:pt-10">
          <p className="text-5xl sm:text-7xl lg:text-9xl font-semibold tracking-tightest leading-none mb-8">
            Kicks
            <span className="text-[var(--kenyan-red)]">Mtaani</span>
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-muted-foreground">
            <p>© {year} KicksMtaani. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--kenyan-red)]" />
                100% Authentic
              </span>
              <span>·</span>
              <span>M-Pesa · Card · Cash on Delivery</span>
              <span>·</span>
              <span>Free delivery in Nairobi & Mombasa</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
