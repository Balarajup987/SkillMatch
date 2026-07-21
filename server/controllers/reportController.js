import Report from "../models/Report.js";

export const createReport = async (req, res) => {

  try {

    const {
      reportedUser,
      reason,
      description
    } = req.body;

    if (reportedUser === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot report yourself."
      });
    }

    const alreadyReported =
      await Report.findOne({
        reporter: req.user._id,
        reportedUser,
        status: "pending"
      });

    if (alreadyReported) {
      return res.status(400).json({
        message: "You already reported this user."
      });
    }

    const report =
      await Report.create({

        reporter: req.user._id,

        reportedUser,

        reason,

        description

      });

    res.status(201).json({

      message: "Report Submitted",

      report

    });

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};