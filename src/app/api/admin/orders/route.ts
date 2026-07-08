import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const where: any = {};
  if (status && status !== "ALL") where.status = status;

  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  return NextResponse.json({
    ok: true,
    orders: orders.map((o) => ({
      ...o,
      items: JSON.parse(o.items),
    })),
  });
}
