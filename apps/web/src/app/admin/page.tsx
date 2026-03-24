"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/admin/stats").then((r) => r.data),
  });

  const stats = data?.data || {};

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Revenue",
      value: `KES ${Number(stats.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Products",
      value: stats.totalProducts || 0,
      icon: Package,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Customers",
      value: stats.totalCustomers || 0,
      icon: Users,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg border">
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="/admin/orders"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="w-6 h-6 mb-2 text-primary" />
            <p className="font-medium">Manage Orders</p>
          </a>
          <a
            href="/admin/products"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Package className="w-6 h-6 mb-2 text-primary" />
            <p className="font-medium">Manage Products</p>
          </a>
        </div>
      </div>
    </div>
  );
}
