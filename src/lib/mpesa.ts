/**
 * M-Pesa Daraja STK Push Integration
 *
 * Required env vars:
 *   MPESA_CONSUMER_KEY
 *   MPESA_CONSUMER_SECRET
 *   MPESA_SHORTCODE (paybill or till number)
 *   MPESA_PASSKEY
 *   MPESA_CALLBACK_URL (publicly accessible URL for Daraja to call back)
 *
 * If credentials are missing, functions return a demo-mode response so the
 * checkout flow still works end-to-end during development.
 */

const SAF_BASE =
  process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) return null;

  // Return cached token if still valid
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const res = await fetch(`${SAF_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!res.ok) {
    console.error("M-Pesa token fetch failed:", res.status, await res.text());
    return null;
  }
  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

function formatPhone(phone: string): string {
  // Convert 07XX XXX XXX → 2547XXXXXXXX
  let p = phone.replace(/\s+/g, "").replace(/^\+/, "");
  if (p.startsWith("254")) return p;
  if (p.startsWith("0")) return "254" + p.slice(1);
  if (p.startsWith("7") || p.startsWith("1")) return "254" + p;
  return p;
}

function generatePassword(): { password: string; timestamp: string } {
  const shortcode = process.env.MPESA_SHORTCODE || "174379";
  const passkey = process.env.MPESA_PASSKEY || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
  return { password, timestamp };
}

export interface StkPushResult {
  ok: boolean;
  demoMode: boolean;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  customerMessage?: string;
  error?: string;
}

export async function stkPush(
  phone: string,
  amount: number,
  orderNumber: string,
  accountRef: string
): Promise<StkPushResult> {
  const token = await getAccessToken();
  if (!token) {
    // Demo mode — no real credentials configured
    return {
      ok: true,
      demoMode: true,
      checkoutRequestId: `demo-${Date.now()}`,
      customerMessage: "Demo mode: M-Pesa credentials not configured. Order will be auto-confirmed.",
    };
  }

  const shortcode = process.env.MPESA_SHORTCODE || "174379";
  const callbackUrl = process.env.MPESA_CALLBACK_URL || "https://example.com/api/mpesa/callback";
  const { password, timestamp } = generatePassword();

  try {
    const res = await fetch(`${SAF_BASE}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: formatPhone(phone),
        PartyB: shortcode,
        PhoneNumber: formatPhone(phone),
        CallBackURL: callbackUrl,
        AccountReference: accountRef,
        TransactionDesc: `Payment for ${orderNumber}`,
      }),
    });

    const data = await res.json();
    if (data.ResponseCode === "0") {
      return {
        ok: true,
        demoMode: false,
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
        customerMessage: data.CustomerMessage,
      };
    }
    return {
      ok: false,
      demoMode: false,
      error: data.errorMessage || data.ResponseDescription || "STK push failed",
    };
  } catch (e: any) {
    return { ok: false, demoMode: false, error: e.message };
  }
}

/** Process the callback from Daraja — returns whether payment succeeded */
export function parseCallback(body: any): {
  success: boolean;
  mpesaRef?: string;
  amount?: number;
  phone?: string;
  checkoutRequestId?: string;
} {
  const callback = body?.Body?.stkCallback;
  if (!callback) return { success: false };
  const result = {
    success: callback.ResultCode === 0,
    checkoutRequestId: callback.CheckoutRequestID,
  } as any;
  if (callback.ResultCode === 0 && callback.CallbackMetadata?.Item) {
    for (const item of callback.CallbackMetadata.Item) {
      if (item.Name === "MpesaReceiptNumber") result.mpesaRef = item.Value;
      if (item.Name === "Amount") result.amount = item.Value;
      if (item.Name === "PhoneNumber") result.phone = String(item.Value);
    }
  }
  return result;
}
