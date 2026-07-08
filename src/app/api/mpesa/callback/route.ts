import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseCallback } from "@/lib/mpesa";

/**
 * M-Pesa Daraja callback endpoint.
 * Daraja calls this URL after the customer completes (or cancels) the STK push.
 * We match by the AccountReference (order number) and update the order.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = parseCallback(body);

    // The callback doesn't include the order number directly — we use
    // CheckoutRequestID which we'd need to map. For simplicity here we
    // also accept an `orderNumber` query param that we appended to the
    // callback URL when initiating STK push (alternative pattern).
    const url = new URL(req.url);
    const orderNumber = url.searchParams.get("orderNumber");

    if (orderNumber) {
      const order = await db.order.findUnique({ where: { orderNumber } });
      if (order) {
        await db.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: result.success ? "SUCCESS" : "FAILED",
            mpesaRef: result.mpesaRef || null,
            status: result.success ? "CONFIRMED" : "PENDING",
          },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("M-Pesa callback error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
