import axios from "axios";
import { config } from "../../../config/index.js";

const BASE_URL = "https://api.paypal.com/v1";

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${config.paypal.clientId}:${config.paypal.clientSecret}`
  ).toString("base64");

  const response = await axios.post(
    `${BASE_URL}/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

export async function createOrder(
  orderId: string,
  email: string,
  amount: number
) {
  const token = await getAccessToken();

  const response = await axios.post(
    `${BASE_URL}/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderId,
          amount: {
            currency_code: "KES",
            value: (amount / 100).toFixed(2),
          },
          description: "KicksMtaani Order",
          custom_id: orderId,
        },
      ],
      application_context: {
        return_url: config.paypal.callbackUrl,
        cancel_url: `${config.paypal.callbackUrl}?cancelled=true`,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    }
  );

  return response.data;
}

export async function captureOrder(orderId: string) {
  const token = await getAccessToken();

  const response = await axios.post(
    `${BASE_URL}/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function verifyPayment(paypalOrderId: string) {
  const token = await getAccessToken();

  const response = await axios.get(
    `${BASE_URL}/checkout/orders/${paypalOrderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}