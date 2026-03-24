"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/api";
import Link from "next/link";

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const orders = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Link href="/products" className="text-primary hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === "DELIVERED"
                      ? "bg-green-100 text-green-700"
                      : order.status === "SHIPPED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  KES {Number(order.totalAmount).toLocaleString()}
                </span>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="text-primary hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
