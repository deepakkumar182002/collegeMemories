import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';

export const uploadMediaToCloudinary = async (fileBuffer, options = {}) => {
  const { folder = 'college-memories/memories', resourceType = 'auto' } = options;

  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          transformation: resourceType === 'image' ? [{ quality: 'auto', fetch_format: 'auto' }] : undefined,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type,
            thumbnail: result.resource_type === 'video' ? result.secure_url.replace(/\.[^/.]+$/, '.jpg') : result.secure_url,
          });
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  // Fallback: Local storage upload
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${options.extension || 'jpg'}`;
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, fileBuffer);

  const localUrl = `/uploads/${filename}`;
  return {
    url: localUrl,
    publicId: `local_${filename}`,
    resourceType: resourceType === 'auto' ? 'image' : resourceType,
    thumbnail: localUrl,
  };
};

export const deleteMediaFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;

  if (publicId.startsWith('local_')) {
    const filename = publicId.replace('local_', '');
    const filePath = path.join(process.cwd(), 'uploads', filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn('Failed to delete local file:', err.message);
      }
    }
    return;
  }

  if (isCloudinaryConfigured) {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
      console.warn(`Cloudinary delete warning for ${publicId}:`, error.message);
    }
  }
};
