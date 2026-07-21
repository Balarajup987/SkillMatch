import express from "express";
import {createJob,getJobs,getJobById,getMyJobs,deleteJob,updateJob} from "../controllers/jobController.js";
import{protect,authorizeRoles} from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/",protect,authorizeRoles("recruiter"),createJob);
router.get("/",getJobs);
router.get("/my-jobs",protect,authorizeRoles("recruiter"),getMyJobs);
router.put("/:id",protect,authorizeRoles("recruiter"),updateJob);
router.delete("/:id",protect,authorizeRoles("recruiter"),deleteJob);
router.get("/:id",getJobById);


export default router;