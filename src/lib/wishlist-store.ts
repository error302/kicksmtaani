"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: string[];
  isWishlistOpen: boolean;
  // recently viewed (max 8, most recent first)
  recentIds: string[];
  // actions
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clearWishlist: () => void;
  setWishlistOpen: (open: boolean) => void;
  trackView: (productId: string) => void;
  clearRecent: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      isWishlistOpen: false,
      recentIds: [],

      toggle: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId],
        })),

      has: (productId) => get().productIds.includes(productId),

      clearWishlist: () => set({ productIds: [] }),
      setWishlistOpen: (open) => set({ isWishlistOpen: open }),

      trackView: (productId) =>
        set((state) => ({
          recentIds: [
            productId,
            ...state.recentIds.filter((id) => id !== productId),
          ].slice(0, 8),
        })),

      clearRecent: () => set({ recentIds: [] }),
    }),
    { name: "kicksmtaani-wishlist" }
  )
);
