"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { Package, User, LogOut, ShoppingBag, CreditCard, Heart, MapPin, ChevronRight } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuItems = [
    { label: "My Orders", icon: Package, href: "/account/orders", color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Account Info", icon: User, href: "/account/profile", color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Wishlist", icon: Heart, href: "/account/wishlist", color: "text-red-500", bg: "bg-red-50" },
    { label: "Addresses", icon: MapPin, href: "/account/addresses", color: "text-green-500", bg: "bg-green-50" },
    { label: "Payment Methods", icon: CreditCard, href: "/account/payments", color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-12 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight">Dashboard</h1>
            <p className="text-gray-500">Manage your account and track your kicks.</p>
          </div>
          <div className="flex gap-4">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-red-500/20"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-red-600 font-bold transition-colors"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 h-fit">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-black mb-6 shadow-lg shadow-red-500/20">
                {user.fullName.charAt(0)}
              </div>
              <h2 className="text-2xl font-black">{user.fullName}</h2>
              <p className="text-gray-500 text-sm mb-6">{user.email}</p>
              
              <div className="w-full pt-6 border-t border-gray-100 flex justify-between text-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Orders</p>
                  <p className="font-black">12</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Items</p>
                  <p className="font-black">24</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Points</p>
                  <p className="font-black text-red-600">850</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Menu Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`${item.bg} ${item.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="font-black text-lg">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>

            {/* Recent Order Preview */}
            <div className="bg-black rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tight">Recent Order</h3>
                  <Link href="/account/orders" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                    View All
                  </Link>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gray-800 rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200"
                      alt="Order Item"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black uppercase tracking-widest text-red-500 mb-1">Delivered</p>
                    <h4 className="font-bold text-lg">Nike Revolution 6</h4>
                    <p className="text-gray-400 text-sm">Order #KM-10293 • KES 6,500</p>
                  </div>
                  <Link
                    href="/account/orders/KM-10293"
                    className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
