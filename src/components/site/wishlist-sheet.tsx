"use client";

import { Heart, X, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/lib/wishlist-store";
import type { ProductDTO } from "@/lib/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface Props {
  products: ProductDTO[];
  onProductClick: (p: ProductDTO) => void;
}

function formatKes(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

export function WishlistSheet({ products, onProductClick }: Props) {
  const { productIds, isWishlistOpen, setWishlistOpen, toggle, clearWishlist } =
    useWishlistStore();

  const wishlisted = products.filter((p) => productIds.includes(p.id));

  return (
    <Sheet open={isWishlistOpen} onOpenChange={setWishlistOpen}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-5 sm:px-6 py-4 border-b border-border flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-base sm:text-lg font-semibold tracking-display inline-flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Wishlist
            <span className="text-muted-foreground font-normal">
              ({wishlisted.length})
            </span>
          </SheetTitle>
          {wishlisted.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearWishlist}
              className="text-xs text-muted-foreground hover:text-[var(--kenyan-red)]"
            >
              Clear all
            </Button>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4">
          {wishlisted.length === 0 ? (
            <div className="text-center py-20">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
                <Heart className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1.5">Your wishlist is empty</p>
              <p className="text-sm text-muted-foreground mb-6">
                Tap the heart on any sneaker to save it here.
              </p>
              <button
                onClick={() => setWishlistOpen(false)}
                className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors min-h-[44px]"
              >
                Discover sneakers
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {wishlisted.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <button
                    onClick={() => {
                      setWishlistOpen(false);
                      onProductClick(item);
                    }}
                    className="h-24 w-20 sm:w-24 flex-shrink-0 overflow-hidden bg-muted"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </button>
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                          {item.brandName}
                        </p>
                        <h4 className="text-sm font-medium leading-snug line-clamp-2">
                          {item.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => toggle(item.id)}
                        className="text-muted-foreground hover:text-[var(--kenyan-red)] transition-colors -mt-1 -mr-1 p-1"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.colors[0]?.name}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-sm font-semibold">
                        {formatKes(item.basePrice)}
                      </span>
                      <button
                        onClick={() => {
                          setWishlistOpen(false);
                          onProductClick(item);
                        }}
                        className="text-xs font-medium underline hover:text-[var(--kenyan-red)] transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
