import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const product = await db.product.update({
      where: { id },
      data: {
        name: body.name,
        brandId: body.brandId,
        category: body.category,
        description: body.description || null,
        basePrice: Number(body.basePrice),
        compareAt: body.compareAt ? Number(body.compareAt) : null,
        images: JSON.stringify(body.images || []),
        sizes: JSON.stringify(body.sizes || []),
        colors: JSON.stringify(body.colors || []),
        inStock: body.inStock ?? true,
        stockQty: body.stockQty || 0,
        isFeatured: body.isFeatured ?? false,
        isNew: body.isNew ?? false,
        tags: body.tags ? JSON.stringify(body.tags) : null,
      },
    });
    return NextResponse.json({ ok: true, product });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: { brand: true },
  });
  if (!product) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({
    ok: true,
    product: {
      ...product,
      images: JSON.parse(product.images),
      sizes: JSON.parse(product.sizes),
      colors: JSON.parse(product.colors),
      tags: product.tags ? JSON.parse(product.tags) : [],
    },
  });
}
