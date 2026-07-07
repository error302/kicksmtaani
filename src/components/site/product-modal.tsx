"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Star, Minus, Plus, ShoppingBag, Truck, Shield, RotateCcw } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";

interface Props {
  product: ProductDTO | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

function formatKes(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

export function ProductModal({ product, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] sm:w-[90vw] p-0 max-h-[92vh] overflow-hidden gap-0">
        <DialogTitle className="sr-only">
          {product?.name ?? "Product details"}
        </DialogTitle>
        {product && (
          <ProductModalBody
            key={product.id}
            product={product}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ProductModalBody({
  product,
  onClose,
}: {
  product: ProductDTO;
  onClose: () => void;
}) {
  // State initialized once per product (component remounts via key when product changes)
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(product.colors[0]?.name ?? null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  const hasSale = product.compareAt && product.compareAt > product.basePrice;

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

  return (
    <div className="grid md:grid-cols-2 max-h-[92vh] overflow-y-auto">
      {/* Left — image gallery */}
      <div className="bg-muted relative">
        <div className="aspect-square md:aspect-auto md:h-full md:min-h-[500px] relative overflow-hidden">
          <img
            src={product.images[activeImg]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
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
      <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {product.brandName}
          </span>
          <div className="flex items-center gap-1.5">
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
        </div>

        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tightest leading-tight mb-4">
          {product.name}
        </h2>

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

        <div className="flex items-stretch gap-3 mb-6 mt-auto">
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

        <div className="grid grid-cols-3 gap-3 pt-5 border-t border-border text-center">
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
  );
}
