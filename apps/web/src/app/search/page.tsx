"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "@/lib/api";
import { Search } from "lucide-react";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const { data, isLoading } = useQuery({
    queryKey: ["search", initialQuery],
    queryFn: () => searchProducts(initialQuery),
    enabled: initialQuery.length > 0,
  });

  const results = data?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Products</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for shoes..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark"
          >
            Search
          </button>
        </div>
      </form>

      {initialQuery && (
        <p className="text-gray-500 mb-6">
          {isLoading
            ? "Searching..."
            : `${results.length} results for "${initialQuery}"`}
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {results.map((product: any) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group"
            >
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-3">
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/400"}
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

      {initialQuery && !isLoading && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No products found for &quot;{initialQuery}&quot;
          </p>
          <Link href="/products" className="text-primary hover:underline">
            Browse all products
          </Link>
        </div>
      )}
    </div>
  );
}
