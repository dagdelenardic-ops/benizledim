import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are not set");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  configured = true;
}

export async function uploadToCloudinary(localPath: string): Promise<string> {
  ensureConfigured();
  const result = await cloudinary.uploader.upload(localPath, {
    folder: "benizledim",
    format: "jpg",
    quality: "auto:best",
  });
  return result.secure_url;
}

export async function uploadBufferToCloudinary(buffer: Buffer, filename: string): Promise<string> {
  ensureConfigured();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "benizledim",
        public_id: filename.replace(/\.[^.]+$/, ""),
        format: "jpg",
        quality: "auto:best",
      },
      (error, result) => {
        if (error) {
          const msg =
            typeof error === "object" && error && "message" in error
              ? String((error as { message?: unknown }).message)
              : "Cloudinary upload failed";
          reject(new Error(`${msg}`));
          return;
        }
        else if (result) resolve(result.secure_url);
        else reject(new Error("No result from Cloudinary"));
      }
    );
    stream.end(buffer);
  });
}
