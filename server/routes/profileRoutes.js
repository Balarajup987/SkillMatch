import express from "express";
import {
getProfile,
updateProfile
} from "../controllers/authController.js";

import {
protect
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);

export default router;
