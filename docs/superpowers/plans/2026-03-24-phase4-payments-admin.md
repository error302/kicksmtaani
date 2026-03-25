# Phase 4: Payments + Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement payment integrations (M-Pesa, Flutterwave), admin dashboard, SMS/email notifications, and analytics.

**Architecture:**

- API: Express module for payments with webhook handlers
- Web: Next.js admin pages with protected routes
- Notifications: Africa's Talking for SMS, Nodemailer for email

**Tech Stack:** Safaricom Daraja API, Flutterwave SDK, Africa's Talking, Nodemailer, Chart.js

---

## File Structure

```
apps/api/src/
├── modules/
│   ├── payments/           # NEW
│   │   ├── routes.ts
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── schema.ts
│   │   └── lib/
│   │       ├── mpesa.ts    # Daraja API client
│   │       ├── flutterwave.ts
│   │       └── webhooks.ts # Signature verification
│   ├── notifications/      # NEW
│   │   ├── sms.ts
│   │   └── email.ts
│   └── orders/
│       └── routes.ts       # MODIFY - add status update
apps/web/src/
├── app/
│   └── admin/             # NEW
│       ├── layout.tsx
│       ├── page.tsx       # Dashboard
│       ├── orders/
│       │   └── page.tsx
│       └── products/
│           └── page.tsx
├── components/
│   └── admin/             # NEW
│       ├── Sidebar.tsx
│       └── StatsChart.tsx
```

---

## Tasks

### Task 1: Payment Configuration & M-Pesa Integration

**Files:**

- Create: `apps/api/src/modules/payments/lib/mpesa.ts`
- Create: `apps/api/src/modules/payments/schema.ts`
- Modify: `apps/api/src/config/index.ts`

- [ ] **Step 1: Add payment env vars**

Update `.env.example`:

```
# M-Pesa
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=174379
MPESA_PASSKEY=
MPESA_CALLBACK_URL=https://api.kicksmtaani.co.ke/api/v1/payments/webhook/mpesa

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_SECRET_KEY=
FLUTTERWAVE_CALLBACK_URL=https://api.kicksmtaani.co.ke/api/v1/payments/webhook/flutterwave

# Notifications
AFRICASTALKING_API_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

- [ ] **Step 2: Create M-Pesa client**

```typescript
// apps/api/src/modules/payments/lib/mpesa.ts
import axios from "axios";
import { config } from "@/config";

const BASE_URL = "https://sandbox.safaricom.co.ke"; // Use production URL in prod

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

  const payload = {
    BusinessShortCode: config.mpesa.shortcode,
    Password: Buffer.from(
      `${config.mpesa.shortcode}${config.mpesa.passkey}${Date.now()}`,
    ).toString("base64"),
    Timestamp: new Date().toISOString().replace(/[-:.]/g, "").slice(0, 14),
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

export async function verifyPayment(transactionId: string): Promise<any> {
  const token = await getAccessToken();

  const payload = {
    TransactionType: "TransactionStatusQuery",
    TransactionID: transactionId,
    PartyA: config.mpesa.shortcode,
    IdentifierType: "4",
    Remarks: "Verify payment",
    Occasion: "Verify",
  };

  const response = await axios.post(
    `${BASE_URL}/mpesa/transactionstatus/v1/query`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/modules/payments/ apps/api/src/config/ && git commit -m "feat(api): add M-Pesa integration"
```

---

### Task 2: Flutterwave Integration

**Files:**

- Create: `apps/api/src/modules/payments/lib/flutterwave.ts`
- Create: `apps/api/src/modules/payments/service.ts`

- [ ] **Step 1: Install Flutterwave SDK**

```bash
cd apps/api && pnpm add flutterwave
```

- [ ] **Step 2: Create Flutterwave client**

```typescript
// apps/api/src/modules/payments/lib/flutterwave.ts
import { config } from "@/config";

const flw = {
  public_key: config.flutterwave.publicKey,
  secret_key: config.flutterwave.secretKey,
};

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
    { headers: { Authorization: `Bearer ${flw.secret_key}` } },
  );

  return response.data.data;
}

export async function verifyPayment(transactionId: string) {
  const response = await axios.get(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    { headers: { Authorization: `Bearer ${flw.secret_key}` } },
  );

  return response.data.data;
}
```

- [ ] **Step 2: Create payment service**

```typescript
// apps/api/src/modules/payments/service.ts
import { prisma } from "@kicksmtaani/db";
import { stkPush } from "./lib/mpesa";
import { initializePayment } from "./lib/flutterwave";

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
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/modules/payments/ && git commit -m "feat(api): add Flutterwave integration"
```

---

### Task 3: Payment Webhooks

**Files:**

- Create: `apps/api/src/modules/payments/controller.ts`
- Create: `apps/api/src/modules/payments/routes.ts`
- Modify: `apps/api/src/app.ts`

- [ ] **Step 1: Create webhook handler**

```typescript
// apps/api/src/modules/payments/controller.ts
import { Request, Response } from "express";
import { prisma } from "@kicksmtaani/db";
import crypto from "crypto";

export async function handleMpesaWebhook(req: Request, res: Response) {
  const { Body } = req.body;

  if (Body.stkCallback.ResultCode !== 0) {
    return res.json({ success: false });
  }

  const metadata = Body.stkCallback.CallbackMetadata?.Item;
  const receipt = metadata?.find(
    (i: any) => i.Name === "MpesaReceiptNumber",
  )?.Value;
  const phone = metadata?.find((i: any) => i.Name === "PhoneNumber")?.Value;
  const amount = metadata?.find((i: any) => i.Name === "Amount")?.Value;

  const payment = await prisma.payment.findFirst({
    where: { phoneNumber: phone, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  if (payment) {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "SUCCESS", providerRef: receipt },
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
    const payment = await prisma.payment.findUnique({
      where: { providerRef: String(data.id) },
    });

    if (payment && payment.status === "PENDING") {
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
```

- [ ] **Step 2: Create routes**

```typescript
// apps/api/src/modules/payments/routes.ts
import { Router } from "express";
import { handleMpesaWebhook, handleFlutterwaveWebhook } from "./controller";

const router = Router();

router.post("/webhook/mpesa", handleMpesaWebhook);
router.post("/webhook/flutterwave", handleFlutterwaveWebhook);

export default router;
```

- [ ] **Step 3: Wire up routes**

Modify `apps/api/src/app.ts`:

```typescript
import paymentsRoutes from "./modules/payments/routes";

// Add after other routes
app.use("/payments", paymentsRoutes);
```

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/modules/payments/ apps/api/src/app.ts && git commit -m "feat(api): add payment webhooks"
```

---

### Task 4: Notification Services

**Files:**

- Create: `apps/api/src/modules/notifications/sms.ts`
- Create: `apps/api/src/modules/notifications/email.ts`

- [ ] **Step 1: Install dependencies**

```bash
cd apps/api && pnpm add nodemailer
```

- [ ] **Step 2: Create SMS service**

```typescript
// apps/api/src/modules/notifications/sms.ts
import axios from "axios";
import { config } from "@/config";

const AT_API_URL = "https://api.africastalking.com/version1/messaging";

export async function sendSMS(to: string, message: string) {
  if (!config.africasTalking.apiKey) return;

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
) {
  return sendSMS(
    phone,
    `KicksMtaani: Order ${orderNumber} confirmed! KES ${amount} received. Delivery in 2-3 days.`,
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
```

- [ ] **Step 3: Create email service**

```typescript
// apps/api/src/modules/notifications/email.ts
import nodemailer from "nodemailer";
import { config } from "@/config";

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: Number(config.smtp.port),
  secure: true,
  auth: { user: config.smtp.user, pass: config.smtp.pass },
});

export async function sendEmail(to: string, subject: string, html: string) {
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
     <p>Total: KES ${order.totalAmount}</p>`,
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/modules/notifications/ && git commit -m "feat(api): add SMS and email notifications"
```

---

### Task 5: Admin Dashboard - Layout & Auth

**Files:**

- Create: `apps/web/src/app/admin/layout.tsx`
- Create: `apps/web/src/app/admin/page.tsx`
- Create: `apps/web/src/components/admin/Sidebar.tsx`

- [ ] **Step 1: Create admin layout**

```typescript
// apps/web/src/app/admin/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Sidebar } from '@/components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Create admin sidebar**

```typescript
// apps/web/src/components/admin/Sidebar.tsx
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-6">
      <h1 className="text-xl font-bold mb-8">KicksMtaani Admin</h1>
      <nav className="space-y-2">
        <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </Link>
        <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">
          <ShoppingCart className="w-5 h-5" /> Orders
        </Link>
        <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">
          <Package className="w-5 h-5" /> Products
        </Link>
      </nav>
    </aside>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/admin/ apps/web/src/components/admin/ && git commit -m "feat(web): add admin dashboard layout"
```

---

### Task 6: Admin Dashboard - Orders Management

**Files:**

- Create: `apps/web/src/app/admin/orders/page.tsx`

- [ ] **Step 1: Create orders page**

```typescript
// apps/web/src/app/admin/orders/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function AdminOrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.get('/admin/orders').then((r) => r.data),
  });

  const orders = data?.data || [];

  const updateStatus = async (orderId: string, status: string) => {
    await api.patch(`/admin/orders/${orderId}`, { status });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Order #</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-3">{order.orderNumber}</td>
                <td className="px-4 py-3">{order.deliveryAddress?.name}</td>
                <td className="px-4 py-3">KES {Number(order.totalAmount).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button className="text-primary hover:underline text-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/admin/orders/ && git commit -m "feat(web): add admin orders management"
```

---

### Task 7: Admin Dashboard - Products & Analytics

**Files:**

- Create: `apps/web/src/app/admin/products/page.tsx`
- Create: `apps/web/src/app/admin/page.tsx`
- Create: `apps/web/src/components/admin/StatsChart.tsx`

- [ ] **Step 1: Create analytics/dashboard page**

```typescript
// apps/web/src/app/admin/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const { data } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then((r) => r.data),
  });

  const stats = data?.data || {};

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: ShoppingCart },
    { label: 'Revenue', value: `KES ${Number(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign },
    { label: 'Products', value: stats.totalProducts || 0, icon: Package },
    { label: 'Customers', value: stats.totalCustomers || 0, icon: Users },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h2 className="font-semibold mb-4">Recent Orders</h2>
        {/* Add recent orders table */}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create products management page**

```typescript
// apps/web/src/app/admin/products/page.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useState } from 'react';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/admin/products').then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const products = data?.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">KES {Number(product.basePrice).toLocaleString()}</td>
                <td className="px-4 py-3">
                  {product.variants?.reduce((sum: number, v: any) => sum + v.stockQty, 0) || 0}
                </td>
                <td className="px-4 py-3">
                  <button className="text-primary hover:underline text-sm mr-3">Edit</button>
                  <button
                    onClick={() => deleteMutation.mutate(product.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/admin/page.tsx apps/web/src/app/admin/products/ && git commit -m "feat(web): add admin dashboard and products management"
```

---

### Task 8: Admin API Endpoints

**Files:**

- Create: `apps/api/src/modules/admin/routes.ts`
- Create: `apps/api/src/modules/admin/controller.ts`
- Modify: `apps/api/src/app.ts`

- [ ] **Step 1: Create admin routes**

```typescript
// apps/api/src/modules/admin/routes.ts
import { Router } from "express";
import { requireAdmin } from "@/middleware/auth";
import { getOrders, updateOrderStatus } from "./controller";
import { getStats } from "./controller";
import { getProducts, deleteProduct } from "./controller";

const router = Router();

router.use(requireAdmin);

router.get("/orders", getOrders);
router.patch("/orders/:id", updateOrderStatus);
router.get("/products", getProducts);
router.delete("/products/:id", deleteProduct);
router.get("/stats", getStats);

export default router;
```

- [ ] **Step 2: Create admin controller**

```typescript
// apps/api/src/modules/admin/controller.ts
import { Request, Response } from "express";
import { prisma } from "@kicksmtaani/db";

export async function getOrders(req: Request, res: Response) {
  const orders = await prisma.order.findMany({
    include: { user: true, items: { include: { variant: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ data: orders });
}

export async function updateOrderStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  res.json({ data: order });
}

export async function getProducts(req: Request, res: Response) {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ data: products });
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  res.json({ success: true });
}

export async function getStats(req: Request, res: Response) {
  const [totalOrders, totalRevenue, totalProducts, totalCustomers] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { totalAmount: true } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
    ]);

  res.json({
    data: {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalProducts,
      totalCustomers,
    },
  });
}
```

- [ ] **Step 3: Wire up routes**

Modify `apps/api/src/app.ts`:

```typescript
import adminRoutes from "./modules/admin/routes";
app.use("/admin", adminRoutes);
```

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/modules/admin/ apps/api/src/app.ts && git commit -m "feat(api): add admin API endpoints"
```

---

## Phase 4 Completion Checklist

- [ ] Task 1: M-Pesa Configuration & Integration
- [ ] Task 2: Flutterwave Integration
- [ ] Task 3: Payment Webhooks
- [ ] Task 4: SMS & Email Notifications
- [ ] Task 5: Admin Dashboard Layout
- [ ] Task 6: Orders Management
- [ ] Task 7: Products & Analytics
- [ ] Task 8: Admin API Endpoints
