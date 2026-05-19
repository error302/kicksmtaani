"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Package, ChevronRight, Clock, CheckCircle2, Truck, AlertCircle, ArrowLeft } from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) return null;

  const orders = ordersData?.data || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="w-5 h-5 text-amber-500" />;
      case "CONFIRMED": return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case "SHIPPED": return <Truck className="w-5 h-5 text-purple-500" />;
      case "DELIVERED": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "CANCELLED": return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-50 text-amber-700 border-amber-100";
      case "CONFIRMED": return "bg-blue-50 text-blue-700 border-blue-100";
      case "SHIPPED": return "bg-purple-50 text-purple-700 border-purple-100";
      case "DELIVERED": return "bg-green-50 text-green-700 border-green-100";
      case "CANCELLED": return "bg-red-50 text-red-700 border-red-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-black font-bold mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>

          <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Order History</h1>
          <p className="text-gray-500 mb-12">Track and manage your sneaker purchases.</p>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order: any) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-4 rounded-2xl">
                        <Package className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-black text-lg">Order #{order.orderNumber}</h3>
                        <p className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${getStatusBg(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex -space-x-3">
                      {order.items?.slice(0, 3).map((item: any, i: number) => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-sm">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="w-12 h-12 rounded-full border-4 border-white bg-black text-white text-[10px] font-bold flex items-center justify-center">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Total</p>
                        <p className="font-black text-xl">KES {Number(order.totalAmount).toLocaleString()}</p>
                      </div>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="bg-black text-white p-4 rounded-2xl hover:bg-red-600 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-gray-500 mb-8">Your order history will appear here once you make a purchase.</p>
              <Link
                href="/products"
                className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-red-600 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
