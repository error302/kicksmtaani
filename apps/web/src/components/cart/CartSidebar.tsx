"use client";

import { useCartStore } from "@/lib/store";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export function CartSidebar() {
  const { items, isOpen, setCartOpen, updateQuantity, removeItem, getTotal } =
    useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setCartOpen(false)}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button
              onClick={() => setCartOpen(false)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Your cart is empty
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-gray-500 text-sm">Size: {item.size}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="font-medium">
                          KES {item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t p-4">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-lg font-semibold">
                  KES {getTotal().toLocaleString()}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="block w-full bg-primary text-white text-center py-3 rounded-lg font-medium hover:bg-primary-dark"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
