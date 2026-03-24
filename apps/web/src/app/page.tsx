"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", "home"],
    queryFn: () => getProducts({ limit: 8 }),
  });

  const products = productsData?.data || [];

  const categories = [
    {
      name: "Men",
      slug: "MEN",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    },
    {
      name: "Women",
      slug: "WOMEN",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
    },
    {
      name: "Boys",
      slug: "BOYS",
      image:
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
    },
    {
      name: "Girls",
      slug: "GIRLS",
      image:
        "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400",
    },
    {
      name: "Kids",
      slug: "KIDS",
      image:
        "https://images.unsplash.com/photo-1595950653106-6c9eb2fad643?w=400",
    },
  ];

  return (
    <div>
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Premium Shoes for the{" "}
              <span className="text-primary">Whole Family</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Shop the best Nike, Adidas, and local brands. Free delivery in
              Nairobi & Mombasa.
            </p>
            <div className="flex gap-4">
              <Link
                href="/products"
                className="bg-primary px-6 py-3 rounded-lg font-medium hover:bg-primary-dark inline-flex items-center gap-2"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?category=KIDS"
                className="border border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-black"
              >
                Kids Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group"
              >
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-2">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <h3 className="font-medium text-center">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <Link href="/products" className="text-primary hover:underline">
              View All
            </Link>
          </div>
          {isLoading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-3">
                    <img
                      src={
                        product.images?.[0] || "https://via.placeholder.com/400"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm">{product.brand}</p>
                  <p className="text-primary font-semibold">
                    KES {Number(product.basePrice).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
