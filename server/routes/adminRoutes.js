import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  addViolation,
  restrictUser,
  unrestrictUser,
  getCandidates,
  getRecruiters,
} from "../controllers/adminController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard", 
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);

router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);
router.put(
  "/users/:id/violation",
  protect,
  authorizeRoles("admin"),
  addViolation
);

router.put(
  "/users/:id/restrict",
  protect,
  authorizeRoles("admin"),
  restrictUser
);


router.put(
  "/users/:id/unrestrict",
  protect,
  authorizeRoles("admin"),
  unrestrictUser
);
router.get(
  "/candidates",
  protect,
  authorizeRoles("admin"),
  getCandidates
);

router.get(
  "/recruiters",
  protect,
  authorizeRoles("admin"),
  getRecruiters
);

export default router;