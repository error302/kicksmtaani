"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, uploadImages } from "@/lib/api";
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon,
  Loader2,
  X
} from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState([{ size: "", stockQty: 0, sku: "", color: "" }]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    brand: "",
    category: "MEN",
    basePrice: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === "name") {
        newData.slug = value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      }
      return newData;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append("images", files[i]);
    }

    try {
      const result = await uploadImages(fd);
      setImages(prev => [...prev, ...result.data]);
    } catch (error) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([...variants, { size: "", stockQty: 0, sku: "", color: "" }]);
  };

  const updateVariant = (index: number, field: string, value: string | number) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProduct({
        ...formData,
        basePrice: Number(formData.basePrice),
        images,
        variants: variants.map(v => ({
          ...v,
          stockQty: Number(v.stockQty)
        }))
      });
      router.push("/admin/products");
    } catch (error) {
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/products" className="p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight">New Product</h1>
                <p className="text-gray-500">Add a fresh pair to the inventory.</p>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Product
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left - Product Info */}
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tight border-b pb-4 mb-6">General Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Nike Air Max 90"
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Slug (Auto-generated)</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-100 border-none rounded-2xl text-gray-500 outline-none cursor-not-allowed"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Description</label>
                    <textarea
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Tell the story behind these kicks..."
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        required
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="Nike, Adidas, etc."
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Base Price (KES)</label>
                      <input
                        type="number"
                        name="basePrice"
                        required
                        value={formData.basePrice}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Variants Section */}
              <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8 border-b pb-4">
                  <h2 className="text-xl font-black uppercase tracking-tight">Sizes & Stock</h2>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-2 text-red-600 font-bold text-sm hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Size
                  </button>
                </div>

                <div className="space-y-4">
                  {variants.map((v, i) => (
                    <div key={i} className="grid grid-cols-4 gap-3 items-end bg-gray-50 p-4 rounded-2xl relative group">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Size</label>
                        <input
                          type="text"
                          placeholder="e.g. 42"
                          value={v.size}
                          onChange={(e) => updateVariant(i, "size", e.target.value)}
                          className="w-full p-3 bg-white rounded-xl text-sm border-none focus:ring-2 focus:ring-red-500/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Stock</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={v.stockQty}
                          onChange={(e) => updateVariant(i, "stockQty", e.target.value)}
                          className="w-full p-3 bg-white rounded-xl text-sm border-none focus:ring-2 focus:ring-red-500/20 outline-none"
                        />
                      </div>
                      <div className="col-span-2 flex gap-2 items-center">
                        <div className="flex-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">SKU</label>
                          <input
                            type="text"
                            placeholder="Optional"
                            value={v.sku}
                            onChange={(e) => updateVariant(i, "sku", e.target.value)}
                            className="w-full p-3 bg-white rounded-xl text-sm border-none focus:ring-2 focus:ring-red-500/20 outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVariant(i)}
                          className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right - Images & Category */}
            <div className="space-y-8">
              {/* Category Card */}
              <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black uppercase tracking-tight mb-6">Category</h2>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/20 outline-none font-bold"
                >
                  <option value="MEN">MEN</option>
                  <option value="WOMEN">WOMEN</option>
                  <option value="BOYS">BOYS</option>
                  <option value="GIRLS">GIRLS</option>
                  <option value="KIDS">KIDS</option>
                </select>
              </section>

              {/* Images Card */}
              <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black uppercase tracking-tight mb-2">Gallery</h2>
                <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest">Local Files or Cloudinary URLs</p>
                
                {/* URL Input */}
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    id="imageUrlInput"
                    placeholder="Paste Cloudinary URL..."
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('imageUrlInput') as HTMLInputElement;
                      if (input.value) {
                        setImages(prev => [...prev, input.value]);
                        input.value = '';
                      }
                    }}
                    className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition-colors"
                  >
                    Add URL
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {images.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100">
                      <img src={url} alt="Upload" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <label className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-50 transition-all group">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-300 group-hover:text-red-500 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-red-600">Local File</span>
                      </>
                    )}
                    <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              </section>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
