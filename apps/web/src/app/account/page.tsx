"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { Package, User } from "lucide-react";

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Account</h1>

      <div className="grid md:grid-cols-4 gap-8">
        <nav className="space-y-2">
          <Link
            href="/account"
            className="block p-3 bg-primary text-white rounded-lg"
          >
            Dashboard
          </Link>
          <Link
            href="/account/orders"
            className="block p-3 hover:bg-gray-100 rounded-lg"
          >
            My Orders
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left p-3 hover:bg-gray-100 rounded-lg text-red-500"
          >
            Logout
          </button>
        </nav>

        <div className="md:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="font-semibold text-lg mb-4">
              Welcome, {user.fullName}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phone}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/account/orders"
                className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100"
              >
                <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
                <span>View Orders</span>
              </Link>
              <Link
                href="/products"
                className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100"
              >
                <User className="w-8 h-8 mx-auto mb-2 text-primary" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
