import { ApiError } from "../utils/ApiError.js";
import { User } from "./user.mongo.js";


export const checkIfUserExists = async ({ email, username }) => {
    const query = {};

    if (email && username) {
        return await User.findOne({
            $or: [
                { email },
                { username }
            ]
        });
    }

    if (email) {
        query.email = email;
    } else if(username) {
        query.username = username;
    }

    return await User.findOne(query);
}

export const findUserById = async (id) => {
    return await User.findById(id).select("-password -refreshToken -createdAt -updatedAt -__v");
    
}

export const createUser = async ({email,username,password,fullName,avatar,coverImage}) => {
    const user = await User.create({
        username: username.toLowerCase(),
        fullName,
        email,
        password,
        avatar,
        coverImage
    });

    const newlyCreatedUser = await User.findById(user._id).select("-password -refreshToken -updatedAt -__v");

    if(!newlyCreatedUser) throw new ApiError(500,"Something went wrong whilst saving the user");

    return newlyCreatedUser;

}

export const updateUserRefreshToken = async (id) => {
    await User.findByIdAndUpdate(
        id,
        {
            $set: { refreshToken: undefined }
        },
        {
            new: true
        }
        );
}

export const updateUserAvatarOrCoverImage = async (userId,updateData) => {
    const {avatar,coverImage} = updateData;
    const updateFields = {};

    if(avatar){
        updateFields.avatar = updateData;
    }else if(coverImage){
        updateFields.coverImage = updateData;
    }
    return await User.findByIdAndUpdate(
        userId,
        {
            $set: updateFields
        },
        { new: true }
    ).select("-password -refreshToken -createdAt -updatedAt -__v");
    
}

export const updateUserAccountDetails = async (userId,updateData) => {
    const {username,email,fullName} = updateData;
    const updateFields = {};

    if (username !== undefined) {
        updateFields.username = username.toLowerCase();
    } else if (email !== undefined) {
        updateFields.email = email;
    } else if (fullName !== undefined) {
        updateFields.fullName = fullName;
    }
    console.log(updateFields);
    
    return await User.findByIdAndUpdate(
        userId,
        {
            $set:updateFields
        },
        { new: true }
        ).select("-password -refreshToken -createdAt -updatedAt -__v");
}