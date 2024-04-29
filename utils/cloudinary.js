const cloudinary = require("cloudinary").v2;
const { unlinkSync } = require("fs");

cloudinary.config({ 
    cloud_name: , 
    api_key: , 
    api_secret: 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image"
        });

        // File has been uploaded successfully
        console.log("file is uploaded on Cloudinary ", response.url);

        // Remove the locally saved temporary file after successful upload
        unlinkSync(localFilePath);

        return response;

    } catch (error) {
        // Remove the locally saved temporary file as the upload operation failed
        unlinkSync(localFilePath); 

        // Return null in case of error
        return null;
    }
};

module.exports = uploadOnCloudinary;
