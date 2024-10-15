import Product from "../models/product.model.js";

// Controller function to retrieve products in the user's cart
export const getCartProducts = async (req, res) => {
  try {
    // Find all products in the user's cart by matching their IDs
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    // Add the corresponding quantity to each product from the user's cartItems
    const cartItems = products.map((product) => {
      // Find the corresponding cart item for the product to get its quantity
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );

      // Return the product details with the added quantity information
      return { ...product.toJSON(), quantity: item.quantity };
    });

    // Send back the cart items with product details and quantities as a JSON response
    res.json(cartItems);
  } catch (error) {
    // Log the error message for debugging purposes
    console.log("Error in the getCartProducts controller", error.message);

    // Handle any server errors by returning a 500 status and an error message
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

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

// Controller function to handle removing items from the cart
export const removeAllFromCart = async (req, res) => {
  try {
    // Get the productId from the request body (if provided)
    const { productId } = req.body;

    // Get the user object from the request (usually populated by authentication middleware)
    const user = req.user;

    // If no productId is provided, clear the entire cart
    if (!productId) {
      user.cartItems = [];
    } else {
      // If productId is provided, filter the cart items to remove the specified product
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }

    // Save the updated user object (persist changes to the database)
    await user.save();

    // Send back the updated cart items as a JSON response
    res.json(user.cartItems);
  } catch (error) {
    // Handle any errors and respond with a 500 status and an error message
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Controller function to update the quantity of a product in the cart
export const updateQuantity = async (req, res) => {
  try {
    // Extract the productId from the request parameters
    const { id: productId } = req.params;

    // Get the new quantity from the request body
    const { quantity } = req.body;

    // Get the user object from the request (usually populated by authentication middleware)
    const user = req.user;

    // Find the product in the user's cart
    const existingItem = user.cartItems.find((item) => item.id === productId);

    // If the product exists in the cart
    if (existingItem) {
      // If the quantity is set to 0, remove the product from the cart
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id != productId);

        // Save the updated cart and return the modified cart
        await user.save();
        return res.json(user.cartItems); // Use 'return' to exit after removing the item
      }

      // Otherwise, update the product's quantity in the cart
      existingItem.quantity = quantity;

      // Save the updated cart and return the modified cart
      await user.save();
      res.json(user.cartItems);
    } else {
      // If the product is not found in the cart, return a 404 error
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    // Log the error message for debugging purposes
    console.log("Error in the updateQuantity controller", error.message);

    // Handle any server errors by returning a 500 status and an error message
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
