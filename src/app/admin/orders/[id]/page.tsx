"use client";

import { use, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Truck, CheckCircle2, XCircle, Phone, Mail, MapPin, Package } from "lucide-react";
import { toast } from "sonner";

const STATUS_FLOW = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
const ALL_STATUSES = [...STATUS_FLOW, "CANCELLED", "REFUNDED"];

function formatKes(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [dispatchForm, setDispatchForm] = useState({ courier: "", trackingNo: "" });
  const [updating, setUpdating] = useState(false);

  const { data, isLoading } = useQuery<{ order: any }>({
    queryKey: ["admin-order", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/orders/${id}`);
      return res.json();
    },
  });

  const order = data?.order;

  const updateStatus = async (status: string, extra: any = {}) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...extra }),
      });
      const d = await res.json();
      if (d.ok) {
        toast.success(`Order marked as ${status}`);
        queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
        queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
        queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      } else {
        toast.error(d.error || "Update failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDispatch = async () => {
    if (!dispatchForm.courier) {
      toast.error("Enter a courier");
      return;
    }
    await updateStatus("SHIPPED", {
      courier: dispatchForm.courier,
      trackingNo: dispatchForm.trackingNo,
    });
    setDispatchForm({ courier: "", trackingNo: "" });
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading order...</div>;
  }
  if (!order) {
    return <div className="text-sm text-muted-foreground">Order not found.</div>;
  }

  const currentStatusIdx = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest">
            {order.orderNumber}
          </h1>
          <span className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString("en-KE")}
          </span>
        </div>
      </div>

      {/* Status timeline */}
      <div className="bg-background border border-border p-4 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Status Timeline</h2>
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-2">
          {STATUS_FLOW.map((s, i) => {
            const done = i <= currentStatusIdx;
            const isCurrent = s === order.status;
            return (
              <div key={s} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <div
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium ${
                    done ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                  } ${isCurrent ? "ring-2 ring-[var(--kenyan-red)]" : ""}`}
                >
                  {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-current" />}
                  {s}
                </div>
                {i < STATUS_FLOW.length - 1 && (
                  <div className={`h-px w-4 sm:w-8 ${i < currentStatusIdx ? "bg-foreground" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — items + customer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-background border border-border">
            <div className="p-4 sm:p-6 border-b border-border">
              <h2 className="text-sm font-semibold uppercase tracking-wider">Items</h2>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex gap-4 p-4 sm:p-6">
                  <div className="h-20 w-16 sm:w-20 bg-muted flex-shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {item.brandName}
                    </p>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.color} · EU {item.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatKes(item.price * item.quantity)}</p>
                    <p className="text-xs text-muted-foreground">{formatKes(item.price)} ea</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 sm:p-6 border-t border-border space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatKes(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatKes(order.shipping)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-1.5 border-t border-border">
                <span>Total</span>
                <span>{formatKes(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-background border border-border p-4 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Customer</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="font-medium">{order.fullName}</p>
                  <p className="text-muted-foreground">{order.address}</p>
                  <p className="text-muted-foreground">{order.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a href={`tel:${order.phone}`} className="hover:underline">
                  {order.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a href={`mailto:${order.email}`} className="hover:underline">
                  {order.email}
                </a>
              </div>
              {order.notes && (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right — actions */}
        <div className="space-y-6">
          {/* Payment */}
          <div className="bg-background border border-border p-4 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Payment</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 ${
                  order.paymentStatus === "SUCCESS" ? "bg-green-100 text-green-800" :
                  order.paymentStatus === "FAILED" ? "bg-red-100 text-red-800" :
                  "bg-amber-100 text-amber-800"
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.mpesaRef && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">M-Pesa Ref</span>
                  <span className="font-mono text-xs">{order.mpesaRef}</span>
                </div>
              )}
              {order.paymentMethod === "MPESA" && order.paymentStatus !== "SUCCESS" && (
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/mpesa/stk", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderId: order.id }),
                      });
                      const d = await res.json();
                      if (d.ok) {
                        toast.success(d.mpesa.demoMode ? "Demo STK push sent (no credentials)" : "STK push sent to customer");
                      } else {
                        toast.error(d.error || "STK push failed");
                      }
                    } catch {
                      toast.error("Network error");
                    }
                  }}
                  className="w-full mt-3 h-10 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors"
                >
                  Resend M-Pesa request
                </button>
              )}
            </div>
          </div>

          {/* Status actions */}
          <div className="bg-background border border-border p-4 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Actions</h2>
            <div className="space-y-2">
              {/* Quick status buttons */}
              {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                <>
                  {order.status === "PENDING" && (
                    <button
                      onClick={() => updateStatus("CONFIRMED")}
                      disabled={updating}
                      className="w-full h-10 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors"
                    >
                      Confirm order
                    </button>
                  )}
                  {order.status === "CONFIRMED" && (
                    <button
                      onClick={() => updateStatus("PROCESSING")}
                      disabled={updating}
                      className="w-full h-10 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors"
                    >
                      Mark as processing
                    </button>
                  )}
                  {order.status === "PROCESSING" && (
                    <div className="space-y-2">
                      <input
                        placeholder="Courier (e.g. G4S, Sendy)"
                        value={dispatchForm.courier}
                        onChange={(e) => setDispatchForm({ ...dispatchForm, courier: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <input
                        placeholder="Tracking number (optional)"
                        value={dispatchForm.trackingNo}
                        onChange={(e) => setDispatchForm({ ...dispatchForm, trackingNo: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <button
                        onClick={handleDispatch}
                        disabled={updating}
                        className="w-full h-10 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        Dispatch order
                      </button>
                    </div>
                  )}
                  {order.status === "SHIPPED" && (
                    <button
                      onClick={() => updateStatus("DELIVERED")}
                      disabled={updating}
                      className="w-full h-10 text-xs font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Mark as delivered
                    </button>
                  )}
                  <button
                    onClick={() => updateStatus("CANCELLED")}
                    disabled={updating}
                    className="w-full h-10 text-xs font-semibold border border-border text-muted-foreground hover:text-[var(--kenyan-red)] hover:border-[var(--kenyan-red)] transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Cancel order
                  </button>
                </>
              )}
              {order.status === "DELIVERED" && (
                <div className="text-center py-4 text-sm text-green-600 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Order delivered
                </div>
              )}
              {order.status === "CANCELLED" && (
                <div className="text-center py-4 text-sm text-red-600">
                  Order cancelled
                </div>
              )}
            </div>

            {/* Dispatch info */}
            {(order.courier || order.trackingNo || order.dispatchedAt) && (
              <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-xs">
                <p className="font-medium uppercase tracking-wider text-muted-foreground mb-2">Dispatch Info</p>
                {order.courier && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Courier</span>
                    <span>{order.courier}</span>
                  </div>
                )}
                {order.trackingNo && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tracking</span>
                    <span className="font-mono">{order.trackingNo}</span>
                  </div>
                )}
                {order.dispatchedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dispatched</span>
                    <span>{new Date(order.dispatchedAt).toLocaleString("en-KE")}</span>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivered</span>
                    <span>{new Date(order.deliveredAt).toLocaleString("en-KE")}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
