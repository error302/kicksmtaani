import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
const VALID_PAYMENTS = ["PENDING", "SUCCESS", "FAILED", "REFUNDED"];

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const order = await db.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({
    ok: true,
    order: { ...order, items: JSON.parse(order.items) },
  });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const update: any = {};
    if (body.status && VALID_STATUSES.includes(body.status)) update.status = body.status;
    if (body.paymentStatus && VALID_PAYMENTS.includes(body.paymentStatus)) update.paymentStatus = body.paymentStatus;
    if (body.mpesaRef !== undefined) update.mpesaRef = body.mpesaRef;
    if (body.courier !== undefined) update.courier = body.courier;
    if (body.trackingNo !== undefined) update.trackingNo = body.trackingNo;
    if (body.notes !== undefined) update.notes = body.notes;
    if (body.status === "SHIPPED" && !body.dispatchedAt) update.dispatchedAt = new Date();
    if (body.status === "DELIVERED" && !body.deliveredAt) update.deliveredAt = new Date();

    const order = await db.order.update({ where: { id }, data: update });
    return NextResponse.json({ ok: true, order });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
