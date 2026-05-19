"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getBrands } from "@/lib/api";
import { Filter, ChevronDown, SlidersHorizontal, X, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const sort = searchParams.get("sort") || "";
  const [mobileFilters, setMobileFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["products", category, brand, sort],
    queryFn: () => getProducts({ category, brand, sort, limit: 50 }),
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const products = data?.data || [];
  const brands = brandsData?.data || [];
  const categories = ["MEN", "WOMEN", "BOYS", "GIRLS", "KIDS"];

  const buildHref = (overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    const current = { category, brand, sort, ...overrides };
    Object.entries(current).forEach(([k, v]) => { if (v) params.set(k, v); });
    return `/products?${params.toString()}`;
  };

  const activeFilters = [category, brand].filter(Boolean);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-black text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            {category || "All"} <span className="text-red-500">Kicks</span>
          </h1>
          <p className="text-gray-400 text-lg mt-2">
            {brand ? `${brand} Collection` : "Browse the entire SneakRoom collection"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFilters(true)}
            className="lg:hidden flex items-center justify-center gap-2 bg-white p-4 rounded-2xl shadow-sm font-bold"
          >
            <Filter className="w-5 h-5" /> Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
          </button>

          {/* Sidebar */}
          <aside className={`
            fixed inset-0 z-50 bg-white p-8 lg:relative lg:inset-auto lg:z-0 lg:bg-transparent lg:p-0 lg:w-64 flex-shrink-0 transition-transform
            ${mobileFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}>
            <div className="flex items-center justify-between lg:hidden mb-8">
              <h2 className="text-xl font-black uppercase">Filters</h2>
              <button onClick={() => setMobileFilters(false)}><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Category</h3>
                <div className="space-y-1">
                  <Link
                    href="/products"
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${!category ? "bg-black text-white" : "hover:bg-gray-100"}`}
                  >
                    All Categories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={buildHref({ category: category === cat ? "" : cat })}
                      className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${category === cat ? "bg-black text-white" : "hover:bg-gray-100"}`}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Brand</h3>
                <div className="space-y-1">
                  {brands.map((b: string) => (
                    <Link
                      key={b}
                      href={buildHref({ brand: brand === b ? "" : b })}
                      className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${brand === b ? "bg-black text-white" : "hover:bg-gray-100"}`}
                    >
                      {b}
                    </Link>
                  ))}
                </div>
              </div>

              {activeFilters.length > 0 && (
                <Link href="/products" className="block text-center py-3 text-sm font-bold text-red-500 hover:text-red-700 transition-colors">
                  Clear All Filters
                </Link>
              )}
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-500 text-sm font-medium">
                {isLoading ? "Loading..." : `${products.length} products`}
              </p>
              <div className="relative group">
                <button className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl shadow-sm text-sm font-bold">
                  <SlidersHorizontal className="w-4 h-4" /> Sort
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                  {[
                    { label: "Newest First", value: "createdAt:desc" },
                    { label: "Price: Low → High", value: "basePrice:asc" },
                    { label: "Price: High → Low", value: "basePrice:desc" },
                  ].map((opt) => (
                    <Link
                      key={opt.value}
                      href={buildHref({ sort: opt.value })}
                      className="block px-5 py-3 text-sm hover:bg-gray-50 transition-colors"
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-gray-200 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="aspect-[4/5] overflow-hidden relative">
                      <img
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-md text-black text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                          {product.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-white/90 backdrop-blur-md py-3 px-5 rounded-2xl flex items-center justify-between">
                          <span className="text-sm font-bold">Quick View</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-red-500 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-400 text-xs mb-3 uppercase tracking-widest">{product.brand}</p>
                      <p className="text-black font-black text-xl">
                        <span className="text-xs font-normal text-gray-400 mr-1">KES</span>
                        {Number(product.basePrice).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-2xl font-black mb-2">No kicks found</h2>
                <p className="text-gray-500 mb-8">Try adjusting your filters.</p>
                <Link href="/products" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-red-600 transition-colors">
                  View All Products
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
