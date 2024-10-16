import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
//routes
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

import { connectDB } from "./lib/db.js";

//read contents of the .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//deployment
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" })); //allows you to parse the body of the request
app.use(cookieParser()); //enables manipulation of cookies
app.use(
  cors({
    origin: ["https://trendify-place.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
//authentication
app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/coupons", couponRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/analytics", analyticsRoutes);

//make frontend static
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  //mongodb connect
  connectDB();
});
