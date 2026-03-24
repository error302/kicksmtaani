import axios from "axios";
import { config } from "../../../config/index.js";

const AT_API_URL = "https://api.africastalking.com/version1/messaging";

export async function sendSMS(to: string, message: string) {
  if (!config.africasTalking?.apiKey) {
    console.log("SMS skipped - no API key configured");
    return null;
  }

  const response = await axios.post(
    AT_API_URL,
    new URLSearchParams({ to, message }),
    {
      headers: {
        apiKey: config.africasTalking.apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data;
}

export async function sendOrderConfirmation(
  phone: string,
  orderNumber: string,
  amount: number,
) {
  return sendSMS(
    phone,
    `KicksMtaani: Order ${orderNumber} confirmed! KES ${amount.toLocaleString()} received. Delivery in 2-3 days.`,
  );
}

export async function sendShippingNotification(
  phone: string,
  orderNumber: string,
) {
  return sendSMS(
    phone,
    `KicksMtaani: Your order ${orderNumber} has been shipped! Track at kicksmtaani.co.ke/track`,
  );
}
