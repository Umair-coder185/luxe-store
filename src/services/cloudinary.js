import { v2 as cloudinary } from 'cloudinary';
import env from '@/config/env';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

const CLOUDINARY_FOLDER = 'luxe/products';

export function generateSignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const paramsToSign = {
    folder: CLOUDINARY_FOLDER,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    env.cloudinary.apiSecret
  );

  return {
    signature,
    timestamp,
    folder: CLOUDINARY_FOLDER,
    cloudName: env.cloudinary.cloudName,
    apiKey: env.cloudinary.apiKey,
  };
}

export async function deleteImage(publicId) {
  if (!publicId || !publicId.startsWith(CLOUDINARY_FOLDER + '/')) {
    throw new Error('Invalid publicId: outside allowed namespace');
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`[Cloudinary] Failed to delete ${publicId}:`, error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

export async function deleteMultipleImages(publicIds) {
  if (!publicIds || publicIds.length === 0) return { success: true };

  const validIds = publicIds.filter(id => id.startsWith(CLOUDINARY_FOLDER + '/'));
  if (validIds.length === 0) return { success: true };

  try {
    const result = await cloudinary.api.delete_resources(validIds);
    return result;
  } catch (error) {
    console.error('[Cloudinary] Failed to delete multiple images:', error);
    throw new Error('Failed to delete images from Cloudinary');
  }
}
