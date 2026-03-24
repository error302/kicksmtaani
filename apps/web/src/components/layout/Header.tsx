"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, User } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useState } from "react";

export function Header() {
  const { items, toggleCart } = useCartStore();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-primary">
            KicksMtaani
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products?category=MEN" className="hover:text-primary">
              Men
            </Link>
            <Link
              href="/products?category=WOMEN"
              className="hover:text-primary"
            >
              Women
            </Link>
            <Link href="/products?category=BOYS" className="hover:text-primary">
              Boys
            </Link>
            <Link
              href="/products?category=GIRLS"
              className="hover:text-primary"
            >
              Girls
            </Link>
            <Link href="/products?category=KIDS" className="hover:text-primary">
              Kids
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/search" className="p-2 hover:text-primary">
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/account"
              className="p-2 hover:text-primary hidden md:block"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={toggleCart}
              className="p-2 hover:text-primary relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link
                href="/products?category=MEN"
                onClick={() => setMobileMenuOpen(false)}
              >
                Men
              </Link>
              <Link
                href="/products?category=WOMEN"
                onClick={() => setMobileMenuOpen(false)}
              >
                Women
              </Link>
              <Link
                href="/products?category=KIDS"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kids
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
