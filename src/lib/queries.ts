import { db } from "@/lib/db";
import type { BrandDTO, ColorOption, ProductDTO } from "@/lib/types";

export async function getAllBrands(): Promise<BrandDTO[]> {
  const brands = await db.brand.findMany({ orderBy: { name: "asc" } });
  return brands.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    country: b.country,
    description: b.description,
    featured: b.featured,
  }));
}

export async function getProductsByFilters(opts?: {
  category?: string;
  brandSlug?: string;
  search?: string;
  sort?: string;
  limit?: number;
  onlyFeatured?: boolean;
  onlyNew?: boolean;
}): Promise<ProductDTO[]> {
  const where: any = { inStock: true };
  if (opts?.category && opts.category !== "ALL") where.category = opts.category;
  if (opts?.brandSlug) {
    const brand = await db.brand.findUnique({ where: { slug: opts.brandSlug } });
    if (brand) where.brandId = brand.id;
    else return []; // brand not found → no products
  }
  if (opts?.onlyFeatured) where.isFeatured = true;
  if (opts?.onlyNew) where.isNew = true;
  if (opts?.search) {
    where.OR = [
      { name: { contains: opts.search } },
      { description: { contains: opts.search } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (opts?.sort === "price-asc") orderBy = { basePrice: "asc" };
  if (opts?.sort === "price-desc") orderBy = { basePrice: "desc" };
  if (opts?.sort === "rating") orderBy = { rating: "desc" };

  const products = await db.product.findMany({
    where,
    orderBy,
    take: opts?.limit,
    include: { brand: true },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    brandId: p.brandId,
    brandName: p.brand?.name ?? "Generic",
    brandSlug: p.brand?.slug ?? "generic",
    category: p.category as any,
    description: p.description,
    basePrice: p.basePrice,
    compareAt: p.compareAt,
    images: JSON.parse(p.images) as string[],
    sizes: JSON.parse(p.sizes) as string[],
    colors: JSON.parse(p.colors) as ColorOption[],
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.inStock,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    tags: p.tags ? (JSON.parse(p.tags) as string[]) : [],
  }));
}
