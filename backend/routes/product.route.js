import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//for the admin only route
router.get("/", protectRoute, adminRoute, getAllProducts);
// viewed by all customers
router.get("/featured", getFeaturedProducts);

export default router;
