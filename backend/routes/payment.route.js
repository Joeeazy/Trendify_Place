// Import necessary modules and functions
import express from "express";
import { createCheckoutSession } from "../controllers/payment.controller.js"; // Import checkout controller
import { protectRoute } from "../middleware/auth.middleware.js"; // Middleware for authentication
import Order from "../models/order.model.js";

const router = express.Router(); // Initialize the Express router

// Route to handle the creation of a Stripe checkout session, protected by authentication middleware
router.post("/create-checkout-session", protectRoute, createCheckoutSession);

// Route to handle successful Stripe checkout, protected by authentication middleware
router.post("/checkout-success", protectRoute, async (req, res) => {
  try {
    // Extract the Stripe session ID from the request body
    const { sessionId } = req.body;

    // Retrieve the Stripe session details using the session ID
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the payment status is "paid" (i.e., payment was successful)
    if (session.payment_status === "paid") {
      // If a coupon code was used, deactivate the coupon in the database
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode, // Find coupon by code
            userId: session.metadata.userId, // Ensure it belongs to the correct user
          },
          {
            isActive: false, // Set the coupon as inactive
          }
        );
      }

      // Parse the product information from the session metadata (it was stored as a JSON string)
      const products = JSON.parse(session.metadata.products);

      // Create a new order in the database with the payment and product details
      const newOrder = new Order({
        user: session.metadata.userId, // The user who made the purchase
        product: products.map((product) => ({
          product: product._id, // Store product ID
          quantity: product.quantity, // Store quantity of the product
          price: product.price, // Store the price of the product
        })),
        totalAmount: session.amount_total / 100, // Convert total amount from cents to dollars
        stripeSessionId: session.id, // Store the Stripe session ID
      });

      // Save the new order in the database
      await newOrder.save();

      // Respond with a success message and the new order ID
      res.status(200).json({
        success: true,
        message:
          "Payment successful, order created and coupon deactivated if used.",
        orderId: newOrder._id,
      });
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.log("Error in processing successful checkout", error.message);

    // Return a 500 status code for server errors
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router; // Export the router for use in the main application
