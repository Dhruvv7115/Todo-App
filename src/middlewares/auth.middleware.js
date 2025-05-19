import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
export const verifyJWT = async function(req, res, next){
  try {
    const token = req.cookies.accessToken || req.header("Authorization")?.split(" ")[1];

    if(!token){
      throw new ApiError(400, "User must be logged in")
    }

    //verify the token

    const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if(!verifiedToken){
      throw new ApiError(400, "Invalid Token")
    }

    const user = await User.findById(verifiedToken?._id).select("-password -refreshToken");

    if(!user){
      throw new ApiError(400, "Invalid access token")
    }

    req.user = user

    next()
  } catch (error) {
    console.log(error)
    throw new ApiError(400, "Invalid token.")
  }
}