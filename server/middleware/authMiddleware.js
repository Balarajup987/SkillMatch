import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
  
      console.log("AUTH HEADER:", req.headers.authorization);
  
      let token;
  
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
  
        token = req.headers.authorization.split(" ")[1];
  
        console.log("TOKEN:", token);
  
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET
        );
  
        console.log("DECODED:", decoded);
  
        req.user = await User.findById(decoded.id)
          .select("-password");
  
        next();
  
      } else {
  
        return res.status(401).json({
          message: "Not Authorized"
        });
  
      }
  
    } catch (error) {
  
      console.log("JWT ERROR:", error.message);
  
      return res.status(401).json({
        message: "Invalid Token"
      });
  
    }
  };

export const authorizeRoles = (...roles) => {

    return (req, res, next) => {
  
      if (!roles.includes(req.user.role)) {
  
        return res.status(403).json({
          message: "Access Denied"
        });
      }
      next();
    };
  };