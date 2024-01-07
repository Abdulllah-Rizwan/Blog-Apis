import { updateUserAvatarOrCoverImage } from "../models/user.model.js";
import { updateUserAccountDetails } from "../models/user.model.js";
import { getValidationDoneForFiles } from "../utils/validation.js";
import { updateUserRefreshToken } from "../models/user.model.js";
import { deleteFromCloudinary } from "../utils/Cloundinary.js";
import { uploadOnCloudinary } from "../utils/Cloundinary.js";
import { checkIfUserExists } from "../models/user.model.js";
import { getValidationDone } from "../utils/validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { findUserById } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createUser } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";


export const httpRegisterUser = asyncHandler(async (req, res) => {
    
    const {username,fullName,email,password} = req.body;
    
    //validating incoming request
    const requiredFields = ['username','fullName','email','password'];
    const requiredFieldsForFiles = ['avatar'];
    getValidationDone(requiredFields,req.body);
    getValidationDoneForFiles(requiredFieldsForFiles,req.files);

    //checking if the user exists
    const user = await checkIfUserExists({email,username});
    if(user) throw new ApiError(409,"User already exists");

    //graabing and validating files through te help of multer middleware
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log("req.files",req.files);
    // console.log("req.files.avatar",req.files.avatar);
 
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
        avatar: { url: avatar.url, publicId: avatar.public_id },
        coverImage: { url: coverImage?.url || "", publicId: coverImage?.public_id || "" }
        });

    return res.status(200).json(new ApiResponse(200,newlyCreatedUser,"User created successfully"));
});

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await findUserById(userId);
    
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});
    
        return { accessToken, refreshToken }
    } catch (e) {
        throw new ApiError(500,e?.message || "Something went wrong whilst generating access and refresh tokens.");
    }; 
}

export const httpLoginUser = asyncHandler(async (req, res) => {
    const {username,password} = req.body;
    
    const requiredFields = ['username','password'];
    getValidationDone(requiredFields,req.body);

    const user = await checkIfUserExists({username});
    if(!user) throw new ApiError(404,"User not found");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) throw new ApiError(401,"Invalid credentials");

    const { accessToken , refreshToken } = await generateAccessAndRefreshToken(user._id);
   
    const loggedInUser = await findUserById(user._id)
    const options = {
        httpOnly: true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully")
    );
});

export const httpLogoutUser = asyncHandler(async (req, res) => {
    await updateUserRefreshToken(req.user?._id);

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json (
        new ApiResponse(200,{},"User logged out successfully")
    );
}); 

export const httpUpdateUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const requiredFields = ['oldPassword','newPassword'];
    getValidationDone(requiredFields,req.body);

    const user = await findUserById(req.user?._id);
    if(!user) throw new ApiError(404,"User not found");

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordValid) throw new ApiError(401,"Invalid credentials");

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res.status(200).json(new ApiResponse(200,{},"Password updated successfully"));
});


export const httpUpdateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
   
    if(!avatarLocalPath) throw new ApiError(400,"Avatar is required");

    const updatedAvatar = await uploadOnCloudinary(avatarLocalPath);
    if(!updatedAvatar.url) throw new ApiError(500,"Something went wrong whilst uploading avatar");


    const user = await findUserById(req.user?._id);
    if(user?.avatar){
        const hasDeleted = await deleteFromCloudinary(user.avatar.publicId);
        if(!(hasDeleted.result === "ok")) throw new ApiError(500,"Did not delete avatar");
    }

    const userWithNewAvatar = await updateUserAvatarOrCoverImage(req.user?._id,
        { url: updatedAvatar?.url, publicId: updatedAvatar.public_id } );    
    
    return res.status(200).json(new ApiResponse(200,userWithNewAvatar,"Avatar updated successfully"));
});

export const httpUpdateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath) throw new ApiError(400,"Cover image is required");

    const updatedVocerImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!updatedVocerImage.url) throw new ApiError(500,"Something went wrong whilst uploading cover image");

    const user = await findUserById(req.user?._id);
    if(user?.coverImage){
       const hasDeleted = await deleteFromCloudinary(user?.coverImage.publicId);
       console.log(hasDeleted)
       if(!(hasDeleted.result === "ok")) throw new ApiError(500,"Did not delete coverImage")
    }

    const userWithNewCoverImage = await updateUserAvatarOrCoverImage(req.user?._id, { url:updatedVocerImage?.url, publicId: updatedVocerImage.public_id } );

    return res.status(200).json(new ApiResponse(200,userWithNewCoverImage,"Cover image updated successfully"));
});

//todo => dont let the user change email or username to the one already taken!

export const httpUpdateUserAccountDetails = asyncHandler(async (req, res) => {
    const {username,email,fullName} = req.body;
    const fieldsToUpdate = {username,email,fullName}

    const nonEmptyField = Object.keys(fieldsToUpdate).filter(field => {
        const value = fieldsToUpdate[field];
        return value && typeof value === 'string' && value.trim() !== '';
    });

    if (nonEmptyField.length !== 1) {
        throw new ApiError(400, "Only one field can be updated at a time");
    }

    getValidationDone(nonEmptyField,req.body);
    
    const fieldName = nonEmptyField[0];
    const fieldValue = fieldsToUpdate[fieldName];

    const user = await updateUserAccountDetails(req.user?._id,{ [fieldName]: fieldValue });

    return res.status(200).json(new ApiResponse(200,user,"Account details updated successfully"));
});
