import { Request, Response } from "express";
import { prisma } from "@kicksmtaani/db";

export async function getStats(_req: Request, res: Response) {
  try {
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
  } catch (error) {
    res.status(500).json({ error: { message: "Failed to fetch stats" } });
  }
}

export async function getOrders(_req: Request, res: Response) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { email: true, fullName: true } },
        items: { include: { variant: true } },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: orders });
  } catch (error) {
    res.status(500).json({ error: { message: "Failed to fetch orders" } });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: { message: "Invalid status" } });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json({ data: order });
  } catch (error) {
    res.status(500).json({ error: { message: "Failed to update order" } });
  }
}

export async function getProducts(_req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      include: { variants: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ error: { message: "Failed to fetch products" } });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: { message: "Failed to delete product" } });
  }
}
