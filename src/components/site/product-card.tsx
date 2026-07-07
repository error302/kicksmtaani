"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import type { ProductDTO } from "@/lib/types";

interface Props {
  product: ProductDTO;
  onClick: () => void;
  index?: number;
}

function formatKes(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

export function ProductCard({ product, onClick, index = 0 }: Props) {
  const hasSale = product.compareAt && product.compareAt > product.basePrice;
  const discount = hasSale
    ? Math.round(
        ((product.compareAt! - product.basePrice) / product.compareAt!) * 100
      )
    : 0;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min((index % 8) * 0.04, 0.32) }}
      className="group text-left flex flex-col w-full"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="zoom-image h-full w-full object-cover"
        />
        {/* Hover image (second) */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-foreground text-background text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
              New
            </span>
          )}
          {hasSale && (
            <span className="bg-[var(--kenyan-red)] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick view hint */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="bg-background/95 backdrop-blur text-foreground text-center py-2.5 sm:py-3 text-xs sm:text-sm font-medium tracking-wide">
            Quick view
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 sm:pt-4 flex flex-col flex-1">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5">
          <span>{product.brandName}</span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-foreground text-foreground" />
            {product.rating.toFixed(1)}
          </span>
        </div>
        <h3 className="text-sm sm:text-base font-medium leading-snug text-foreground line-clamp-2 mb-2 group-hover:text-[var(--kenyan-red)] transition-colors">
          {product.name}
        </h3>

        {/* Colors */}
        <div className="flex items-center gap-1.5 mb-3">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c.name}
              className="h-3 w-3 rounded-full border border-border"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-muted-foreground">
              +{product.colors.length - 4}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-semibold text-foreground">
            {formatKes(product.basePrice)}
          </span>
          {hasSale && (
            <span className="text-xs text-muted-foreground line-through">
              {formatKes(product.compareAt!)}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
