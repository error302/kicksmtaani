"use client";

import Link from "next/link";
import { useWishlistStore } from "@/lib/store";
import { Heart, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <Link href="/products" className="text-primary hover:underline">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              <Link href={`/products/${item.slug}`}>
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-3">
                  <img
                    src={item.image || "https://via.placeholder.com/400"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.brand}</p>
                <p className="text-primary font-semibold">
                  KES {item.price.toLocaleString()}
                </p>
              </Link>
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
