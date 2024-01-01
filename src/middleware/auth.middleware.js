import { asyncHandler } from "../utils/asyncHandler.js";
import{ ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.mongo.js";
import jwt from "jsonwebtoken";

export const varifyJWT = asyncHandler(async (req,_,next) => {
    try {
        const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer","");
        if(!token) throw new ApiError(401,"unauthorized equest");
        
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN);        
        if(!decodedToken) throw new ApiError(401,"unauthorized request");
        
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if(!user) throw new ApiError(401,"Invalid access token");
        
        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message ||"Unauthorized Request");
    }
});
