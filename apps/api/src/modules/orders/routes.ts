import { Router } from "express";
import * as orderController from "./controller.js";
import { authenticate, requireRole } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.get("/", authenticate, asyncHandler(orderController.listOrders));
router.get("/:id", authenticate, asyncHandler(orderController.getOrder));
router.post("/", authenticate, asyncHandler(orderController.createOrder));
router.put(
  "/:id/status",
  authenticate,
  requireRole("ADMIN", "SUPERADMIN"),
  asyncHandler(orderController.updateOrderStatus),
);

export default router;
