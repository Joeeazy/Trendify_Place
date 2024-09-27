import Product from "../models/product.model.js";

//fucntion to fetch all products for the admin profile
export const getAllProducts = async (req, res) => {
  try {
    //fetch all products from db
    const products = await Product.find({}); //finds all products
    //send response to client
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
