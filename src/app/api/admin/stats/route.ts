import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last7Start = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);

  const [
    totalOrders,
    todayOrders,
    pendingOrders,
    totalProducts,
    totalBrands,
    totalUsers,
    todayRevenue,
    last7Revenue,
    recentOrders,
  ] = await Promise.all([
    db.order.count(),
    db.order.count({ where: { createdAt: { gte: todayStart } } }),
    db.order.count({ where: { status: "PENDING" } }),
    db.product.count(),
    db.brand.count(),
    db.user.count(),
    db.order.aggregate({
      where: { createdAt: { gte: todayStart }, paymentStatus: "SUCCESS" },
      _sum: { total: true },
    }),
    db.order.aggregate({
      where: { createdAt: { gte: last7Start }, paymentStatus: "SUCCESS" },
      _sum: { total: true },
    }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  // Daily revenue for last 7 days
  const dailyRevenue: { date: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(todayStart.getTime() - i * 24 * 60 * 60 * 1000);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    const agg = await db.order.aggregate({
      where: { createdAt: { gte: dayStart, lt: dayEnd }, paymentStatus: "SUCCESS" },
      _sum: { total: true },
    });
    dailyRevenue.push({
      date: dayStart.toISOString().slice(0, 10),
      total: agg._sum.total || 0,
    });
  }

  return NextResponse.json({
    ok: true,
    stats: {
      totalOrders,
      todayOrders,
      pendingOrders,
      totalProducts,
      totalBrands,
      totalUsers,
      todayRevenue: todayRevenue._sum.total || 0,
      last7Revenue: last7Revenue._sum.total || 0,
      dailyRevenue,
    },
    recentOrders: recentOrders.map((o) => ({
      ...o,
      items: JSON.parse(o.items),
    })),
  });
}
