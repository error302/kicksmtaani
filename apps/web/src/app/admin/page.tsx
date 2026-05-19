"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  LayoutGrid,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/admin/stats").then((r) => r.data),
  });

  const stats = data?.data || {};

  const statCards = [
    {
      label: "Total Revenue",
      value: `KES ${Number(stats.totalRevenue || 0).toLocaleString()}`,
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders || 0,
      change: "+5.2%",
      isPositive: true,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Products",
      value: stats.totalProducts || 0,
      change: "-2.1%",
      isPositive: false,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Total Customers",
      value: stats.totalCustomers || 0,
      change: "+8.4%",
      isPositive: true,
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-black">Admin Panel</h1>
          <p className="text-gray-500">Welcome back. Here&apos;s what&apos;s happening with KicksMtaani.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-black/10"
          >
            <Plus className="w-5 h-5" /> New Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              href="/admin/orders"
              className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all group"
            >
              <div className="flex items-center gap-4">
                <ShoppingCart className="w-6 h-6 text-gray-400 group-hover:text-white" />
                <span className="font-bold">Manage Orders</span>
              </div>
              <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all group"
            >
              <div className="flex items-center gap-4">
                <Package className="w-6 h-6 text-gray-400 group-hover:text-white" />
                <span className="font-bold">Manage Products</span>
              </div>
              <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all group"
            >
              <div className="flex items-center gap-4">
                <Users className="w-6 h-6 text-gray-400 group-hover:text-white" />
                <span className="font-bold">Manage Users</span>
              </div>
              <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
            </Link>
          </div>
        </div>

        {/* Recent Performance Chart (Mockup) */}
        <div className="lg:col-span-2 bg-black rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Sales Overview</h3>
                <p className="text-gray-400 text-sm">Revenue performance for last 30 days</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-500" />
            </div>
            
            <div className="flex-1 flex items-end gap-2 pt-8">
              {[40, 60, 35, 70, 90, 45, 60, 85, 100, 75, 55, 80].map((height, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-white/10 rounded-t-lg hover:bg-red-500 transition-all cursor-pointer group relative"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-black text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    KES {height * 1000}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
              <span>Day 1</span>
              <span>Day 15</span>
              <span>Day 30</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
