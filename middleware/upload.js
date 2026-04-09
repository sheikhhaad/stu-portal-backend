// utils/cloudinaryUpload.js
import streamifier from "streamifier";
import cloudinary from "../config/multer.js";

export const uploadBufferToCloudinary = (buffer, folder, public_id) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, public_id },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};