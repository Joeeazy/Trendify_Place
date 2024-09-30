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
