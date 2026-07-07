import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { OrderPayload } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as OrderPayload;
    if (!body.email || !body.phone || !body.fullName || !body.address || !body.city) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ ok: false, error: "Cart is empty" }, { status: 400 });
    }

    const orderNumber = `KM-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      Math.random() * 9999
    )}`;

    const order = await db.order.create({
      data: {
        orderNumber,
        email: body.email,
        phone: body.phone,
        fullName: body.fullName,
        address: body.address,
        city: body.city,
        notes: body.notes ?? null,
        items: JSON.stringify(body.items),
        subtotal: body.subtotal,
        shipping: body.shipping,
        total: body.total,
        status: "PENDING",
        paymentMethod: body.paymentMethod,
      },
    });

    return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json(
      { ok: false, error: "Could not place order" },
      { status: 500 }
    );
  }
}
