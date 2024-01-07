import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath,{ resource_type: "auto" });

        // console.log('File has been successfully uploaded..');
        // console.log({"response": response});

        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        fs.unlink(localFilePath);
        return null;
    }
}

export const deleteFromCloudinary = async (publicId) => {
    try {
        return await cloudinary.uploader.destroy(publicId,{resource_type:'image'});
    } catch (error) {
        throw new Error(error?.message || "Something went wrong while deleting from cloudinary");
    }
}



cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY 
});