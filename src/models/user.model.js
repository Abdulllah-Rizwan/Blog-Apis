import { ApiError } from "../utils/ApiError.js";
import { User } from "./user.mongo.js";


export const checkIfUserExists = async ({email,username}) => {
    return await User.findOne({
        $or: [ { email } ,{ username } ]
    });
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