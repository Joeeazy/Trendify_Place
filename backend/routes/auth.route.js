import express from "express";

import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

//signup route function
router.get("/signup", signup);

//login route function
router.get("/login", login);

//logout route function
router.get("/logout", logout);

export default router;
