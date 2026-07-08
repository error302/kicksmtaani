import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const addresses = await db.address.findMany({
    where: { userId: (session.user as any).id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ ok: true, addresses });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const userId = (session.user as any).id;
    // If new address is default, unset previous default
    if (body.isDefault) {
      await db.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }
    const address = await db.address.create({
      data: {
        userId,
        label: body.label || "Home",
        fullName: body.fullName,
        phone: body.phone,
        address: body.address,
        city: body.city,
        notes: body.notes || null,
        isDefault: body.isDefault ?? false,
      },
    });
    return NextResponse.json({ ok: true, address });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
