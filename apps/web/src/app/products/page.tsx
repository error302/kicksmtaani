"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const { data, isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: () => getProducts({ category }),
  });

  const products = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {category ? `${category} Shoes` : "All Products"}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-4">Filters</h3>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Category</h4>
              <div className="space-y-2">
                {["MEN", "WOMEN", "BOYS", "GIRLS", "KIDS"].map((cat) => (
                  <Link
                    key={cat}
                    href={`/products?category=${cat}`}
                    className={`block text-sm ${category === cat ? "text-primary font-medium" : "text-gray-600"}`}
                  >
                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}
