import axios from "axios";
import { config } from "../../../config/index.js";

export async function initializePayment(
  phone: string,
  email: string,
  amount: number,
  reference: string,
) {
  const response = await axios.post(
    "https://api.flutterwave.com/v3/payments",
    {
      tx_ref: reference,
      amount: Math.ceil(amount),
      currency: "KES",
      redirect_url: config.flutterwave.callbackUrl,
      customer: { email, phone },
      customizations: {
        title: "KicksMtaani",
        logo: "https://kicksmtaani.co.ke/logo.png",
      },
    },
    { headers: { Authorization: `Bearer ${config.flutterwave.secretKey}` } },
  );

  return response.data.data;
}

export async function verifyPayment(transactionId: string) {
  const response = await axios.get(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    { headers: { Authorization: `Bearer ${config.flutterwave.secretKey}` } },
  );

  return response.data.data;
}
