import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadResume }
from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/resume",
  upload.single("resume"),
  uploadResume
);

export default router;