import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs'

export async function signUp(req, res) {
  
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.json({success: false, message: 'Missing Details'});
    }
    const user = await User.findOne({email})
    if (user) {
      return  res.json({success: false, message: 'Account already exist'});
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    const  newUser = await User.create({
      fullName, email, password: hashedPassword
    })
    const token = generateToken(newUser._id)
    res.json({success: true, userData: newUser, token, message: 'Account created successfully'});
  } catch (error) {
    res.json({success: false, message: error.message});
  }
}

export async function login(req, res){
  try {
    const {email, password} = req.body;
    const userData = await User.findOne({email})

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if(!isPasswordCorrect){
      return res.json({success: false, message: 'Invalid credentials'})
    }

    const token = generateToken(userData._id)
    res.json({success: true, userData, token, message: 'Login Successfull'})
  } catch (error) {
    res.json({success: false, message: error.message})
  }
}

export function checkAuth(req, res){
  
  res.json({success: true, user: req.user})
}

export async function updateProfile(req, res){
  try {
    const {profilePic, fullName} = req.body;
    
    const userId = req.user._id;
    let updatedUser;
    if(!profilePic){
      updatedUser = await User.findByIdAndUpdate(userId, {fullName}, {new: true})
    }else{
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(userId, {fullName, profilePic: upload.secure_url}, {new: true})
    }
    res.json({success: true, user: updatedUser})
  } catch (error) {
    res.json({success: false, message: error.message})
  }
}
