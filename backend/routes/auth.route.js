import express from "express";

import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

//signup route function
router.post("/signup", signup);

//login route function
router.post("/login", login);

//logout route function
router.post("/logout", logout);

export default router;
