import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";


export const registerUser = async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        message:
          "User already exists. Please login.",
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const token = generateToken(user._id);

   res.status(200).json({
    message: "User Created Successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      education: user.education,
      experience: user.experience,
      resumeUrl: user.resumeUrl
  }
});
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// login user
export const loginUser = async (req, res) => {
    try {
  
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
     if (!user) {
        return res.status(404).json({
          message:
            "Account not found. Please sign up first."
        });
      }
  
      const isMatch = await bcrypt.compare(
        password,
        user.password
      );
  
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid Credentials"
        });
      }
      if (!user.isActive || user.isRestricted) {
        return res.status(403).json({
        message: "Your account has been restricted by the administrator."
      });
}

      const token = generateToken(user._id);
  
    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        education: user.education,
        experience: user.experience,
        resumeUrl: user.resumeUrl
      }
    });
  
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

  export const getProfile = async (req, res) => {

    res.status(200).json({
      user: req.user
    });
  
  };

  
 export const updateProfile = async (req, res) => {
  try {
  const {
  education,
  experience,
  resumeUrl,
  skills
  } = req.body;
  
  req.user.education =
    education || req.user.education;
  
  req.user.experience =
    experience || req.user.experience;
  
  req.user.resumeUrl =
    resumeUrl || req.user.resumeUrl;
  
  req.user.skills =
    skills || req.user.skills;
  
  await req.user.save();
  
  res.json(req.user);
  
  } catch (error) {
  res.status(500).json({
  message: error.message
  });
  }
};
