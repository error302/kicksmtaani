"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => api.get(`/orders/${orderId}`).then((r) => r.data),
  });

  const order = data?.data;

  if (isLoading)
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (!order)
    return <div className="container mx-auto px-4 py-8">Order not found</div>;

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/account/orders"
        className="text-primary hover:underline mb-6 inline-block"
      >
        ← Back to Orders
      </Link>

      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
            <p className="text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status] || "bg-gray-100"}`}
          >
            {order.status}
          </span>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Delivery Address</h3>
          <p>{order.deliveryAddress?.name}</p>
          <p>{order.deliveryAddress?.phone}</p>
          <p>
            {order.deliveryAddress?.area}, {order.deliveryAddress?.city}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-bold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items?.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-3 border-b last:border-0"
            >
              <div>
                <p className="font-medium">
                  {item.variant?.product?.name || "Product"}
                </p>
                <p className="text-sm text-gray-500">
                  Size: {item.variant?.size} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold">
                KES {(Number(item.price) * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>KES {Number(order.totalAmount).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
