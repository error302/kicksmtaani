"use client";

import { ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { ProductDTO } from "@/lib/types";

interface Props {
  title: string;
  products: ProductDTO[];
  onProductClick: (p: ProductDTO) => void;
}

export function RelatedProducts({ title, products, onProductClick }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  return (
    <div className="border-t border-border px-5 sm:px-8 lg:px-10 py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base font-semibold uppercase tracking-wider">
          {title}
        </h3>
        <button
          onClick={scrollRight}
          aria-label="See more"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          More
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar -mx-1 px-1 pb-2"
      >
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => onProductClick(p)}
            className="flex-shrink-0 w-32 sm:w-40 text-left group"
          >
            <div className="relative aspect-square overflow-hidden bg-muted mb-2">
              <img
                src={p.images[0]}
                alt={p.name}
                loading="lazy"
                className="zoom-image h-full w-full object-cover"
              />
            </div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {p.brandName}
            </p>
            <p className="text-xs sm:text-sm font-medium line-clamp-1 group-hover:text-[var(--kenyan-red)] transition-colors">
              {p.name}
            </p>
            <p className="text-xs font-semibold mt-1">
              KES {p.basePrice.toLocaleString("en-KE")}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
