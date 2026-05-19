"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { CreditCard, ArrowLeft, Smartphone } from "lucide-react";
import Link from "next/link";

export default function PaymentsPage() {
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
            <h1 className="text-3xl font-black uppercase tracking-tight">Payment Methods</h1>
            <p className="text-gray-500">Manage your payment options.</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* M-Pesa Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Smartphone className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-green-200 mb-1">M-Pesa</p>
                <p className="text-2xl font-black">STK Push</p>
                <p className="text-green-200 text-sm">Pay directly from your phone at checkout</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Card Payments</h3>
                <p className="text-gray-500 text-sm">Coming soon via Flutterwave</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              We&apos;re working on adding Visa and Mastercard support. For now, M-Pesa is the fastest and most secure way to pay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
