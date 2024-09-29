import express from "express";
import {
  getCartProducts,
  addToCart,
  removeAllFromCart,
  updateQuantity,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//get all products in the cart
router.get("/", protectRoute, getCartProducts);

//add product to cart route
router.post("/", protectRoute, addToCart);

//delete all from cart
router.delete("/", protectRoute, removeAllFromCart);

//update quantity of products
router.put("/:id", protectRoute, updateQuantity);

export default router;
