"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, Filter, Clock, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Order {
  id: string;
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  items: any[];
}

const STATUSES = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

function formatKes(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export default function AdminOrdersPage() {
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch, isFetching } = useQuery<{ orders: Order[] }>({
    queryKey: ["admin-orders", status],
    queryFn: async () => {
      const url = `/api/admin/orders${status !== "ALL" ? `?status=${status}` : ""}`;
      const res = await fetch(url);
      return res.json();
    },
    refetchInterval: 20000,
  });

  const orders = data?.orders || [];
  const filtered = search
    ? orders.filter(
        (o) =>
          o.fullName.toLowerCase().includes(search.toLowerCase()) ||
          o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          o.email.toLowerCase().includes(search.toLowerCase()) ||
          o.phone.includes(search)
      )
    : orders;

  const counts: Record<string, number> = { ALL: orders.length };
  for (const o of orders) {
    counts[o.status] = (counts[o.status] || 0) + 1;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest">
            Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {orders.length} order{orders.length === 1 ? "" : "s"} · auto-refreshes every 20s
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border hover:bg-accent transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, order #, email, phone..."
            className="w-full h-10 pl-10 pr-4 text-sm border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`flex-shrink-0 px-3 h-10 text-xs font-medium border transition-colors ${
                status === s
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background border-border hover:border-foreground"
              }`}
            >
              {s}
              {counts[s] ? ` (${counts[s]})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-background border border-border p-12 text-center text-sm text-muted-foreground">
          No orders found.
        </div>
      ) : (
        <div className="bg-background border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-3 sm:p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground">Order</th>
                <th className="p-3 sm:p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Customer</th>
                <th className="p-3 sm:p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Items</th>
                <th className="p-3 sm:p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground">Total</th>
                <th className="p-3 sm:p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="p-3 sm:p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => {
                const isNew = Date.now() - new Date(order.createdAt).getTime() < 60 * 60 * 1000;
                return (
                  <tr key={order.id} className="hover:bg-accent/50 transition-colors">
                    <td className="p-3 sm:p-4">
                      <Link href={`/admin/orders/${order.id}`} className="block">
                        <span className="font-mono text-xs">{order.orderNumber}</span>
                        {isNew && (
                          <span className="ml-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[var(--kenyan-red)] text-white">
                            New
                          </span>
                        )}
                        <p className="text-xs text-muted-foreground sm:hidden mt-0.5">
                          {order.fullName}
                        </p>
                      </Link>
                    </td>
                    <td className="p-3 sm:p-4 hidden sm:table-cell">
                      <p className="font-medium">{order.fullName}</p>
                      <p className="text-xs text-muted-foreground">{order.phone}</p>
                    </td>
                    <td className="p-3 sm:p-4 hidden md:table-cell text-muted-foreground">
                      {order.items.length} item{order.items.length === 1 ? "" : "s"}
                    </td>
                    <td className="p-3 sm:p-4 font-semibold">{formatKes(order.total)}</td>
                    <td className="p-3 sm:p-4">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-1 ${STATUS_COLORS[order.status] || "bg-gray-100"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 hidden lg:table-cell text-xs text-muted-foreground">
                      {timeAgo(order.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
