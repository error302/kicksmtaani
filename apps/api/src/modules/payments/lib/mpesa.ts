import axios from "axios";
import { config } from "../../../config/index.js";

const BASE_URL = "https://sandbox.safaricom.co.ke";

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${config.mpesa.consumerKey}:${config.mpesa.consumerSecret}`,
  ).toString("base64");

  const response = await axios.get(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${auth}` },
    },
  );

  return response.data.access_token;
}

export async function stkPush(
  phone: string,
  amount: number,
  reference: string,
): Promise<any> {
  const token = await getAccessToken();

  const timestamp = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 14);
  const password = Buffer.from(
    `${config.mpesa.shortcode}${config.mpesa.passkey}${timestamp}`,
  ).toString("base64");

  const payload = {
    BusinessShortCode: config.mpesa.shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.ceil(amount),
    PartyA: phone.replace("+254", "254"),
    PartyB: config.mpesa.shortcode,
    PhoneNumber: phone.replace("+254", "254"),
    CallBackURL: config.mpesa.callbackUrl,
    AccountReference: reference,
    TransactionDesc: "KicksMtaani Order Payment",
  };

  const response = await axios.post(
    `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
}

export async function verifyPayment(checkoutRequestId: string): Promise<any> {
  const token = await getAccessToken();

  const timestamp = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 14);
  const password = Buffer.from(
    `${config.mpesa.shortcode}${config.mpesa.passkey}${timestamp}`,
  ).toString("base64");

  const payload = {
    BusinessShortCode: config.mpesa.shortcode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  };

  const response = await axios.post(
    `${BASE_URL}/mpesa/stkpushquery/v1/query`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
}
