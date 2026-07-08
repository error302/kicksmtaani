"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isCheckout: boolean;
  shippingThreshold?: number;
  shippingFee?: number;
  // actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, qty: number) => void;
  clear: () => void;
  setCartOpen: (open: boolean) => void;
  setCheckout: (v: boolean) => void;
  setShippingConfig: (threshold: number, fee: number) => void;
  // selectors
  getTotalItems: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getTotal: () => number;
}

const key = (i: CartItem) => `${i.productId}|${i.size}|${i.color}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isCheckout: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => key(i) === key(item));
          if (existing) {
            return {
              items: state.items.map((i) =>
                key(i) === key(item)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              isOpen: true,
              isCheckout: false,
            };
          }
          return { items: [...state.items, item], isOpen: true, isCheckout: false };
        }),

      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.size === size && i.color === color)
          ),
        })),

      updateQuantity: (productId, size, color, qty) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId && i.size === size && i.color === color
                ? { ...i, quantity: Math.max(0, qty) }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [], isCheckout: false }),

      setCartOpen: (open) => set({ isOpen: open, isCheckout: open ? get().isCheckout : false }),
      setCheckout: (v) => set({ isCheckout: v }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getShipping: () => {
        const threshold = (get() as any).shippingThreshold ?? 15000;
        const fee = (get() as any).shippingFee ?? 350;
        return get().getSubtotal() >= threshold ? 0 : fee;
      },
      getTotal: () => get().getSubtotal() + get().getShipping(),
      setShippingConfig: (threshold: number, fee: number) =>
        set({ shippingThreshold: threshold, shippingFee: fee } as any),
    }),
    { name: "kicksmtaani-cart" }
  )
);
