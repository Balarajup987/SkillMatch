export const uploadResume = async (
  req,
  res
) => {

  console.log(req.file);
  console.log(req.body);

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    res.status(200).json({
      message: "Resume Uploaded Successfully",
      filePath: req.file.path
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};