import Coupon from "../models/coupon.model.js";

// Controller function to retrieve an active coupon for the current user
export const getCoupon = async (req, res) => {
  try {
    // Find an active coupon associated with the user's ID
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });

    // Return the coupon if found, otherwise return null
    res.json(coupon || null);
  } catch (error) {
    // Log the error message for debugging purposes
    console.log("Error in getCoupon controller", error.message);

    // Handle any server errors by returning a 500 status and an error message
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Controller function to validate a coupon for the current user
export const validateCoupon = async (req, res) => {
  try {
    // Extract the coupon code from the request body
    const { code } = req.body;

    // Find an active coupon matching the code and userId, and ensure it's active
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });

    // If no coupon is found, return a 404 error with a "Coupon not found" message
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // If the coupon has expired, deactivate it and return an "expired" message
    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save(); // Persist the updated coupon status to the database
      return res.status(404).json({ message: "Coupon expired" });
    }

    // If the coupon is valid, return a success message along with the discount details
    res.json({
      message: "Coupon is Valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    // Log any errors for debugging purposes
    console.log("Error in the validateCoupon controller", error.message);

    // Return a 500 status with a server error message
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
