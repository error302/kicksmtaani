import { prisma } from "@kicksmtaani/db";
import { stkPush } from "./lib/mpesa";
import { initializePayment } from "./lib/flutterwave";
import { createOrder as createPaypalOrder } from "./lib/paypal";

export async function initiateMpesaPayment(
  orderId: string,
  phone: string,
  amount: number,
) {
  const payment = await prisma.payment.create({
    data: {
      orderId,
      provider: "MPESA",
      amount,
      phoneNumber: phone,
      status: "PENDING",
    },
  });

  await stkPush(phone, amount, payment.id);

  return payment;
}

export async function initiateFlutterwavePayment(
  orderId: string,
  phone: string,
  email: string,
  amount: number,
) {
  const payment = await prisma.payment.create({
    data: {
      orderId,
      provider: "FLUTTERWAVE",
      amount,
      phoneNumber: phone,
      status: "PENDING",
    },
  });

  const result = await initializePayment(phone, email, amount, payment.id);

  return { payment, checkoutUrl: result.link };
}

export async function initiatePaypalPayment(
  orderId: string,
  email: string,
  amount: number,
) {
  const payment = await prisma.payment.create({
    data: {
      orderId,
      provider: "PAYPAL",
      amount,
      phoneNumber: email,
      status: "PENDING",
    },
  });

  const result = await createPaypalOrder(payment.id, email, amount);

  return { payment, approvalLink: result.links.find((l: any) => l.rel === "approval_url")?.href };
}
