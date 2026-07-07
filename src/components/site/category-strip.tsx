"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";

interface Props {
  activeCategory: Category | "ALL";
  onSelect: (c: Category | "ALL") => void;
}

const CATS: { id: Category | "ALL"; label: string; description: string; image: string }[] = [
  { id: "ALL", label: "All", description: "Every silhouette in one place", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80" },
  { id: "MEN", label: "Men", description: "Heritage icons and modern heat", image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=900&q=80" },
  { id: "WOMEN", label: "Women", description: "Curated for the discerning", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=80" },
  { id: "UNISEX", label: "Unisex", description: "For everyone, every fit", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&q=80" },
  { id: "KIDS", label: "Kids", description: "The next generation's rotation", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80" },
];

export function CategoryStrip({ activeCategory, onSelect }: Props) {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-foreground/40" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Shop by
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tightest">
              Find your fit.
            </h2>
          </div>
          <a
            href="#product-grid"
            className="text-sm font-medium text-foreground hover:text-[var(--kenyan-red)] transition-colors inline-flex items-center gap-1"
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATS.map((cat, idx) => {
            const active = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className={`group relative aspect-[3/4] overflow-hidden bg-foreground text-background text-left ${
                  active ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-50 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/30 to-transparent" />
                <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end">
                  <h3 className="text-lg sm:text-2xl font-semibold tracking-display">
                    {cat.label}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-background/70 leading-tight mt-1 max-w-[90%]">
                    {cat.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
