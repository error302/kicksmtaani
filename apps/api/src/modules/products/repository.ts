import { prisma } from "@kicksmtaani/db";
import { ProductQuery } from "./schema.js";

export async function createProduct(data: any) {
  const { variants, ...productData } = data;

  return prisma.product.create({
    data: {
      ...productData,
      variants: variants ? { create: variants } : undefined,
    },
    include: { variants: true },
  });
}

export async function getProducts(query: ProductQuery) {
  const { category, brand, minPrice, maxPrice, page, limit } = query;

  const where: any = {};

  if (category) where.category = category;
  if (brand) where.brand = brand;
  if (minPrice || maxPrice) {
    where.basePrice = {};
    if (minPrice) where.basePrice.gte = minPrice;
    if (maxPrice) where.basePrice.lte = maxPrice;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { variants: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, limit };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { variants: true },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });
}

export async function updateProduct(id: string, data: any) {
  const { variants, ...productData } = data;

  return prisma.product.update({
    where: { id },
    data: {
      ...productData,
      variants: variants ? { deleteMany: {}, create: variants } : undefined,
    },
    include: { variants: true },
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function getAllBrands() {
  const products = await prisma.product.findMany({
    select: { brand: true },
    distinct: ["brand"],
    where: { brand: { not: null } },
  });

  return products.map((p) => p.brand).filter(Boolean);
}
