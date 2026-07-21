import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const createJob = async (req, res) => {
  try {

    const {
      title,
      company,
      location,
      salary,
      description,
      requirements
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      salary,
      description,
      requirements,
      createdBy: req.user._id
    });

    res.status(201).json(job);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
export const getJobs=async(req,res)=>{
    try{
        const jobs=await Job.find();
        res.status(200).json({
            message: "Jobs fetched successfully",
            jobs
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

// get job by id
export const getJobById = async (req, res) => {
    try {
  
      const job = await Job.findById(req.params.id);
  
      if (!job) {
        return res.status(404).json({
          message: "Job not found"
        });
      }
  
      res.status(200).json(job);
  
    } catch (error) {
  
      res.status(500).json({
        message: error.message
      });
  
    }
  };

  export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      createdBy: req.user._id
    });

    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const pending =
          await Application.countDocuments({
            job: job._id,
            status: "pending"
          });

        const shortlisted =
          await Application.countDocuments({
            job: job._id,
            status: "shortlisted"
          });

        const rejected =
          await Application.countDocuments({
            job: job._id,
            status: "rejected"
          });

        const totalApplicants =
          await Application.countDocuments({
            job: job._id
          });

        return {
          ...job.toObject(),
          pending,
          shortlisted,
          rejected,
          totalApplicants
        };
      })
    );

    res.status(200).json(jobsWithStats);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
  export const deleteJob = async (req, res) => {
    try {
  
      const job = await Job.findById(
        req.params.id
      );
  
      if (!job) {
        return res.status(404).json({
          message: "Job not found"
        });
      }
  
      if (
        job.createdBy.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message: "Access Denied"
        });
      }
  
      await job.deleteOne();
  
      res.status(200).json({
        message: "Job Deleted Successfully"
      });
  
    } catch (error) {
  
      res.status(500).json({
        message: error.message
      });
  
    }
  };

  export const updateJob = async (req, res) => {
    try {
  
      const job = await Job.findById(req.params.id);
  
      if (!job) {
        return res.status(404).json({
          message: "Job not found"
        });
      }
  
      if (
        job.createdBy.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message: "Access Denied"
        });
      }
  
      const updatedJob = await Job.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
  
      res.status(200).json({
        message: "Job Updated Successfully",
        updatedJob
      });
  
    } catch (error) {
  
      res.status(500).json({
        message: error.message
      });
  
    }
  };