"use client";

import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Search, Plus, Upload, FileUp, Trash2, Edit, Loader2, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  brandName: string;
  category: string;
  basePrice: number;
  compareAt: number | null;
  images: string[];
  inStock: boolean;
  stockQty: number;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
}

function formatKes(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery<{ products: Product[] }>({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await fetch("/api/admin/products");
      return res.json();
    },
  });

  const products = data?.products || [];
  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brandName.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.ok) {
        toast.success("Product deleted");
        queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      } else {
        toast.error(d.error || "Delete failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleImport = async (file: File) => {
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/import", { method: "POST", body: formData });
      const d = await res.json();
      if (d.ok) {
        toast.success(`Imported ${d.created} products${d.skipped ? `, ${d.skipped} skipped` : ""}`);
        queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      } else {
        toast.error(d.error || "Import failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setImporting(false);
      if (importInputRef.current) importInputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    const csv = `name,brandSlug,category,description,basePrice,compareAt,images,sizes,colors,isFeatured,isNew,stockQty,tags
Nike Air Force 1 '07,nike,UNISEX,"The legend that started it all.",14999,18000,https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900|https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=900,39|40|41|42|43|44|45,Triple White:#FFFFFF; Triple Black:#0A0A0A,true,false,50,Bestseller|Iconic
Adidas Samba OG,adidas,UNISEX,"1950 indoor football silhouette.",11999,,https://images.unsplash.com/photo-1600185365483-52d0b3a4c1e0?w=900,38|39|40|41|42|43|44|45,White/Black:#0A0A0A,true,true,30,Bestseller`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kicksmtaani-products-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest">
            Products
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {products.length} product{products.length === 1 ? "" : "s"} in catalog
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border hover:bg-accent transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Template</span>
          </button>
          <label className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border hover:bg-accent transition-colors cursor-pointer">
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
            <span className="hidden sm:inline">{importing ? "Importing..." : "Import CSV"}</span>
            <input
              ref={importInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImport(f);
              }}
            />
          </label>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add product</span>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or brand..."
          className="w-full h-10 pl-10 pr-4 text-sm border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Products table */}
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-background border border-border p-12 text-center text-sm text-muted-foreground">
          No products found.{" "}
          <Link href="/admin/products/new" className="underline text-foreground">
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="bg-background border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-3 sm:p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground">Product</th>
                <th className="p-3 sm:p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Brand</th>
                <th className="p-3 sm:p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Category</th>
                <th className="p-3 sm:p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground">Price</th>
                <th className="p-3 sm:p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Stock</th>
                <th className="p-3 sm:p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-accent/50 transition-colors">
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-10 bg-muted flex-shrink-0 overflow-hidden">
                        <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[200px]">{p.name}</p>
                        <div className="flex gap-1 mt-0.5">
                          {p.isNew && <span className="text-[9px] font-bold uppercase bg-foreground text-background px-1">New</span>}
                          {p.isFeatured && <span className="text-[9px] font-bold uppercase bg-[var(--kenyan-red)] text-white px-1">Feat</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 hidden sm:table-cell text-muted-foreground">{p.brandName}</td>
                  <td className="p-3 sm:p-4 hidden md:table-cell text-muted-foreground">{p.category}</td>
                  <td className="p-3 sm:p-4">
                    <p className="font-semibold">{formatKes(p.basePrice)}</p>
                    {p.compareAt && (
                      <p className="text-xs text-muted-foreground line-through">{formatKes(p.compareAt)}</p>
                    )}
                  </td>
                  <td className="p-3 sm:p-4 hidden lg:table-cell">
                    <span className={`text-xs ${p.stockQty < 10 ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                      {p.stockQty} in stock
                    </span>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="p-2 hover:bg-accent rounded transition-colors"
                        aria-label="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-2 hover:bg-accent rounded text-muted-foreground hover:text-[var(--kenyan-red)] transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
