const cloudinary = require("cloudinary").v2;
const { unlinkSync } = require("fs");

cloudinary.config({ 
    cloud_name: 'dhbd74kyg', 
    api_key: '262952965323451', 
    api_secret: 'LI4FEC-4m-3Zaf10Yg2TO26wb_w' 
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
