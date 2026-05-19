"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ArrowLeft, Users, Shield, ShieldCheck, User } from "lucide-react";
import Link from "next/link";

export default function AdminUsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get("/admin/users").then((r) => r.data),
  });

  const users = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  const roleConfig: Record<string, { icon: any; color: string; bg: string }> = {
    SUPERADMIN: { icon: ShieldCheck, color: "text-red-600", bg: "bg-red-50" },
    ADMIN: { icon: Shield, color: "text-purple-600", bg: "bg-purple-50" },
    CUSTOMER: { icon: User, color: "text-blue-600", bg: "bg-blue-50" },
  };

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-black">Users</h1>
          <p className="text-gray-500">Manage customers and staff accounts.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: "Total Users", value: users.length, color: "text-black" },
          { label: "Admins", value: users.filter((u: any) => u.role === "ADMIN" || u.role === "SUPERADMIN").length, color: "text-purple-600" },
          { label: "Customers", value: users.filter((u: any) => u.role === "CUSTOMER").length, color: "text-blue-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">User</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user: any) => {
                const role = roleConfig[user.role] || roleConfig.CUSTOMER;
                const RoleIcon = role.icon;
                return (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center text-white font-black text-lg">
                          {(user.fullName || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-black">{user.fullName || "—"}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-gray-600">{user.phone || "—"}</td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 ${role.bg} ${role.color} text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest`}>
                        <RoleIcon className="w-3.5 h-3.5" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">No users found</h3>
              <p className="text-gray-500">Users will appear here when they register.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
