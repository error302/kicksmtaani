"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Plus } from "lucide-react";

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
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Product
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Brand
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => {
              const totalStock =
                product.variants?.reduce(
                  (sum: number, v: any) => sum + (v.stockQty || 0),
                  0,
                ) || 0;

              return (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          {product.variants?.length || 0} variants
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {product.brand || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    KES {Number(product.basePrice).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${totalStock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {totalStock} units
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:underline text-sm mr-3">
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(product.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">No products yet</div>
        )}
      </div>
    </div>
  );
}
