"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/lib/api";
import { useCartStore } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem, setCartOpen } = useCartStore();
  const [selectedSize, setSelectedSize] = useState("");

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
  });

  if (isLoading)
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (!product?.data)
    return <div className="container mx-auto px-4 py-8">Product not found</div>;

  const p = product.data;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const variant = p.variants?.find((v: any) => v.size === selectedSize);

    addItem({
      variantId: variant?.id,
      productId: p.id,
      name: p.name,
      size: selectedSize,
      price: Number(variant?.priceOverride || p.basePrice),
      quantity: 1,
      image: p.images?.[0] || "",
    });

    setCartOpen(true);
    toast.success("Added to cart!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={p.images?.[0] || "https://via.placeholder.com/600"}
            alt={p.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">{p.name}</h1>
          <p className="text-gray-500 mb-4">{p.brand}</p>
          <p className="text-2xl text-primary font-bold mb-6">
            KES {Number(p.basePrice).toLocaleString()}
          </p>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {p.variants?.map((v: any) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedSize(v.size)}
                  className={`px-4 py-2 border rounded-lg ${
                    selectedSize === v.size
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 hover:border-primary"
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark mb-4"
          >
            Add to Cart
          </button>

          <div className="text-gray-600 text-sm space-y-2">
            <p>✓ Free delivery in Nairobi & Mombasa</p>
            <p>✓ 7-day return policy</p>
            <p>✓ Original products guaranteed</p>
          </div>
        </div>
      </div>

      {p.description && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <p className="text-gray-600">{p.description}</p>
        </div>
      )}
    </div>
  );
}
