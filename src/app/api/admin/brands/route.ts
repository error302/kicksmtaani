import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const brands = await db.brand.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ ok: true, brands });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    let slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const existing = await db.brand.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const brand = await db.brand.create({
      data: {
        name: body.name,
        slug,
        country: body.country || null,
        description: body.description || null,
        featured: body.featured ?? false,
        logoUrl: body.logoUrl || null,
      },
    });
    return NextResponse.json({ ok: true, brand });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
