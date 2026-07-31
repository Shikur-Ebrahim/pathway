export const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
export const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "pathway_preset";

export const isCloudinaryConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== "demo" &&
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET &&
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET !== "pathway_preset"
);

export async function uploadToCloudinary(file: File): Promise<{ url: string; publicId: string }> {
  if (isCloudinaryConfigured) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || "Cloudinary image upload failed");
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } else {
    // Local / Demo simulation: convert image file to local Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          url: reader.result as string,
          publicId: "demo_public_id_" + Date.now(),
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
