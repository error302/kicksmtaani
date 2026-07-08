"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  Heart,
} from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { toast } from "sonner";
import { RelatedProducts } from "./related-products";

interface Props {
  product: ProductDTO | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  allProducts: ProductDTO[];
  onNavigateProduct: (p: ProductDTO) => void;
}

function formatKes(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

export function ProductModal({
  product,
  open,
  onOpenChange,
  allProducts,
  onNavigateProduct,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] sm:w-[90vw] p-0 max-h-[92vh] overflow-hidden gap-0">
        <DialogTitle className="sr-only">
          {product?.name ?? "Product details"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          View product details, select size and color, and add to your bag.
        </DialogDescription>
        {product && (
          <ProductModalBody
            key={product.id}
            product={product}
            allProducts={allProducts}
            onClose={() => onOpenChange(false)}
            onNavigateProduct={onNavigateProduct}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ProductModalBody({
  product,
  allProducts,
  onClose,
  onNavigateProduct,
}: {
  product: ProductDTO;
  allProducts: ProductDTO[];
  onClose: () => void;
  onNavigateProduct: (p: ProductDTO) => void;
}) {
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(product.colors[0]?.name ?? null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const isWishlisted = has(product.id);

  const hasSale = product.compareAt && product.compareAt > product.basePrice;

  // Related: same brand first, then same category, exclude current
  const related: ProductDTO[] = [
    ...allProducts.filter((p) => p.brandId === product.brandId && p.id !== product.id),
    ...allProducts.filter(
      (p) => p.category === product.category && p.brandId !== product.brandId && p.id !== product.id
    ),
  ].slice(0, 8);

  const handleAdd = () => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    if (!color) {
      toast.error("Please select a color");
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brandName: product.brandName,
      image: product.images[0],
      size,
      color,
      price: product.basePrice,
      quantity: qty,
    });
    toast.success("Added to bag");
    onClose();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgWrapRef.current) return;
    const rect = imgWrapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ active: true, x, y });
  };

  return (
    <div className="flex flex-col max-h-[92vh]">
      <div className="grid md:grid-cols-2 overflow-y-auto">
        {/* Left — image gallery with zoom */}
        <div
          className="bg-muted relative"
          onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
        >
          <div
            ref={imgWrapRef}
            onMouseMove={handleMouseMove}
            className="aspect-square md:aspect-auto md:h-full md:min-h-[500px] relative overflow-hidden cursor-zoom-in"
          >
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-200"
              style={
                zoom.active
                  ? {
                      transformOrigin: `${zoom.x}% ${zoom.y}%`,
                      transform: "scale(1.8)",
                    }
                  : undefined
              }
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
              {product.isNew && (
                <span className="bg-foreground text-background text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
                  New
                </span>
              )}
              {hasSale && (
                <span className="bg-[var(--kenyan-red)] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
                  Sale
                </span>
              )}
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 h-14 w-14 sm:h-16 sm:w-16 overflow-hidden border-2 transition-colors ${
                    i === activeImg
                      ? "border-foreground"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — details */}
        <div className="p-5 sm:p-8 lg:p-10 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {product.brandName}
            </span>
            <button
              onClick={() => {
                toggle(product.id);
                toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`h-9 w-9 rounded-full flex items-center justify-center border transition-all ${
                isWishlisted
                  ? "bg-[var(--kenyan-red)] border-[var(--kenyan-red)] text-white"
                  : "border-border hover:border-foreground"
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tightest leading-tight flex-1">
              {product.name}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 mb-4">
            <div className="flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(product.rating)
                      ? "fill-foreground text-foreground"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating.toFixed(1)} · {product.reviewCount} reviews
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-semibold">
              {formatKes(product.basePrice)}
            </span>
            {hasSale && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  {formatKes(product.compareAt!)}
                </span>
                <span className="text-xs font-medium text-[var(--kenyan-red)] uppercase tracking-wider">
                  Save {formatKes(product.compareAt! - product.basePrice)}
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Colors */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-medium uppercase tracking-wider text-foreground">
                Color
              </span>
              <span className="text-xs text-muted-foreground">{color}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  className={`h-9 w-9 rounded-full border-2 transition-all ${
                    color === c.name
                      ? "border-foreground ring-2 ring-foreground/20 ring-offset-2 ring-offset-background"
                      : "border-border hover:border-foreground/50"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-medium uppercase tracking-wider text-foreground">
                Size · EU
              </span>
              <a
                href="#"
                className="text-xs text-muted-foreground underline hover:text-foreground"
              >
                Size guide
              </a>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-11 text-sm font-medium border transition-all ${
                    size === s
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop quantity + add to bag */}
          <div className="hidden sm:flex items-stretch gap-3 mb-6 mt-auto">
            <div className="flex items-center border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-12 w-12 flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="h-12 w-12 flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 h-12 bg-foreground text-background text-sm font-semibold tracking-wide hover:bg-foreground/90 transition-colors inline-flex items-center justify-center gap-2 min-h-[48px]"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to bag — {formatKes(product.basePrice * qty)}
            </button>
          </div>

          {/* Trust strip */}
          <div className="hidden sm:grid grid-cols-3 gap-3 pt-5 border-t border-border text-center">
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                Free delivery
                <br />
                Nairobi & Mombasa
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                100% authentic
                <br />
                Verified originals
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                7-day
                <br />
                Easy returns
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related products (desktop inside modal) */}
      {related.length > 0 && (
        <div className="hidden md:block border-t border-border">
          <RelatedProducts
            title="You may also like"
            products={related}
            onProductClick={onNavigateProduct}
          />
        </div>
      )}

      {/* Sticky mobile add-to-bag bar */}
      <div className="sm:hidden sticky bottom-0 left-0 right-0 bg-background border-t border-border p-3 flex items-center gap-3 safe-bottom z-10">
        <div className="flex items-center border border-border">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-10 w-10 flex items-center justify-center"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="h-10 w-10 flex items-center justify-center"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          onClick={handleAdd}
          className="flex-1 h-12 bg-foreground text-background text-sm font-semibold tracking-wide inline-flex items-center justify-center gap-2 min-h-[48px]"
        >
          <ShoppingBag className="h-4 w-4" />
          {formatKes(product.basePrice * qty)}
        </button>
      </div>
    </div>
  );
}
