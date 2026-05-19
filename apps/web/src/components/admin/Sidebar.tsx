"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Store, ImagePlus } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/users", label: "Users", icon: Users },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-gray-950 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/5">
        <Link href="/admin" className="text-xl font-black tracking-tighter">
          SNEAKROOM
        </Link>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                active
                  ? "bg-white text-black shadow-lg shadow-white/10"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors"
        >
          <ImagePlus className="w-5 h-5" /> New Product
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-white transition-colors text-sm"
        >
          <Store className="w-4 h-4" /> Back to Store
        </Link>
      </div>
    </aside>
  );
}
