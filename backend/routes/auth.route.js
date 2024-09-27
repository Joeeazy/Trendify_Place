import express from "express";

import {
  signup,
  login,
  logout,
  refreshToken,
} from "../controllers/auth.controller.js";

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
//router.get("/profile", getProfile);

export default router;
