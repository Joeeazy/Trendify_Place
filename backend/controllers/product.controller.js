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

// Controller to get randomly selected recommended products
export const getRecommendedProducts = async (req, res) => {
  // Try-catch block for error handling
  try {
    // Use the aggregation pipeline to get random products
    const products = await Product.aggregate([
      {
        // $sample stage to randomly select 3 products from the collection
        $sample: { size: 3 },
      },
      {
        // $project stage to specify the fields to return
        $project: {
          _id: 1, // Include the product ID
          name: 1, // Include the product name
          description: 1, // Include the product description
          image: 1, // Include the product image
          price: 1, // Include the product price
        },
      },
    ]);

    // Send the selected products back as a JSON response
    res.json(products);
  } catch (error) {
    // Log the error to the console if something goes wrong
    console.log(
      "Error in the getRecommendedProducts controller",
      error.message
    );

    // Send a 500 error response to the client indicating a server error
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Controller to get products based on the category
export const getProductsByCategory = async (req, res) => {
  // Destructure 'category' from request parameters
  const { category } = req.params;

  // Try-catch block for error handling
  try {
    // Query the database to find products that match the specified category
    const products = await Product.find({ category });

    // Send the found products as a JSON response
    res.json({ products });
  } catch (error) {
    // Log the error message in case of failure
    console.log("Error in getProductsByCategory controller", error.message);

    // Send a 500 error response with error details if something goes wrong
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Controller to toggle the 'isFeatured' status of a product
export const toggleFeaturedProduct = async (req, res) => {
  try {
    // Find the product by its ID from the request parameters
    const product = await Product.findById(req.params.id);

    // Check if the product exists
    if (product) {
      // Toggle the 'isFeatured' status by flipping its value (true <-> false)
      product.isFeatured = !product.isFeatured;

      // Save the updated product back to the database
      const updatedProduct = await product.save();

      // Call the function to update the Redis cache for featured products
      await updateFeaturedProductsCache();

      // Send the updated product as a response to the client
      res.json(updatedProduct);
    } else {
      // If the product isn't found, respond with a 404 (Not Found) status
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    // Log the error message if something goes wrong
    console.log("Error in the toggleFeaturedProduct controller", error.message);

    // Respond with a 500 (Server Error) status and the error message
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Helper function to update the cache of featured products in Redis
async function updateFeaturedProductsCache() {
  try {
    // Query to find all products that are featured, using 'lean()' for performance
    // 'lean()' returns plain JavaScript objects instead of full Mongoose documents
    const featuredProducts = await Product.find({ isFeatured: true }).lean();

    // Update the Redis cache with the list of featured products, converting it to JSON format
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    // Log any errors that occur during the cache update
    console.log("Error in updateFeaturedProductsCache function");
  }
}
