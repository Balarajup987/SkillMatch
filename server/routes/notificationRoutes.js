import express from "express";
import {
  getMyNotifications,
  markAsRead
} from "../controllers/notificationController.js";

import {
  protect,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("candidate"),
  getMyNotifications
);

router.put(
  "/:id/read",
  protect,
  authorizeRoles("candidate"),
  markAsRead
);

export default router;