"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Plus, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ProductFormProps {
  product?: any; // existing product for edit mode
  mode: "create" | "edit";
}

const CATEGORIES = ["MEN", "WOMEN", "KIDS", "UNISEX"];

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: product?.name || "",
    brandId: product?.brandId || "",
    category: product?.category || "UNISEX",
    description: product?.description || "",
    basePrice: product?.basePrice?.toString() || "",
    compareAt: product?.compareAt?.toString() || "",
    images: (product?.images || []) as string[],
    sizes: (product?.sizes || []).join(", "),
    colors: ((product?.colors || []) as any[]).map((c) => `${c.name}:${c.hex}`).join(", "),
    isFeatured: product?.isFeatured || false,
    isNew: product?.isNew || false,
    stockQty: product?.stockQty?.toString() || "0",
    tags: (product?.tags || []).join(", "),
  });

  const { data: brandsData } = useQuery<{ brands: any[] }>({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await fetch("/api/admin/brands");
      return res.json();
    },
  });
  const brands = brandsData?.brands || [];

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const newImages: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const d = await res.json();
        if (d.ok) {
          newImages.push(d.url);
        } else {
          toast.error(`Upload failed: ${d.error}`);
        }
      }
      setForm({ ...form, images: [...form.images, ...newImages] });
      if (newImages.length) toast.success(`${newImages.length} image(s) added`);
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (idx: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.basePrice) {
      toast.error("Name and price are required");
      return;
    }
    setSaving(true);

    const payload = {
      name: form.name,
      brandId: form.brandId,
      category: form.category,
      description: form.description,
      basePrice: Number(form.basePrice),
      compareAt: form.compareAt ? Number(form.compareAt) : null,
      images: form.images,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((c) => {
          const [name, hex] = c.split(":").map((x) => x.trim());
          return { name: name || "Default", hex: hex || "#000000" };
        }),
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      stockQty: Number(form.stockQty) || 0,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      const url = mode === "create" ? "/api/admin/products" : `/api/admin/products/${product.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (d.ok) {
        toast.success(mode === "create" ? "Product created" : "Product updated");
        queryClient.invalidateQueries({ queryKey: ["admin-products"] });
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(d.error || "Save failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </button>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest">
          {mode === "create" ? "New Product" : "Edit Product"}
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — main fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="bg-background border border-border p-4 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Images</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative aspect-square bg-muted overflow-hidden group">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 h-6 w-6 bg-background/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--kenyan-red)] hover:text-white"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-[9px] font-bold uppercase bg-foreground text-background px-1.5 py-0.5">
                      Cover
                    </span>
                  )}
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-border hover:border-foreground flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-muted-foreground hover:text-foreground">
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span className="text-[10px] uppercase tracking-wider">Upload</span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleUpload(e.target.files)}
                  disabled={uploading}
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Upload images to Cloudinary. The first image is the cover. You can also paste image URLs below.
            </p>
            <input
              type="url"
              placeholder="Paste image URL and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = (e.target as HTMLInputElement).value;
                  if (val) {
                    setForm({ ...form, images: [...form.images, val] });
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
              className="w-full mt-3 h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Basic info */}
          <div className="bg-background border border-border p-4 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider">Basic Info</h2>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">Brand</label>
                <select
                  value={form.brandId}
                  onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                  className="w-full h-10 px-3 text-sm border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">No brand (generic / local)</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Leave as &ldquo;No brand&rdquo; for generic or local shoes without a label name.
                </p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full h-10 px-3 text-sm border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-background border border-border p-4 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider">Pricing</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">Price (KES) *</label>
                <input
                  type="number"
                  value={form.basePrice}
                  onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                  className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">Compare at (KES)</label>
                <input
                  type="number"
                  value={form.compareAt}
                  onChange={(e) => setForm({ ...form, compareAt: e.target.value })}
                  placeholder="Original price"
                  className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">Stock Qty</label>
                <input
                  type="number"
                  value={form.stockQty}
                  onChange={(e) => setForm({ ...form, stockQty: e.target.value })}
                  className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-background border border-border p-4 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider">Variants</h2>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Sizes (comma-separated)
              </label>
              <input
                value={form.sizes}
                onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                placeholder="39, 40, 41, 42, 43, 44, 45"
                className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Colors (name:hex, comma-separated)
              </label>
              <input
                value={form.colors}
                onChange={(e) => setForm({ ...form, colors: e.target.value })}
                placeholder="Triple White:#FFFFFF, Triple Black:#0A0A0A"
                className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: Color Name:#HEXCODE, separated by commas
              </p>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Tags (comma-separated)
              </label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Bestseller, Iconic, Grail"
                className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Right — flags + actions */}
        <div className="space-y-6">
          <div className="bg-background border border-border p-4 sm:p-6 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider">Flags</h2>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Featured</span>
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="h-4 w-4"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">New Arrival</span>
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                className="h-4 w-4"
              />
            </label>
          </div>

          <div className="bg-background border border-border p-4 sm:p-6 space-y-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full h-11 bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {mode === "create" ? "Create product" : "Save changes"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="w-full h-11 border border-border text-sm font-medium hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
