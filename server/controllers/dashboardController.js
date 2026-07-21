import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getDashboardStats =
async (req, res) => {
try {
const user = req.user;

if (user.role === "recruiter") {
  const recruiterJobs =
    await Job.find({
      createdBy: user._id
    }).sort({ createdAt: -1 });

  const jobIds =
    recruiterJobs.map(
      (job) => job._id
    );

  const jobsPosted =
    recruiterJobs.length;

  const totalApplicants =
    await Application.countDocuments({
      job: { $in: jobIds }
    });

  const pending =
    await Application.countDocuments({
      job: { $in: jobIds },
      status: "pending"
    });

  const shortlisted =
    await Application.countDocuments({
      job: { $in: jobIds },
      status: "shortlisted"
    });

  const rejected =
    await Application.countDocuments({
      job: { $in: jobIds },
      status: "rejected"
    });

  const recentApplicants =
    await Application.find({
      job: { $in: jobIds }
    })
    .populate("candidate", "name email")
    .populate("job", "title company")
    .sort({ createdAt: -1 })
    .limit(5);

  return res.json({
    jobsPosted,
    totalApplicants,
    pending,
    shortlisted,
    rejected,
    recentApplicants,
    recentJobs:
      recruiterJobs.slice(0, 4)
  });
}

if (user.role === "candidate") {
  const appliedJobs =
    await Application.countDocuments({
      candidate: user._id
    });

  const shortlisted =
    await Application.countDocuments({
      candidate: user._id,
      status: "shortlisted"
    });

  const rejected =
    await Application.countDocuments({
      candidate: user._id,
      status: "rejected"
    });

  const pending =
    await Application.countDocuments({
      candidate: user._id,
      status: "pending"
    });

  const recentApplications =
    await Application.find({
      candidate: user._id
    })
    .populate("job", "title company location")
    .sort({ createdAt: -1 })
    .limit(5);

  const recommendedJobs =
    await Job.find()
    .sort({ createdAt: -1 })
    .limit(4);

  return res.json({
    appliedJobs,
    shortlisted,
    rejected,
    pending,
    recentApplications,
    recommendedJobs
  });
}

} catch (error) {
res.status(500).json({
message: error.message
});
}
};
