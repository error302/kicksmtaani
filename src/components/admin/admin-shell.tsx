"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Store,
  LogOut,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/brands", label: "Brands", icon: Tag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  user,
  children,
}: {
  user: { email: string; name?: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-60 flex-col bg-foreground text-background fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-background/10">
          <Link href="/admin" className="font-semibold text-lg tracking-display">
            Kicks<span className="text-[var(--kenyan-red)]">Mtaani</span>
          </Link>
          <p className="text-[10px] uppercase tracking-[0.25em] text-background/50 mt-1">
            Admin
          </p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? "bg-background text-foreground"
                    : "text-background/70 hover:bg-background/10 hover:text-background"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-background/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md text-background/70 hover:bg-background/10 hover:text-background transition-colors"
          >
            <Store className="h-4 w-4" />
            View store
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md text-background/70 hover:bg-background/10 hover:text-background transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          <div className="px-3 py-2 mt-2 text-xs text-background/50 truncate">
            {user.email}
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 inset-x-0 z-30 bg-foreground text-background h-14 flex items-center justify-between px-4">
        <Link href="/admin" className="font-semibold tracking-display">
          Kicks<span className="text-[var(--kenyan-red)]">Mtaani</span>
          <span className="text-[10px] uppercase tracking-[0.2em] ml-2 text-background/50">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="p-2 -mr-2"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-foreground text-background p-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold tracking-display">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1">
              {NAV.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md ${
                      active
                        ? "bg-background text-foreground"
                        : "text-background/70 hover:bg-background/10"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-background/10 pt-3 mt-3">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md text-background/70 hover:bg-background/10"
              >
                <Store className="h-4 w-4" />
                View store
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md text-background/70 hover:bg-background/10"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-60 pt-14 md:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
