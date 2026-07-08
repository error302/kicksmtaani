import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await db.product.findUnique({
    where: { id },
    include: { brand: true },
  });
  if (!p) notFound();

  const product = {
    ...p,
    images: JSON.parse(p.images),
    sizes: JSON.parse(p.sizes),
    colors: JSON.parse(p.colors),
    tags: p.tags ? JSON.parse(p.tags) : [],
  };

  return <ProductForm mode="edit" product={product} />;
}
