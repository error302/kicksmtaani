"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { createOrder } from "@/lib/api";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const order = await createOrder({
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        deliveryAddress: {
          name: formData.get("name"),
          phone: formData.get("phone"),
          area: formData.get("area"),
          city: formData.get("city"),
          notes: formData.get("notes"),
        },
        paymentProvider: "MPESA",
        phoneNumber: formData.get("phone"),
      });

      clearCart();
      router.push(`/checkout/success?order=${order.data.orderNumber}`);
    } catch (err) {
      toast.error("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <a href="/products" className="text-primary hover:underline">
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-semibold text-lg">Delivery Details</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Area</label>
            <input
              type="text"
              name="area"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <h2 className="font-semibold text-lg pt-4">Payment Method</h2>
          <div className="flex items-center gap-2 p-4 border rounded-lg">
            <input
              type="radio"
              name="payment"
              value="MPESA"
              defaultChecked
              className="text-primary"
            />
            <span>M-Pesa STK Push</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : `Place Order - KES ${getTotal().toLocaleString()}`}
          </button>
        </form>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.variantId} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Size: {item.size} x {item.quantity}
                  </p>
                </div>
                <p>KES {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>KES {getTotal().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
