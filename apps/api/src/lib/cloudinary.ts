import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(filePath: string) {
  try {
    // If credentials are missing, return a local mock URL or throw
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.warn("Cloudinary credentials missing, using mock URL");
      return `https://via.placeholder.com/800?text=Mock+Upload+${Math.random()}`;
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "kicksmtaani",
    });
    
    // Clean up local file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
}
