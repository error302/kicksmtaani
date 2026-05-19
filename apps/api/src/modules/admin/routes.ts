import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth";
import {
  getUsers,
  getStats,
  getOrders,
  updateOrderStatus,
  getProducts,
  deleteProduct,
  uploadImage,
  createProduct,
} from "./controller";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/orders", getOrders);
router.patch("/orders/:id", updateOrderStatus);
router.get("/products", getProducts);
router.post("/products", createProduct);
router.delete("/products/:id", deleteProduct);
router.post("/upload", upload.array("images"), uploadImage);

export default router;
