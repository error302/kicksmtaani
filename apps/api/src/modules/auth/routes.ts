import { Router } from "express";
import * as authController from "./controller.js";
import { authenticate } from "../../middleware/auth.js";
import { authRateLimiter } from "../../middleware/rateLimit.js";

const router = Router();

router.post("/register", authRateLimiter, authController.register);
router.post("/login", authRateLimiter, authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getProfile);

export default router;

