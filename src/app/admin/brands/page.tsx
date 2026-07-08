"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit, X, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

interface Brand {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  description: string | null;
  featured: boolean;
}

export default function AdminBrandsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    country: "",
    description: "",
    featured: false,
    logoUrl: "",
  });

  const { data, isLoading } = useQuery<{ brands: Brand[] }>({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await fetch("/api/admin/brands");
      return res.json();
    },
  });

  const brands = data?.brands || [];

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", country: "", description: "", featured: false, logoUrl: "" });
    setShowForm(true);
  };

  const openEdit = (b: Brand) => {
    setEditing(b);
    setForm({
      name: b.name,
      country: b.country || "",
      description: b.description || "",
      featured: b.featured,
      logoUrl: b.logoUrl || "",
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/admin/brands/${editing.id}` : "/api/admin/brands";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (d.ok) {
        toast.success(editing ? "Brand updated" : "Brand created");
        queryClient.invalidateQueries({ queryKey: ["brands"] });
        setShowForm(false);
      } else {
        toast.error(d.error || "Save failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? All products in this brand will also be deleted.`)) return;
    try {
      const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.ok) {
        toast.success("Brand deleted");
        queryClient.invalidateQueries({ queryKey: ["brands"] });
      } else {
        toast.error(d.error || "Delete failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest">Brands</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {brands.length} brand{brands.length === 1 ? "" : "s"} in catalog
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add brand</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((b) => (
            <div key={b.id} className="bg-background border border-border p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{b.name}</h3>
                  {b.country && (
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mt-0.5">
                      {b.country}
                    </p>
                  )}
                </div>
                {b.featured && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 bg-[var(--kenyan-red)]/10 text-[var(--kenyan-red)]">
                    Featured
                  </span>
                )}
              </div>
              {b.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                  {b.description}
                </p>
              )}
              <div className="flex gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => openEdit(b)}
                  className="flex-1 h-9 text-xs font-medium border border-border hover:bg-accent transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b.id, b.name)}
                  className="h-9 px-3 text-xs font-medium border border-border text-muted-foreground hover:text-[var(--kenyan-red)] hover:border-[var(--kenyan-red)] transition-colors inline-flex items-center justify-center"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <form
            onSubmit={handleSave}
            className="relative bg-background w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {editing ? "Edit brand" : "New brand"}
              </h2>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">
                  Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">
                  Country
                </label>
                <input
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  placeholder="United States"
                  className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">
                  Logo URL (optional)
                </label>
                <input
                  type="url"
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Featured brand</span>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="h-4 w-4"
                />
              </label>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 h-11 bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? "Save" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 h-11 border border-border text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
