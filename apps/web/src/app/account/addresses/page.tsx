"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { MapPin, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddressesPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) router.push("/auth/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">Addresses</h1>
            <p className="text-gray-500">Manage your delivery addresses.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-12 shadow-xl shadow-gray-200/50 border border-gray-100 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-black mb-2">No Saved Addresses</h2>
          <p className="text-gray-500 mb-8">Add a delivery address to speed up checkout.</p>
          <button className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-colors">
            <Plus className="w-5 h-5" /> Add Address
          </button>
        </div>
      </div>
    </div>
  );
}
