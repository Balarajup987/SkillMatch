import User from "../models/User.js";

import express from "express";
import { registerUser,loginUser, getProfile } from "../controllers/authController.js";
import { protect,authorizeRoles } from "../middleware/authMiddleware.js";
import { updateProfile } from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile",protect,updateProfile);
export default router;