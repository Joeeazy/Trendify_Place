import { redis } from "../lib/redis.js";
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

//function to fetch allfeaturedproducts by a customer
export const getFeaturedProducts = async (req, res) => {
  try {
    //store to mongodb and redisdb for fast access(redis cache)
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      //redis returns the featuredProducts as a string
      return res.json(JSON.parse(featuredProducts));
    }

    // if the featured_products aare no present in redisdb get them from mongdb
    //.lean() = returns plain js objects instead of mongoDb objects
    //which is good for performance
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ meesage: "No featured proucts found" });
    }

    //if we have the products store in redis for quick acceess
    await redis.set("featured_products"), JSON.stringify(featuredProducts);

    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in the getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
