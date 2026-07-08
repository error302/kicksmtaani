import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const products = await db.product.findMany({
    include: { brand: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({
    ok: true,
    products: products.map((p) => ({
      ...p,
      brandName: p.brand?.name ?? "Generic",
      images: JSON.parse(p.images),
      sizes: JSON.parse(p.sizes),
      colors: JSON.parse(p.colors),
      tags: p.tags ? JSON.parse(p.tags) : [],
    })),
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    // Generate slug from name
    let slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    // Ensure unique
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const product = await db.product.create({
      data: {
        name: body.name,
        slug,
        brandId: body.brandId || null,
        category: body.category,
        description: body.description || null,
        basePrice: Number(body.basePrice),
        compareAt: body.compareAt ? Number(body.compareAt) : null,
        images: JSON.stringify(body.images || []),
        sizes: JSON.stringify(body.sizes || []),
        colors: JSON.stringify(body.colors || []),
        rating: body.rating || 5,
        reviewCount: body.reviewCount || 0,
        inStock: body.inStock ?? true,
        stockQty: body.stockQty || 0,
        isFeatured: body.isFeatured ?? false,
        isNew: body.isNew ?? false,
        tags: body.tags ? JSON.stringify(body.tags) : null,
      },
    });
    return NextResponse.json({ ok: true, product });
  } catch (e: any) {
    console.error("Create product error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
