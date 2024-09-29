import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  getRecommendedProducts,
  getProductsByCategory,
  createProduct,
  toggleFeaturedProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//for the admin only route
router.get("/", protectRoute, adminRoute, getAllProducts);

// viewed by all customers
router.get("/featured", getFeaturedProducts);

// customer route to get products by category route
router.get("/category/:category", getProductsByCategory);

// Recommended products viewed by all customers route
router.get("/recommendations", getRecommendedProducts);

// route to post products only admin can create product = protected route
router.post("/", protectRoute, adminRoute, createProduct);

// updates by admin on featured products route
router.patch("/", protectRoute, adminRoute, toggleFeaturedProduct);

// route to delete products only admin can delete product = protected route
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
