"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Search, Menu, X, Heart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import type { SiteSettings } from "@/lib/settings";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV = [
  { label: "New", href: "#new" },
  { label: "Brands", href: "#brands" },
  { label: "Men", href: "#men" },
  { label: "Women", href: "#women" },
  { label: "Kids", href: "#kids" },
  { label: "Sale", href: "#sale" },
];

interface Props {
  settings: SiteSettings;
}

export function SiteHeader({ settings: s }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartStore((s) => s.getTotalItems());
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const setWishlistOpen = useWishlistStore((s) => s.setWishlistOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 header-blur border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 lg:h-20 items-center justify-between gap-4">
          {/* Left — mobile menu trigger */}
          <div className="flex items-center gap-3 lg:gap-6 flex-1 lg:flex-none">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden -ml-2"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[88vw] max-w-sm p-0">
                <SheetHeader className="px-6 pt-6 pb-4 border-b">
                  <SheetTitle className="text-left text-xl tracking-display font-semibold">
                    {s.logoUrl ? (
                      <img src={s.logoUrl} alt={`${s.siteName}${s.siteNameAccent}`} className="h-7 w-auto" />
                    ) : (
                      <span>{s.siteName}<span className="text-[var(--kenyan-red)]">{s.siteNameAccent}</span></span>
                    )}
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-2">
                  {NAV.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3.5 text-base font-medium hover:bg-accent rounded-md transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
                <div className="px-6 py-4 border-t mt-2 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">{s.siteName}{s.siteNameAccent}</p>
                  <p>{s.footerTagline}</p>
                  <p className="mt-2">{s.contactAddress}</p>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-px bg-foreground transition-all duration-300" />
                </a>
              ))}
            </nav>
          </div>

          {/* Center — Logo */}
          <Link
            href="/"
            className="flex-1 lg:flex-none text-center lg:text-left"
            aria-label={`${s.siteName}${s.siteNameAccent} home`}
          >
            {s.logoUrl ? (
              <img src={s.logoUrl} alt={`${s.siteName}${s.siteNameAccent}`} className="h-8 sm:h-9 lg:h-10 w-auto inline-block" />
            ) : (
              <span className="font-semibold text-lg sm:text-xl lg:text-2xl tracking-display inline-flex items-baseline">
                {s.siteName}
                <span className="text-[var(--kenyan-red)]">{s.siteNameAccent}</span>
              </span>
            )}
          </Link>

          {/* Right — actions */}
          <div className="flex items-center justify-end gap-0.5 sm:gap-1 flex-1 lg:flex-none">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              className="hidden sm:inline-flex"
              onClick={() => {
                document
                  .getElementById("product-grid")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Wishlist with ${wishlistCount} items`}
              onClick={() => setWishlistOpen(true)}
              className="relative"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-foreground text-background text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Cart with ${cartCount} items`}
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-[var(--kenyan-red)] text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
