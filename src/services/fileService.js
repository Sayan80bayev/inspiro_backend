const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'minio',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const bucketName = process.env.MINIO_BUCKET_NAME || 'pins';

// Ensure bucket exists
const ensureBucket = async () => {
  const bucketExists = await minioClient.bucketExists(bucketName);
  if (!bucketExists) {
    await minioClient.makeBucket(bucketName);
  }
};

// Initialize bucket
ensureBucket().catch(console.error);

const uploadFile = async (file) => {
  const fileName = `${Date.now()}-${file.originalname}`;
  await minioClient.putObject(bucketName, fileName, file.buffer);
  return `http://localhost:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;
};

const deleteFile = async (fileName) => {
  await minioClient.removeObject(bucketName, fileName);
};

module.exports = { uploadFile, deleteFile };
