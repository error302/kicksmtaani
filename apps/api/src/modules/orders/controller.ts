import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as orderService from "./service.js";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const order = await orderService.createOrder(user?.userId, req.body);

  res.status(201).json({
    success: true,
    data: order,
  });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  const order = await orderService.getOrder(
    req.params.id,
    user?.userId,
    isAdmin,
  );

  res.json({
    success: true,
    data: order,
  });
});

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  const result = await orderService.listOrders(
    user?.userId,
    req.query,
    isAdmin,
  );

  res.json({
    success: true,
    data: result.orders,
    meta: {
      page: result.page,
      total: result.total,
      limit: result.limit,
    },
  });
});

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await orderService.updateOrderStatus(req.params.id, req.body);

    res.json({
      success: true,
      data: order,
    });
  },
);

export const initiatePayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { paymentProvider, phoneNumber } = req.body;
    const user = (req as any).user;
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

    const order = await orderService.getOrder(id, user?.userId, isAdmin);
    const amount = Number(order.totalAmount);

    const { initiateMpesaPayment, initiateFlutterwavePayment } =
      await import("../payments/service.js");

    let result;
    if (paymentProvider === "MPESA") {
      result = await initiateMpesaPayment(id, phoneNumber, amount);
    } else if (paymentProvider === "FLUTTERWAVE") {
      result = await initiateFlutterwavePayment(
        id,
        phoneNumber,
        user?.email,
        amount,
      );
    } else {
      res.status(400).json({
        error: { message: "Invalid payment provider" },
      });
      return;
    }

    res.json({
      success: true,
      data: result,
    });
  },
);
