import { prisma } from "@kicksmtaani/db";
import { OrderQuery } from "./schema.js";

export async function createOrder(data: {
  userId?: string;
  totalAmount: number;
  deliveryAddress: any;
  items: { variantId: string; quantity: number; price: number }[];
}) {
  return prisma.$transaction(async (tx) => {
    const lastOrder = await tx.order.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const orderNumber = lastOrder
      ? `KM-${String(parseInt(lastOrder.orderNumber.slice(3)) + 1).padStart(5, "0")}`
      : "KM-00001";

    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: data.userId,
        totalAmount: data.totalAmount,
        deliveryAddress: data.deliveryAddress,
        items: {
          create: data.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: { include: { variant: true } }, user: true },
    });

    for (const item of data.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stockQty: { decrement: item.quantity } },
      });
    }

    return order;
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { variant: true } },
      user: true,
      payments: true,
    },
  });
}

export async function getOrders(
  userId: string,
  query: OrderQuery,
  isAdmin: boolean,
) {
  const { status, page, limit } = query;

  const where: any = {};

  if (!isAdmin) {
    where.userId = userId;
  }

  if (status) {
    where.status = status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: true, items: { include: { variant: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, limit };
}

export async function updateOrderStatus(id: string, status: string) {
  return prisma.order.update({
    where: { id },
    data: { status: status as any },
    include: { user: true, items: { include: { variant: true } } },
  });
}

export async function createPayment(data: {
  orderId: string;
  provider: string;
  amount: number;
  phoneNumber?: string;
}) {
  return prisma.payment.create({
    data: {
      orderId: data.orderId,
      provider: data.provider as any,
      amount: data.amount,
      phoneNumber: data.phoneNumber,
      status: "PENDING",
    },
  });
}
