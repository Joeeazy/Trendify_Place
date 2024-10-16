import { stripe } from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

export const createCheckoutSession = async (req, res) => {
  try {
    // Extract products and optional coupon code from the request body
    const { products, couponCode } = req.body;

    // Validate the products array to ensure it is not empty or invalid
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    // Initialize totalAmount to calculate the total price of the products
    let totalAmount = 0;

    // Map through the products array to create line items for Stripe checkout
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // Stripe requires amounts in cents
      totalAmount += amount * product.quantity; // Calculate total amount for all items

      // Return the line item data required by Stripe
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name, // Product name
            images: [product.image], // Product image
          },
          unit_amount: amount, // Price per unit in cents
        },
        quantity: product.quantity || 1,
      };
    });

    // Initialize coupon as null
    let coupon = null;

    // If a coupon code is provided, search for the active coupon in the database
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id, // Ensure the coupon belongs to the user
        isActive: true, // Ensure the coupon is active
      });

      // If a valid coupon is found, apply the discount to the total amount
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        ); // Subtract discount from total
      }
    }

    // Create a Stripe checkout session with the product details, payment methods, and optional discount
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Only card payments are allowed
      line_items: lineItems, // Line items for the products
      mode: "payment", // Payment mode (one-time)
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`, // Redirect URL on success
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`, // Redirect URL on cancellation
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage), // Apply discount if coupon exists
            },
          ]
        : [], // No discount if coupon is null
      metadata: {
        userId: req.user._id.toString(), // Store user ID in the metadata
        couponCode: couponCode || "", // Store coupon code in the metadata (if available)
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });

    // If totalAmount exceeds or equals $200 (20,000 cents), generate a new coupon for the user
    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id); // Call the function to create a new coupon for the user
    }

    // Send the session ID and total amount (converted to dollars) as the response
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    // Log the error message for debugging purposes
    console.error("Error in creating checkout session", error.message);

    // Return a 500 status code for server errors
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Function to create a coupon in Stripe based on the discount percentage
async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage, // Set the discount percentage
    duration: "once", // The coupon can only be used once
  });
  return coupon.id; // Return the Stripe coupon ID
}

// Function to create a new coupon in the database for the user after purchase
async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(), // Generate a random coupon code
    discountPercentage: 10, // Set the discount to 10%
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expire the coupon in 30 days
    userId: userId, // Assign the coupon to the user
  });

  await newCoupon.save(); // Save the new coupon in the database

  return newCoupon; // Return the new coupon object
}

export const checkOutSuccess = async (req, res) => {
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
};
