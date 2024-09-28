import cloudinary from "../lib/cloudinary.js";
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

//admin  createproducts functionality
export const createProduct = async (req, res) => {
  //first save the product to the db
  //second create an image to store in the cloudinary bucket
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in the createProduct controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//admin  deleteproducts functionality
export const deleteProduct = async (req, res) => {
  //delete product from db and image from cloudinary bucket
  try {
    //check for product presence in the db
    const product = await Product.findById(req.params.id);

    //if no product
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //check for product image to  delete in cloudinary
    if (product.image) {
      //get id of the image
      const publicId = product.image.split("/").pop().split(".")[0];

      try {
        //delete from cloudinary using the id gotten above from cloudinary's products folder
        await cloudinary.uploader.destroy(`products/${publicId}`);

        console.log("deleted iamge from cloudinary successfully");
      } catch (error) {
        console.log("error deleteing image frm cloudinary", error);
      }
    }
    //delete product from mongodb
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteproducts controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
