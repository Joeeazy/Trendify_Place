// Import necessary modules and functions
import express from "express";
import {
  checkOutSuccess,
  createCheckoutSession,
} from "../controllers/payment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"; // Middleware for authentication

const router = express.Router(); // Initialize the Express router

// Route to handle the creation of a Stripe checkout session, protected by authentication middleware
router.post("/create-checkout-session", protectRoute, createCheckoutSession);

// Route to handle successful Stripe checkout, protected by authentication middleware
router.post("/checkout-success", protectRoute, checkOutSuccess);

export default router; // Export the router for use in the main application
