import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { handleMpesaWebhook, handleFlutterwaveWebhook } from "./controller.js";

const router: ExpressRouter = Router();

router.post("/webhook/mpesa", handleMpesaWebhook);
router.post("/webhook/flutterwave", handleFlutterwaveWebhook);

export default router;
