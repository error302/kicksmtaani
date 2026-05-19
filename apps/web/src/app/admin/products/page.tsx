"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Plus, Trash2, Edit3, Package, ArrowLeft, ExternalLink, Search } from "lucide-react";
import Link from "next/link";

export default function AdminProductsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => api.get("/admin/products").then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/products/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const products = data?.data || [];

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
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-black">Inventory</h1>
            <p className="text-gray-500">Manage your sneaker catalog.</p>
          </div>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-black/10"
        >
          <Plus className="w-5 h-5" /> Add Product
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Stock Status</th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product: any) => {
                const totalStock = product.variants?.reduce((sum: number, v: any) => sum + (v.stockQty || 0), 0) || 0;
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                          <img
                            src={product.images?.[0] || "https://via.placeholder.com/400"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-black group-hover:text-red-600 transition-colors">{product.name}</p>
                          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-black">
                        <span className="text-xs font-normal text-gray-400 mr-1">KES</span>
                        {Number(product.basePrice).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      {totalStock > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-sm font-bold text-green-600">{totalStock} In Stock</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                          <span className="text-sm font-bold text-red-600">Out of Stock</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-3 text-gray-400 hover:text-black transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <button className="p-3 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Are you sure?")) deleteMutation.mutate(product.id);
                          }}
                          className="p-3 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {products.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">No products found</h3>
              <p className="text-gray-500 mb-8">Start your catalog by adding your first pair of kicks.</p>
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-bold"
              >
                <Plus className="w-5 h-5" /> Add Product
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
