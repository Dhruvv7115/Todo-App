import { Router } from "express";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
const router = Router();

//generate access and refresh tokens
const generateAccessAndRefreshToken = async function (userId) {
  try {
    const user = await User.findById(userId)
    if(!userId){
      throw new ApiError(400, "User not found.")
    }
  
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
  
    //save the refresh token in db
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false })
  
    return {
      accessToken,
      refreshToken
    }
  } catch (error) {
    throw new ApiError(500, "Error in generating access and refresh token.")
  }
}

//signup
//done
router.post("/signup", async(req, res) => {
  const { fullname, email, password } = req.body;

  if(!fullname || !email || !password){
    throw new ApiError(400, "each field is required to signup.")
  }

  const existingUser = await User.findOne({
    email: email
  })

  if(existingUser){
    throw new ApiError(400, "User with this email already exists.");
  }

  try {
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      fullname,
    });

    const newUser = await User.findById(user._id).select("-password -refreshToken")

    if(!newUser){
      throw new ApiError(500, "There was a problem while creating the user.")
    }

    return res
      .status(200)
      .json(new ApiResponse(
        200, 
        newUser,
        "New User created successfully."
      ))

  } catch (error) {
    throw new ApiError(500, "Something went wrong.")
  }
  
})

//login
router.post("/login", async(req, res) => {
  const { email, password } = req.body;

  if(!email || !password){
    throw new ApiError(400, "All fields are required to login")
  }

  try {
    const user = await User.findOne({ email: email });
  
    if(!user){
      throw new ApiError(400, "User not found")
    }
    //check if password is correct.
    const isPasswordCorrect = await user.comparePassword(password);
    console.log(isPasswordCorrect)

    if(!isPasswordCorrect){
      throw new ApiError(400, "Incorrect Password")
    }

    const loggedInUser = await User.findOne({email}).select("-password -refreshToken")
  
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    }
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(
        200, 
        { user: loggedInUser, accessToken, refreshToken }, 
        "User logged in successfully."
      ))

  } catch (error) {
    console.log("login failed", error)
    throw new ApiError(500, "There was a problem while login.")
  }
})

//logout
router.post("/logout",(req, res) => {
  
})

export default router;