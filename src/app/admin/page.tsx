"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Clock,
  ArrowUpRight,
  AlertCircle,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalBrands: number;
  totalUsers: number;
  todayRevenue: number;
  last7Revenue: number;
  dailyRevenue: { date: string; total: number }[];
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  fullName: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
}

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

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [lastOrderCount, setLastOrderCount] = useState<number | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState(false);

  const { data, isLoading } = useQuery<{ stats: Stats; recentOrders: RecentOrder[] }>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      const d = await res.json();
      return d;
    },
    refetchInterval: 15000, // refresh every 15s for near-real-time order detection
  });

  // Detect new orders
  useEffect(() => {
    if (!data) return;
    if (lastOrderCount === null) {
      setLastOrderCount(data.stats.totalOrders);
      return;
    }
    if (data.stats.totalOrders > lastOrderCount) {
      setNewOrderAlert(true);
      setLastOrderCount(data.stats.totalOrders);
      // Auto-hide after 8s
      setTimeout(() => setNewOrderAlert(false), 8000);
    }
  }, [data, lastOrderCount]);

  const stats = data?.stats;
  const recent = data?.recentOrders || [];

  // Find orders from last hour for the "NEW" badge
  const oneHourAgo = Date.now() - 60 * 60 * 1000;

  return (
    <div className="space-y-6">
      {/* New order alert toast */}
      {newOrderAlert && (
        <div className="fixed top-4 right-4 z-50 bg-foreground text-background px-5 py-3 shadow-lg flex items-center gap-3 animate-fade-up">
          <div className="h-2 w-2 rounded-full bg-[var(--kenyan-red)] animate-pulse" />
          <span className="text-sm font-medium">New order received!</span>
          <Link
            href="/admin/orders"
            className="text-xs underline text-background/70 hover:text-background"
          >
            View
          </Link>
        </div>
      )}

      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {stats ? `Welcome back. You have ${stats.pendingOrders} pending order${stats.pendingOrders === 1 ? "" : "s"}.` : "Loading..."}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          label="Today's Revenue"
          value={stats ? formatKes(stats.todayRevenue) : null}
          icon={TrendingUp}
          accent="text-[var(--kenyan-red)]"
          isLoading={isLoading}
        />
        <KpiCard
          label="Orders Today"
          value={stats ? String(stats.todayOrders) : null}
          icon={ShoppingCart}
          isLoading={isLoading}
          badge={stats && stats.todayOrders > 0 ? `${stats.todayOrders} new` : null}
        />
        <KpiCard
          label="Pending Orders"
          value={stats ? String(stats.pendingOrders) : null}
          icon={Clock}
          accent={stats && stats.pendingOrders > 0 ? "text-amber-600" : ""}
          isLoading={isLoading}
        />
        <KpiCard
          label="7-Day Revenue"
          value={stats ? formatKes(stats.last7Revenue) : null}
          icon={TrendingUp}
          isLoading={isLoading}
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <MiniStat label="Products" value={stats?.totalProducts} icon={Package} />
        <MiniStat label="Brands" value={stats?.totalBrands} icon={Package} />
        <MiniStat label="Customers" value={stats?.totalUsers} icon={Users} />
      </div>

      {/* Revenue chart */}
      {stats && (
        <div className="bg-background border border-border p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Revenue · Last 7 days
            </h2>
            <span className="text-xs text-muted-foreground">
              Total: {formatKes(stats.last7Revenue)}
            </span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {stats.dailyRevenue.map((d) => {
              const max = Math.max(...stats.dailyRevenue.map((x) => x.total), 1);
              const h = (d.total / max) * 100;
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full bg-muted rounded-t relative group" style={{ height: "100%" }}>
                    <div
                      className="absolute bottom-0 inset-x-0 bg-foreground rounded-t group-hover:bg-[var(--kenyan-red)] transition-colors"
                      style={{ height: `${Math.max(h, 2)}%` }}
                    />
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-foreground text-background px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatKes(d.total)}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(d.date).toLocaleDateString("en-KE", { weekday: "short" })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-background border border-border">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          <h2 className="text-sm font-semibold uppercase tracking-wider">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        {isLoading ? (
          <div className="p-4 sm:p-6 space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No orders yet. Orders will appear here in real time.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recent.map((order) => {
              const isNew = new Date(order.createdAt).getTime() > oneHourAgo;
              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {order.orderNumber}
                      </span>
                      {isNew && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[var(--kenyan-red)] text-white">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">
                      {order.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.items.length} item{order.items.length === 1 ? "" : "s"} · {timeAgo(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold">{formatKes(order.total)}</p>
                    <div className="flex items-center gap-1.5 justify-end mt-1">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 ${STATUS_COLORS[order.status] || "bg-gray-100"}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <QuickAction href="/admin/products/new" label="Add product" icon={Package} />
        <QuickAction href="/admin/products" label="Manage products" icon={Package} />
        <QuickAction href="/admin/orders" label="Process orders" icon={Truck} />
        <QuickAction href="/admin/brands" label="Manage brands" icon={CheckCircle2} />
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
  isLoading,
  badge,
}: {
  label: string;
  value: string | null;
  icon: any;
  accent?: string;
  isLoading?: boolean;
  badge?: string | null;
}) {
  return (
    <div className="bg-background border border-border p-4 sm:p-5 relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className={`h-4 w-4 ${accent || "text-muted-foreground"}`} />
      </div>
      {isLoading || value === null ? (
        <Skeleton className="h-7 w-24" />
      ) : (
        <div className="flex items-baseline gap-2">
          <span className={`text-xl sm:text-2xl font-semibold ${accent || ""}`}>
            {value}
          </span>
          {badge && (
            <span className="text-[10px] font-medium text-[var(--kenyan-red)] uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | undefined;
  icon: any;
}) {
  return (
    <div className="bg-background border border-border p-3 sm:p-4 flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-base sm:text-lg font-semibold">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: any;
}) {
  return (
    <Link
      href={href}
      className="bg-foreground text-background p-4 flex flex-col items-center gap-2 hover:bg-foreground/90 transition-colors text-center"
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs sm:text-sm font-medium">{label}</span>
    </Link>
  );
}
