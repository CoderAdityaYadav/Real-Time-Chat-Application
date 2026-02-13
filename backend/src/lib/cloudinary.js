import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export async function uploadToCloudinary(file, folder = "Chatify") {
    if (!file) throw new Error("No file uploaded");
    const result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: "auto", // supports both images and pdfs
    });
    console.log("Image or PDF uploaded successufully");
    return result.secure_url;
}