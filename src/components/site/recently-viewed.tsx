"use client";

import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/lib/wishlist-store";
import type { ProductDTO } from "@/lib/types";
import { ProductCard } from "./product-card";

interface Props {
  products: ProductDTO[];
  onProductClick: (p: ProductDTO) => void;
}

export function RecentlyViewed({ products, onProductClick }: Props) {
  const recentIds = useWishlistStore((s) => s.recentIds);
  const recent = recentIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is ProductDTO => Boolean(p));

  if (recent.length < 2) return null; // don't show with just 1 item

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-secondary/30 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tightest">
                Recently viewed
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pick up where you left off
              </p>
            </div>
          </div>
          <a
            href="#product-grid"
            className="text-xs sm:text-sm font-medium text-foreground hover:text-[var(--kenyan-red)] transition-colors inline-flex items-center gap-1"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
          {recent.slice(0, 4).map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              onClick={() => onProductClick(p)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
