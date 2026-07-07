"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./product-card";
import type { ProductDTO, Category } from "@/lib/types";

interface Props {
  products: ProductDTO[];
  category: Category | "ALL";
  brandSlug: string;
  sort: string;
  search: string;
  onProductClick: (p: ProductDTO) => void;
  onClearFilters: () => void;
}

function formatKes(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

const SORT_LABELS: Record<string, string> = {
  new: "Newest",
  "price-asc": "Price · Low to High",
  "price-desc": "Price · High to Low",
  rating: "Top Rated",
};

export function ProductGrid({
  products,
  category,
  brandSlug,
  sort,
  search,
  onProductClick,
  onClearFilters,
}: Props) {
  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "ALL") list = list.filter((p) => p.category === category);
    if (brandSlug) list = list.filter((p) => p.brandSlug === brandSlug);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-desc":
        list.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // newest first — already in createdAt desc order
        break;
    }
    return list;
  }, [products, category, brandSlug, sort, search]);

  const hasFilters = category !== "ALL" || brandSlug || search;

  return (
    <section
      id="product-grid"
      className="py-12 sm:py-16 lg:py-24 bg-background scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-foreground/40" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                The Collection
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tightest leading-tight">
              {brandSlug
                ? `By ${products.find((p) => p.brandSlug === brandSlug)?.brandName ?? "Brand"}`
                : category === "ALL"
                ? "All sneakers"
                : category.charAt(0) + category.slice(1).toLowerCase() + "'s collection"}
            </h2>
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "product" : "products"}
            {hasFilters && (
              <button
                onClick={onClearFilters}
                className="ml-3 text-[var(--kenyan-red)] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Active filter chip */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {brandSlug && (
              <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-foreground text-background">
                {products.find((p) => p.brandSlug === brandSlug)?.brandName}
                <button
                  onClick={onClearFilters}
                  aria-label="Clear"
                  className="hover:opacity-70"
                >
                  ×
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-foreground text-background">
                &ldquo;{search}&rdquo;
                <button
                  onClick={onClearFilters}
                  aria-label="Clear"
                  className="hover:opacity-70"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 sm:py-32 border border-border"
            >
              <p className="text-2xl sm:text-3xl font-semibold tracking-display mb-3">
                Nothing matches just yet.
              </p>
              <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
                Try a different category or clear your filters to see the full
                collection.
              </p>
              <button
                onClick={onClearFilters}
                className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors min-h-[44px]"
              >
                View all sneakers
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${category}-${brandSlug}-${sort}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14"
            >
              {filtered.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  onClick={() => onProductClick(p)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
