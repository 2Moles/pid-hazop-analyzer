import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import sharp from 'sharp';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize GridFS
const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
});

// Upload P&ID image
router.post('/', upload.single('pidImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Process image with sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(2000, 2000, { fit: 'inside' })
      .toBuffer();

    // Create write stream to GridFS
    const writeStream = gfs.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype
    });

    // Write the processed image to GridFS
    writeStream.write(processedImage);
    writeStream.end();

    writeStream.on('finish', () => {
      res.status(201).json({
        message: 'File uploaded successfully',
        fileId: writeStream.id,
        filename: req.file.originalname
      });
    });

    writeStream.on('error', (error) => {
      res.status(500).json({ error: 'Error uploading file' });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

// Get uploaded image
router.get('/:fileId', (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const readStream = gfs.openDownloadStream(fileId);

    readStream.on('error', (error) => {
      res.status(404).json({ error: 'File not found' });
    });

    readStream.pipe(res);
  } catch (error) {
    res.status(400).json({ error: 'Invalid file ID' });
  }
});

export default router; 