
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { extractResumeText } from "./atsController.js";
import { analyzeResumeWithAI } from "../utils/aiService.js";
import Notification from "../models/Notification.js";
import sendEmail from "../utils/sendEmail.js";

// Convert AI response into a JavaScript object
const parseAIResult = (atsResult) => {
  if (
    typeof atsResult === "object" &&
    atsResult !== null &&
    !Array.isArray(atsResult)
  ) {
    return atsResult;
  }

  if (typeof atsResult !== "string") {
    throw new Error("Invalid AI response format");
  }

  const cleanResult = atsResult
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanResult);
};

// Validate AI response fields
const validateAIResult = (result) => {
  if (
    typeof result.score !== "number" ||
    !Array.isArray(result.strengths) ||
    !Array.isArray(result.weaknesses) ||
    !Array.isArray(result.suggestions)
  ) {
    throw new Error("AI returned an invalid ATS result");
  }

  return result;
};

export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Only candidate can apply
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        message: "Only candidates can apply"
      });
    }

    // Check job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    // Prevent duplicate application
    const alreadyApplied = await Application.findOne({
      candidate: req.user._id,
      job: jobId
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "Already Applied"
      });
    }

    const { resumeUrl } = req.body;

    if (!resumeUrl) {
      return res.status(400).json({
        message: "Resume required"
      });
    }

    // Extract resume text
    const resumeText = await extractResumeText(resumeUrl);

    // Analyze resume using Groq AI
    const atsResult = await analyzeResumeWithAI(resumeText);

    console.log("AI response:", atsResult);

    // Parse and validate AI response
    const parsedResult = validateAIResult(
      parseAIResult(atsResult)
    );

    console.log("Parsed AI result:", parsedResult);

    // Create application
    const application = await Application.create({
      candidate: req.user._id,
      job: jobId,
      resumeUrl,
      atsScore: parsedResult.score,
      strengths: parsedResult.strengths,
      weaknesses: parsedResult.weaknesses,
      suggestions: parsedResult.suggestions
    });

    return res.status(201).json({
      message: "Applied Successfully",
      application
    });

  } catch (error) {
    console.error("Apply Job Error:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    // Only recruiter who created job
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    const applications = await Application.find({
      job: jobId
    }).populate("candidate", "name email role");

    return res.status(200).json(applications);

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatus = [
      "pending",
      "shortlisted",
      "rejected"
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid Status"
      });
    }

    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("candidate");

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    if (
      application.job.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    application.status = status;

    await application.save();

    await Notification.create({
      user: application.candidate._id,
      message:
        status === "shortlisted"
          ? `You were shortlisted for ${application.job.title}`
          : `Your application was rejected for ${application.job.title}`
    });

    return res.status(200).json({
      message: "Status Updated Successfully",
      application
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user._id
    }).populate(
      "job",
      "title company location salary"
    );

    return res.status(200).json(applications);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

export const getAllRecruiterApplicants = async (req, res) => {
  try {
    const recruiterJobs = await Job.find({
      createdBy: req.user._id
    }).select("_id");

    const jobIds = recruiterJobs.map(
      (job) => job._id
    );

    const applications = await Application.find({
      job: { $in: jobIds }
    })
      .populate("candidate", "name email")
      .populate("job", "title company");

    return res.status(200).json(applications);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

export const scheduleInterview = async (req, res) => {
  try {
    const { interviewDate, meetingLink } = req.body;

    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("candidate");

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    if (
      application.job.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    application.interviewDate = interviewDate;
    application.meetingLink = meetingLink;
    application.interviewStatus = "scheduled";

    await application.save();

    // Send interview email
    try {
      console.log("Sending Interview Email...");

      const emailText = `
Hello ${application.candidate.name},

Congratulations!

Your interview has been scheduled.

Interview Details

Company: ${application.job.company}
Job Role: ${application.job.title}
Date: ${new Date(application.interviewDate).toLocaleDateString()}
Time: ${new Date(application.interviewDate).toLocaleTimeString()}

Meeting Link:
${application.meetingLink}

Please join 10 minutes early.

Best of Luck!

SkillMatch Team
`;

      await sendEmail(
        application.candidate.email,
        "Interview Scheduled",
        emailText
      );

      console.log("Email Sent Successfully");

    } catch (err) {
      console.log("Email Error:", err.message);
    }

    await Notification.create({
      user: application.candidate._id,
      message: `Interview scheduled for ${application.job.title}`
    });

    return res.status(200).json({
      message: "Interview Scheduled",
      application
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
