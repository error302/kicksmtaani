import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { stkPush } from "@/lib/mpesa";

/** Manually re-trigger STK push for an order (admin or customer retry) */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const { orderId } = await req.json();
    const order = await db.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
    }
    const stk = await stkPush(order.phone, order.total, order.orderNumber, order.orderNumber);
    return NextResponse.json({ ok: stk.ok, mpesa: stk });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
