"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Package,
  MapPin,
  LogOut,
  Plus,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
}

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes: string | null;
  isDefault: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

function formatKes(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

export function AccountClient({
  user,
  orders,
  addresses,
}: {
  user: { email: string; name?: string | null };
  orders: Order[];
  addresses: Address[];
}) {
  const router = useRouter();
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
    isDefault: false,
  });

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrForm.fullName || !addrForm.phone || !addrForm.address || !addrForm.city) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addrForm),
      });
      const d = await res.json();
      if (d.ok) {
        toast.success("Address saved");
        setShowAddrForm(false);
        router.refresh();
      } else {
        toast.error(d.error || "Save failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
              Account
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tightest">
              {user.name || "Welcome back"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border hover:bg-accent transition-colors"
            >
              Continue shopping
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border text-muted-foreground hover:text-[var(--kenyan-red)] hover:border-[var(--kenyan-red)] transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Package className="h-5 w-5" />
            <h2 className="text-xl font-semibold tracking-tightest">Order History</h2>
          </div>
          {orders.length === 0 ? (
            <div className="border border-border p-8 sm:p-12 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                No orders yet. Start your sneaker journey.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors min-h-[44px]"
              >
                Browse sneakers
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border border-border p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm font-medium mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-KE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatKes(order.total)}</p>
                      <span
                        className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-1 mt-1 ${STATUS_COLORS[order.status] || "bg-gray-100"}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pt-3 border-t border-border">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex-shrink-0 flex items-center gap-2">
                        <div className="h-12 w-10 bg-muted overflow-hidden">
                          <img src={item.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="text-xs">
                          <p className="font-medium truncate max-w-[120px]">{item.name}</p>
                          <p className="text-muted-foreground">
                            {item.color} · EU {item.size} · ×{item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {order.status === "SHIPPED" && (
                    <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-xs text-indigo-600">
                      <Truck className="h-3.5 w-3.5" />
                      Your order is on the way
                    </div>
                  )}
                  {order.status === "DELIVERED" && (
                    <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-xs text-green-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Delivered
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <h2 className="text-xl font-semibold tracking-tightest">Saved Addresses</h2>
            </div>
            <button
              onClick={() => setShowAddrForm(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border hover:bg-accent transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
          {addresses.length === 0 ? (
            <div className="border border-border p-8 text-center text-sm text-muted-foreground">
              No saved addresses yet.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="border border-border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-foreground text-background">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-medium">{addr.fullName}</p>
                  <p className="text-sm text-muted-foreground">{addr.address}</p>
                  <p className="text-sm text-muted-foreground">{addr.city}</p>
                  <p className="text-xs text-muted-foreground mt-1">{addr.phone}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {showAddrForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddrForm(false)} />
            <form
              onSubmit={handleAddAddress}
              className="relative bg-background w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-lg font-semibold mb-6">New address</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">Label</label>
                  <select
                    value={addrForm.label}
                    onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })}
                    className="w-full h-10 px-3 text-sm border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Home</option>
                    <option>Work</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">Full name *</label>
                  <input
                    value={addrForm.fullName}
                    onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })}
                    className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">Phone *</label>
                  <input
                    type="tel"
                    value={addrForm.phone}
                    onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                    className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">Address *</label>
                  <input
                    value={addrForm.address}
                    onChange={(e) => setAddrForm({ ...addrForm, address: e.target.value })}
                    className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">City *</label>
                  <input
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Set as default</span>
                  <input
                    type="checkbox"
                    checked={addrForm.isDefault}
                    onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                    className="h-4 w-4"
                  />
                </label>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 h-11 bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors"
                >
                  Save address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddrForm(false)}
                  className="flex-1 h-11 border border-border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
