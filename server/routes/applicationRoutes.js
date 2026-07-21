import express from "express";
import {applyJob,getApplicants,updateApplicationStatus,getMyApplications,getAllRecruiterApplicants,scheduleInterview} from "../controllers/applicationController.js";

import {protect,authorizeRoles} from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/:id/apply",protect,authorizeRoles("candidate"),applyJob);
router.put("/:id/status",protect,authorizeRoles("recruiter"),updateApplicationStatus);
router.get("/my-applications",protect,authorizeRoles("candidate"),getMyApplications);
router.get("/recruiter/all",protect,authorizeRoles("recruiter"),getAllRecruiterApplicants);
router.get("/:id/applicants",protect,authorizeRoles("recruiter"),getApplicants);
router.put("/:id/schedule",protect,authorizeRoles("recruiter"),scheduleInterview);

export default router;