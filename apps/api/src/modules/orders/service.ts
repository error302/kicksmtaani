import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderQuerySchema,
  CreateOrderInput,
} from "./schema.js";
import * as orderRepo from "./repository.js";
import { prisma } from "@kicksmtaani/db";
import { logger } from "../../lib/logger.js";

export async function createOrder(
  userId: string | undefined,
  input: CreateOrderInput,
) {
  const data = createOrderSchema.parse(input);

  for (const item of data.items) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: item.variantId },
    });

    if (!variant) {
      throw {
        statusCode: 400,
        code: "INVALID_ITEM",
        message: `Variant ${item.variantId} not found`,
      };
    }

    if (variant.stockQty < item.quantity) {
      throw {
        statusCode: 400,
        code: "INSUFFICIENT_STOCK",
        message: `Insufficient stock for size ${variant.size}`,
      };
    }
  }

  let totalAmount = 0;
  const orderItems: { variantId: string; quantity: number; price: number }[] =
    [];

  for (const item of data.items) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: item.variantId },
      include: { product: true },
    });

    const price = Number(
      variant?.priceOverride || variant?.product.basePrice || 0,
    );
    totalAmount += price * item.quantity;
    orderItems.push({
      variantId: item.variantId,
      quantity: item.quantity,
      price,
    });
  }

  const order = await orderRepo.createOrder({
    userId,
    totalAmount,
    deliveryAddress: data.deliveryAddress,
    items: orderItems,
  });

  await orderRepo.createPayment({
    orderId: order.id,
    provider: data.paymentProvider,
    amount: totalAmount,
    phoneNumber: data.phoneNumber,
  });

  logger.info("Order created", {
    orderId: order.id,
    orderNumber: order.orderNumber,
    totalAmount,
  });

  return order;
}

export async function getOrder(id: string, userId: string, isAdmin: boolean) {
  const order = await orderRepo.getOrderById(id);

  if (!order) {
    throw { statusCode: 404, code: "NOT_FOUND", message: "Order not found" };
  }

  if (!isAdmin && order.userId !== userId) {
    throw { statusCode: 403, code: "FORBIDDEN", message: "Access denied" };
  }

  return order;
}

export async function listOrders(userId: string, query: any, isAdmin: boolean) {
  const data = orderQuerySchema.parse(query);
  return orderRepo.getOrders(userId, data, isAdmin);
}

export async function updateOrderStatus(id: string, input: any) {
  const data = updateOrderStatusSchema.parse(input);

  const order = await orderRepo.updateOrderStatus(id, data.status);

  logger.info("Order status updated", { orderId: id, status: data.status });

  return order;
}
