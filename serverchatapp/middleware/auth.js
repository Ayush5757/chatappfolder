import User from "../models/User.js";
import jwt from "jsonwebtoken";

async function protectRoute(req, res, next) {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')
    if(!user) 
      return res.json({success: false, message: 'user not found'})
    req.user = user;
    next()
  } catch (error) {
    res.json({success: false, message: error.message})
  }
}

export default protectRoute