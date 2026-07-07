"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/store";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Check, Truck } from "lucide-react";
import { toast } from "sonner";
import type { OrderPayload } from "@/lib/types";

function formatKes(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

type Step = "cart" | "checkout" | "success";

export function CartSheet() {
  const {
    items,
    isOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
    clear,
    isCheckout,
    setCheckout,
    getSubtotal,
    getShipping,
    getTotal,
  } = useCartStore();

  const [placing, setPlacing] = useState(false);
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    city: "",
    notes: "",
    paymentMethod: "MPESA" as "MPESA" | "CARD" | "CASH",
  });

  const step: Step = orderNo ? "success" : isCheckout ? "checkout" : "cart";

  const close = () => {
    setCartOpen(false);
    // small delay so animation finishes before resetting state
    setTimeout(() => {
      setCheckout(false);
      setOrderNo(null);
    }, 250);
  };

  const handleCheckout = async () => {
    if (
      !form.email ||
      !form.phone ||
      !form.fullName ||
      !form.address ||
      !form.city
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    setPlacing(true);
    const payload: OrderPayload = {
      ...form,
      items,
      subtotal: getSubtotal(),
      shipping: getShipping(),
      total: getTotal(),
    };
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        setOrderNo(data.orderNumber);
        clear();
        toast.success("Order placed!");
      } else {
        toast.error(data.error || "Could not place order");
      }
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(v) => (v ? setCartOpen(true) : close())}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-5 sm:px-6 py-4 border-b border-border flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-base sm:text-lg font-semibold tracking-display">
            {step === "cart" && (
              <span className="inline-flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Your Bag
                <span className="text-muted-foreground font-normal">
                  ({items.reduce((n, i) => n + i.quantity, 0)})
                </span>
              </span>
            )}
            {step === "checkout" && (
              <button
                onClick={() => setCheckout(false)}
                className="inline-flex items-center gap-2 text-base font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to bag
              </button>
            )}
            {step === "success" && "Order confirmed"}
          </SheetTitle>
        </SheetHeader>

        {/* ==================== CART STEP ==================== */}
        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
                    <ShoppingBag className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="font-medium mb-1.5">Your bag is empty</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Discover the latest from 25+ premium brands.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors min-h-[44px]"
                  >
                    Start shopping
                  </button>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => (
                    <li
                      key={`${item.productId}-${item.size}-${item.color}`}
                      className="flex gap-4"
                    >
                      <div className="h-24 w-20 sm:w-24 flex-shrink-0 overflow-hidden bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
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
                            onClick={() =>
                              removeItem(item.productId, item.size, item.color)
                            }
                            className="text-muted-foreground hover:text-[var(--kenyan-red)] transition-colors -mt-1 -mr-1 p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.color} · EU {item.size}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.size,
                                  item.color,
                                  item.quantity - 1
                                )
                              }
                              className="h-8 w-8 flex items-center justify-center hover:bg-accent transition-colors"
                              aria-label="Decrease"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.size,
                                  item.color,
                                  item.quantity + 1
                                )
                              }
                              className="h-8 w-8 flex items-center justify-center hover:bg-accent transition-colors"
                              aria-label="Increase"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold">
                            {formatKes(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border px-5 sm:px-6 py-4 space-y-3 safe-bottom">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatKes(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {getShipping() === 0 ? "Free" : formatKes(getShipping())}
                  </span>
                </div>
                {getShipping() > 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    Add {formatKes(15000 - getSubtotal())} more for free shipping.
                  </p>
                )}
                <div className="flex justify-between text-base pt-2 border-t border-border">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{formatKes(getTotal())}</span>
                </div>
                <button
                  onClick={() => setCheckout(true)}
                  className="w-full h-12 bg-foreground text-background text-sm font-semibold tracking-wide hover:bg-foreground/90 transition-colors inline-flex items-center justify-center gap-2 min-h-[48px]"
                >
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ==================== CHECKOUT STEP ==================== */}
        {step === "checkout" && (
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
            <div className="space-y-4">
              <Field
                label="Email address"
                required
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="you@example.com"
              />
              <Field
                label="Phone (M-Pesa)"
                required
                type="tel"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="07XX XXX XXX"
              />
              <Field
                label="Full name"
                required
                value={form.fullName}
                onChange={(v) => setForm({ ...form, fullName: v })}
                placeholder="Jane Wanjiru"
              />
              <Field
                label="Delivery address"
                required
                value={form.address}
                onChange={(v) => setForm({ ...form, address: v })}
                placeholder="House no, street, estate"
              />
              <Field
                label="City"
                required
                value={form.city}
                onChange={(v) => setForm({ ...form, city: v })}
                placeholder="Nairobi"
              />
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-foreground mb-1.5 block">
                  Order notes (optional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2.5 text-sm border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Landmark, delivery preferences..."
                />
              </div>

              {/* Payment method */}
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-foreground mb-2 block">
                  Payment method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["MPESA", "CARD", "CASH"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setForm({ ...form, paymentMethod: m })}
                      className={`h-11 text-xs font-medium border transition-all ${
                        form.paymentMethod === m
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {m === "MPESA" ? "M-Pesa" : m === "CARD" ? "Card" : "Cash"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-muted p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatKes(getSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {getShipping() === 0 ? "Free" : formatKes(getShipping())}
                  </span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatKes(getTotal())}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={placing}
                className="w-full h-12 bg-foreground text-background text-sm font-semibold tracking-wide hover:bg-foreground/90 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60 min-h-[48px]"
              >
                {placing ? "Placing order..." : `Pay ${formatKes(getTotal())}`}
                {!placing && <ArrowRight className="h-4 w-4" />}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
                <Truck className="h-3.5 w-3.5" />
                Free delivery in Nairobi & Mombasa · 7-day returns
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUCCESS STEP ==================== */}
        {step === "success" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
            <div className="h-16 w-16 rounded-full bg-foreground text-background flex items-center justify-center mb-5">
              <Check className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-semibold tracking-display mb-2">
              Order confirmed
            </h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-xs">
              Thank you for your order. We&apos;ve sent a confirmation to your
              email and will reach out shortly on delivery details.
            </p>
            <div className="border border-border px-4 py-2 mb-6">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Order number
              </p>
              <p className="text-sm font-mono font-semibold mt-0.5">{orderNo}</p>
            </div>
            <button
              onClick={close}
              className="inline-flex items-center justify-center px-7 py-3 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors min-h-[44px]"
            >
              Continue shopping
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-foreground mb-1.5 block">
        {label} {required && <span className="text-[var(--kenyan-red)]">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-3 text-sm border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
