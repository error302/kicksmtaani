import { Request, Response } from "express";
import { prisma } from "@kicksmtaani/db";

export async function handleMpesaWebhook(req: Request, res: Response) {
  const { Body } = req.body;

  if (!Body?.stkCallback) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  if (Body.stkCallback.ResultCode !== 0) {
    return res.json({ success: false });
  }

  const metadata = Body.stkCallback.CallbackMetadata?.Item;
  const receipt = metadata?.find(
    (i: any) => i.Name === "MpesaReceiptNumber",
  )?.Value;
  const phone = metadata?.find((i: any) => i.Name === "PhoneNumber")?.Value;
  const amount = metadata?.find((i: any) => i.Name === "Amount")?.Value;

  if (!receipt || !phone) {
    return res.status(400).json({ error: "Missing transaction details" });
  }

  const payment = await prisma.payment.findFirst({
    where: {
      phoneNumber: { contains: phone.slice(-9) },
      status: "PENDING",
    },
    orderBy: { createdAt: "desc" },
    include: { order: true },
  });

  if (payment) {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "SUCCESS", providerRef: String(receipt) },
      }),
      prisma.order.update({
        where: { id: payment.orderId },
        data: { status: "CONFIRMED" },
      }),
    ]);
  }

  res.json({ success: true });
}

export async function handleFlutterwaveWebhook(req: Request, res: Response) {
  const signature = req.headers["verif-hash"];
  const expected = process.env.FLUTTERWAVE_SECRET_KEY;

  if (signature !== expected) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const { event, data } = req.body;

  if (event === "charge.completed" && data.status === "successful") {
    const payment = await prisma.payment.findFirst({
      where: {
        providerRef: String(data.id),
        status: "PENDING",
      },
      include: { order: true },
    });

    if (payment) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: "SUCCESS", providerRef: String(data.id) },
        }),
        prisma.order.update({
          where: { id: payment.orderId },
          data: { status: "CONFIRMED" },
        }),
      ]);
    }
  }

  res.json({ received: true });
}
