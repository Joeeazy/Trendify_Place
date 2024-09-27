import mongoose from "mongoose";

//create a products schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    category: {
      type: String,
      rrequired: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//create model
const Product = mongoose.model("Product", productSchema);

export default Product;
