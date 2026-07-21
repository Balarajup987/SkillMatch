import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    resumeUrl: {
     type: String,
     required: true
    },

    status: {
        type: String,
        enum: [
          "pending",
          "shortlisted",
          "rejected"
        ],
        default: "pending"
    },
    atsScore: {
      type: Number
    },
    
    interviewDate: Date,
    meetingLink: String,
    interviewStatus: {
      type: String,
      enum: ["not_scheduled", "scheduled", "completed"],
      default: "not_scheduled"
    },
    
    strengths: [
      String
    ],
    
    weaknesses: [
      String
    ],
    
    suggestions: [
      String
    ],
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;