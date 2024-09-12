import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,  
});

console.log("API Key:", process.env.API_KEY);


export const cloudinaryUploadImg = (fileToUpload) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUpload, 
        { resource_type: "auto" }, 
        (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve({
        url: result.secure_url, // Return only the secure URL of the uploaded image
      });
    });
  });
};

export const cloudinaryDeleteImg = (publicIdToDelete) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicIdToDelete, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result); 
    });
  });
};