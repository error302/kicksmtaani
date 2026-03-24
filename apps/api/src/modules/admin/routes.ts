import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth";
import {
  getStats,
  getOrders,
  updateOrderStatus,
  getProducts,
  deleteProduct,
} from "./controller";

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

router.get("/stats", getStats);
router.get("/orders", getOrders);
router.patch("/orders/:id", updateOrderStatus);
router.get("/products", getProducts);
router.delete("/products/:id", deleteProduct);

export default router;
