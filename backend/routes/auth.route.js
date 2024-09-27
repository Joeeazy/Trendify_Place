import express from "express";

import {
  signup,
  login,
  logout,
  refreshToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

//signup route function
router.post("/signup", signup);

//login route function
router.post("/login", login);

//logout route function
router.post("/logout", logout);

//create new accesstoken after exipration
router.post("/refresh-token", refreshToken);

export default router;
