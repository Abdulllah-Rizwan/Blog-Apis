import { uploadOnCloudinary } from "../utils/Cloundinary.js";
import { checkIfUserExists } from "../models/user.model.js";
import { getValidationDone } from "../utils/validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createUser } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";


export const httpRegisterUser = asyncHandler(async (req, res) => {
    
    const {username,fullName,email,password} = req.body;
    
    //validating incoming request
    const requiredFields = ['username','fullName','email','password','avatar'];
    getValidationDone(requiredFields,req.body);

    //checking if the user exists
    const user = await  checkIfUserExists(email,username);
    if(user) throw new ApiError(409,"User already exists");

    //graabing and validating files through te help of multer middleware
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("req.files",req.files);
    console.log("req.files.avatar",req.files.avatar);
 
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
       coverImageLocalPath = req.files.coverImage[0].path;
    }
 
    if(!avatarLocalPath) throw new ApiError(400,"Avatar is required");

    //uploading on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    //creating new user object 
    const newlyCreatedUser = await createUser({
        email,
        username,
        password,
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || ""
    });

    return res.status(200).json(new ApiResponse(200,newlyCreatedUser,"User created successfully"));
});