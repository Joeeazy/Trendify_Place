import express from "express";

import {
  signup,
  login,
  logout,
  refreshToken,
  getProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//signup route
router.post("/signup", signup);

//login route
router.post("/login", login);

//logout route
router.post("/logout", logout);

//create new accesstoken after exipration route
router.post("/refresh-token", refreshToken);

// get users profile route
router.get("/profile", protectRoute, getProfile);

export default router;
