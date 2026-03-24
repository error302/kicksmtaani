import nodemailer from "nodemailer";
import { config } from "../../../config/index.js";

const transporter = nodemailer.createTransport({
  host: config.smtp?.host,
  port: Number(config.smtp?.port),
  secure: true,
  auth: { user: config.smtp?.user, pass: config.smtp?.pass },
});

export async function sendEmail(to: string, subject: string, html: string) {
  if (!config.smtp?.host) {
    console.log("Email skipped - no SMTP configured");
    return null;
  }

  await transporter.sendMail({
    from: '"KicksMtaani" <noreply@kicksmtaani.co.ke>',
    to,
    subject,
    html,
  });
}

export async function sendOrderReceipt(email: string, order: any) {
  await sendEmail(
    email,
    `Order ${order.orderNumber} Confirmed`,
    `<h1>Thank you for your order!</h1>
     <p>Order Number: ${order.orderNumber}</p>
     <p>Total: KES ${Number(order.totalAmount).toLocaleString()}</p>
     <p>Delivery Address: ${order.deliveryAddress?.area}, ${order.deliveryAddress?.city}</p>`,
  );
}
