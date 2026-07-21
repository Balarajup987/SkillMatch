import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalCandidates = await User.countDocuments({
      role: "candidate",
    });

    const totalRecruiters = await User.countDocuments({
      role: "recruiter",
    });

    const totalJobs = await Job.countDocuments();

    const totalApplications =
      await Application.countDocuments();

    res.json({
      totalCandidates,
      totalRecruiters,
      totalJobs,
      totalApplications,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Violation
export const addViolation = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Don't allow restricting another admin
    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin cannot be restricted"
      });
    }

    user.violationCount += 1;

    if (user.violationCount >= 3) {
      user.isRestricted = true;
      user.isActive = false;
    }

    await user.save();

    res.status(200).json({
      message: "Violation Added",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// restricted

export const restrictUser = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin cannot be restricted"
      });
    }

    user.isRestricted = true;
    user.isActive = false;

    await user.save();

    res.json({
      message: "User Restricted"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
// Unrestrict User
export const unrestrictUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.violationCount = 0;
    user.isRestricted = false;
    user.isActive = true;

    await user.save();

    res.status(200).json({
      message: "User Unrestricted",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getCandidates = async (req, res) => {

  try {

    const candidates = await User.find({
      role: "candidate"
    }).select("-password");

    res.json(candidates);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

export const getRecruiters = async (req, res) => {

  try {

    const recruiters = await User.find({
      role: "recruiter"
    }).select("-password");

    res.json(recruiters);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};