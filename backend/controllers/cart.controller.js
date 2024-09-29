// Controller function to handle adding items to the cart
export const addToCart = async (req, res) => {
  try {
    // Extract the productId from the request body
    const { productId } = req.body;

    // Get the user object from the request (usually populated by authentication middleware)
    const user = req.user;

    // Check if the product already exists in the user's cart
    const exisitingItem = user.cartItems.find((item) => item.id === productId);

    // If the item is already in the cart, increment its quantity
    if (exisitingItem) {
      exisitingItem.quantity += 1;
    } else {
      // If the item is not in the cart, add the productId to the cartItems array
      user.cartItems.push(productId);
    }

    // Save the updated user object (persist changes to the database)
    await user.save();

    // Send back the updated cart items as a JSON response
    res.json(user.cartItems);
  } catch (error) {
    // Handle any errors and log the error message for debugging
    console.log("Error in the addToCart Controller", error.message);

    // Return a 500 status and a generic error message if something goes wrong
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {};

export const updateQuantity = async (req, res) => {};

export const getCartProducts = async (req, res) => {};
