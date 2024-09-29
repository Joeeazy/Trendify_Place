import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  getRecommendedProducts,
  createProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//for the admin only route
router.get("/", protectRoute, adminRoute, getAllProducts);
// viewed by all customers
router.get("/featured", getFeaturedProducts);
// Recommended products viewed by all customers
router.get("/recommendations", getRecommendedProducts);
// route to post products only admin can create product = protected route
router.post("/", protectRoute, adminRoute, createProduct);
// route to delete products only admin can delete product = protected route
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
