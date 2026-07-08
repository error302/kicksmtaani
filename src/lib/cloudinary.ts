/**
 * Cloudinary image upload integration
 *
 * Required env vars:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * If credentials are missing, uploads fall back to returning the original
 * base64/data URL so the admin flow still works in development.
 */

import { v2 as cloudinary } from "cloudinary";

const configured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (configured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadImage(
  file: Buffer,
  options?: { folder?: string; public_id?: string }
): Promise<{ url: string; publicId: string; demoMode: boolean }> {
  if (!configured) {
    // Demo mode — return a placeholder URL
    return {
      url: `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80`,
      publicId: `demo-${Date.now()}`,
      demoMode: true,
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options?.folder || "kicksmtaani/products",
        public_id: options?.public_id,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else
          resolve({
            url: result!.secure_url,
            publicId: result!.public_id,
            demoMode: false,
          });
      }
    );
    uploadStream.end(file);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!configured) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    console.error("Cloudinary delete failed:", e);
  }
}

export const isCloudinaryConfigured = Boolean(configured);
