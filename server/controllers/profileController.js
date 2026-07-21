import User from "../models/User.js";

export const getProfile = async (
req,
res
) => {
try {
const user = await User.findById(
req.user._id
).select("-password");

res.json(user);

} catch (error) {
res.status(500).json({
message: error.message
});
}
};

export const updateProfile =
async (req, res) => {
try {
const {
name,
skills,
education,
experience,
resumeUrl
} = req.body;

  const user =
    await User.findById(
      req.user._id
    );

  if (!user) {
    return res.status(404).json({
      message:
        "User not found"
    });
  }

  user.name =
    name || user.name;

  user.skills =
    skills || user.skills;

  user.education =
    education ||
    user.education;

  user.experience =
    experience ||
    user.experience;

  user.resumeUrl =
    resumeUrl ||
    user.resumeUrl;

  await user.save();

  res.json({
    message:
      "Profile updated",
    user
  });
} catch (error) {
  res.status(500).json({
    message: error.message
  });
}

};
