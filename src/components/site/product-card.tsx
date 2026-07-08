"use client";

import { Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { ProductDTO } from "@/lib/types";
import { useWishlistStore } from "@/lib/wishlist-store";

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
  const { toggle, has } = useWishlistStore();
  const isWishlisted = has(product.id);
  const discount = hasSale
    ? Math.round(
        ((product.compareAt! - product.basePrice) / product.compareAt!) * 100
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min((index % 8) * 0.04, 0.32) }}
      className="group text-left flex flex-col w-full"
    >
      {/* Image area — clickable via a positioned button overlay, with wishlist heart as sibling */}
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
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
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

        {/* Clickable overlay for the whole card (opens quick view) */}
        <button
          type="button"
          onClick={onClick}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 h-full w-full z-[1]"
        />

        {/* Wishlist heart — sibling button (not nested inside the overlay button) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggle(product.id);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 z-[2] h-9 w-9 rounded-full flex items-center justify-center transition-all backdrop-blur-md ${
            isWishlisted
              ? "bg-[var(--kenyan-red)] text-white"
              : "bg-background/70 text-foreground hover:bg-background"
          }`}
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
          />
        </button>

        {/* Quick view hint */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
          <div className="bg-background/95 backdrop-blur text-foreground text-center py-2.5 sm:py-3 text-xs sm:text-sm font-medium tracking-wide">
            Quick view
          </div>
        </div>
      </div>

      {/* Info — also clickable */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`View ${product.name}`}
        className="pt-3 sm:pt-4 flex flex-col flex-1 text-left cursor-pointer"
      >
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
      </button>
    </motion.div>
  );
}
