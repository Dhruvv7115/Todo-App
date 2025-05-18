import { Router } from "express";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
const router = Router();

//signup
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
router.post("/login",(req, res) => {
  res.send("user login route hit")
})

export default router;