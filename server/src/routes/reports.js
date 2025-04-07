import express from 'express';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

const router = express.Router();

// Initialize GridFS
const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
});

// Report schema
const reportSchema = new mongoose.Schema({
  analysisId: { type: mongoose.Schema.Types.ObjectId, required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  filename: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);

// Get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate('analysisId');
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Error fetching reports' });
  }
});

// Get specific report
router.get('/:reportId', async (req, res) => {
  try {
    const reportId = new mongoose.Types.ObjectId(req.params.reportId);
    const report = await Report.findById(reportId).populate('analysisId');
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Error fetching report' });
  }
});

// Download report PDF
router.get('/:reportId/download', async (req, res) => {
  try {
    const reportId = new mongoose.Types.ObjectId(req.params.reportId);
    const report = await Report.findById(reportId);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const readStream = gfs.openDownloadStream(report.fileId);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
    
    readStream.pipe(res);
    
    readStream.on('error', (error) => {
      console.error('Error downloading report:', error);
      res.status(500).json({ error: 'Error downloading report' });
    });
  } catch (error) {
    console.error('Error processing download request:', error);
    res.status(500).json({ error: 'Error processing download request' });
  }
});

// Delete report
router.delete('/:reportId', async (req, res) => {
  try {
    const reportId = new mongoose.Types.ObjectId(req.params.reportId);
    const report = await Report.findById(reportId);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Delete from GridFS
    await gfs.delete(report.fileId);
    
    // Delete from database
    await Report.findByIdAndDelete(reportId);
    
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Error deleting report' });
  }
});

export default router; 