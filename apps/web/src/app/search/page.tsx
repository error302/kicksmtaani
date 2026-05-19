"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { searchProducts, getBrands } from "@/lib/api";
import { Search, Filter, SlidersHorizontal, X, ChevronDown } from "lucide-react";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "createdAt:desc";

  const [searchInput, setSearchInput] = useState(query);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", query, category, brand, minPrice, maxPrice, sort],
    queryFn: () => searchProducts(query, { category, brand, minPrice, maxPrice, sort }),
    enabled: true,
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const results = searchResults?.data || [];
  const brands = brandsData?.data || [];

  const updateFilters = (newFilters: any) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value as string);
      else params.delete(key);
    });
    router.push(`/search?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchInput });
  };

  const categories = ["MEN", "WOMEN", "BOYS", "GIRLS", "KIDS"];
  const sortOptions = [
    { label: "Newest Arrivals", value: "createdAt:desc" },
    { label: "Price: Low to High", value: "basePrice:asc" },
    { label: "Price: High to Low", value: "basePrice:desc" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for your next pair of kicks..."
              className="w-full pl-16 pr-6 py-5 bg-white shadow-2xl shadow-gray-200/50 rounded-3xl text-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 bg-white p-4 rounded-xl shadow-sm font-bold"
          >
            <Filter className="w-5 h-5" /> Filters
          </button>

          {/* Sidebar Filters */}
          <aside className={`
            fixed inset-0 z-50 bg-white p-6 lg:relative lg:inset-auto lg:z-0 lg:bg-transparent lg:p-0 lg:w-64 transition-transform
            ${isFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}>
            <div className="flex items-center justify-between lg:hidden mb-8">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-8">
              {/* Category */}
              <div>
                <h3 className="font-black uppercase tracking-wider text-xs text-gray-400 mb-4">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateFilters({ category: category === cat ? "" : cat })}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                        category === cat ? "bg-black text-white font-bold" : "hover:bg-gray-200 text-gray-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <h3 className="font-black uppercase tracking-wider text-xs text-gray-400 mb-4">Brand</h3>
                <div className="space-y-2">
                  {brands.map((b: string) => (
                    <button
                      key={b}
                      onClick={() => updateFilters({ brand: brand === b ? "" : b })}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                        brand === b ? "bg-black text-white font-bold" : "hover:bg-gray-200 text-gray-600"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-black uppercase tracking-wider text-xs text-gray-400 mb-4">Price Range (KES)</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => updateFilters({ minPrice: e.target.value })}
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <button
                onClick={() => router.push("/search")}
                className="w-full py-3 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sorting & Stats */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-500 text-sm">
                {isLoading ? "Searching..." : `${results.length} results found`}
              </p>
              
              <div className="relative group">
                <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm text-sm font-medium">
                  <SlidersHorizontal className="w-4 h-4" />
                  {sortOptions.find(o => o.value === sort)?.label || "Sort By"}
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateFilters({ sort: opt.value })}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-gray-200 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {results.map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <div className="aspect-[4/5] overflow-hidden relative">
                      <img
                        src={product.images?.[0] || "https://via.placeholder.com/400"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/10 backdrop-blur-md text-black text-[10px] font-black px-2 py-1 rounded-full uppercase">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-red-500 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-xs mb-3 uppercase tracking-widest">{product.brand}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-black font-black text-xl">
                          <span className="text-xs font-normal text-gray-400 mr-1">KES</span>
                          {Number(product.basePrice).toLocaleString()}
                        </p>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                          <ChevronDown className="w-4 h-4 -rotate-90" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No kicks found</h2>
                <p className="text-gray-500 mb-8">Try adjusting your filters or search for something else.</p>
                <button
                  onClick={() => router.push("/search")}
                  className="bg-black text-white px-8 py-3 rounded-full font-bold"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
