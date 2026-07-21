import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import atsRoutes  from "./routes/atsRoutes.js";
import cors from "cors";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SkillMatch API Running");
});

app.use("/uploads",express.static("uploads"));
app.use("/api/auth",authRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/applications",applicationRoutes);
app.use("/api/upload",uploadRoutes);
app.use("/api/ats",atsRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/profile",profileRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/reports", reportRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});