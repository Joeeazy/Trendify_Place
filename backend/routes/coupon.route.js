import express from "express";
import { getCoupon } from "../controllers/coupon.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//two endpoints getCurrentUserCoupon &

router.get("/", protectRoute, getCoupon);

export default router;
