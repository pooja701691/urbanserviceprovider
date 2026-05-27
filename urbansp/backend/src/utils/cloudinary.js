const cloudinary = require('cloudinary').v2;

// Configure from CLOUDINARY_URL env var (format: cloudinary://api_key:api_secret@cloud_name)
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });
}

const uploadBuffer = async (buffer, folder = 'services') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
};

module.exports = {
  uploader: cloudinary.uploader,
  uploadBuffer,
};
