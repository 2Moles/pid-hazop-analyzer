import express from 'express';
import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
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

// Analysis schema
const analysisSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  components: [{
    type: { type: String, required: true },
    confidence: { type: Number, required: true },
    bbox: {
      x: Number,
      y: Number,
      width: Number,
      height: Number
    }
  }],
  safetyIssues: [{
    type: { type: String, required: true },
    severity: { type: String, required: true },
    description: String,
    components: [String]
  }],
  createdAt: { type: Date, default: Date.now }
});

const Analysis = mongoose.model('Analysis', analysisSchema);

// Analyze P&ID image
router.post('/analyze/:fileId', async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    
    // TODO: Implement actual YOLOv5/Detectron2 model integration
    // For now, we'll use mock data
    const mockAnalysis = {
      fileId,
      components: [
        {
          type: 'valve',
          confidence: 0.95,
          bbox: { x: 100, y: 100, width: 50, height: 50 }
        },
        {
          type: 'pump',
          confidence: 0.92,
          bbox: { x: 200, y: 200, width: 60, height: 60 }
        }
      ],
      safetyIssues: [
        {
          type: 'missing_relief_valve',
          severity: 'high',
          description: 'No relief valve detected in high-pressure section',
          components: ['pump-1']
        }
      ]
    };

    const analysis = new Analysis(mockAnalysis);
    await analysis.save();

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Error analyzing P&ID' });
  }
});

// Generate HAZOP report
router.get('/report/:analysisId', async (req, res) => {
  try {
    const analysisId = new mongoose.Types.ObjectId(req.params.analysisId);
    const analysis = await Analysis.findById(analysisId);
    
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    // Create PDF document
    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      
      // Store PDF in GridFS
      const writeStream = gfs.openUploadStream(`hazop-report-${analysisId}.pdf`, {
        contentType: 'application/pdf'
      });

      writeStream.write(pdfBuffer);
      writeStream.end();

      writeStream.on('finish', () => {
        res.status(200).json({
          message: 'HAZOP report generated successfully',
          reportId: writeStream.id
        });
      });
    });

    // Add content to PDF
    doc.fontSize(20).text('HAZOP Analysis Report', { align: 'center' });
    doc.moveDown();
    
    // Add analysis results
    doc.fontSize(16).text('Detected Components:');
    analysis.components.forEach(component => {
      doc.fontSize(12)
        .text(`- ${component.type} (${(component.confidence * 100).toFixed(2)}% confidence)`);
    });

    doc.moveDown();
    doc.fontSize(16).text('Safety Issues:');
    analysis.safetyIssues.forEach(issue => {
      doc.fontSize(12)
        .text(`- ${issue.type} (${issue.severity} severity)`)
        .text(`  Description: ${issue.description}`);
    });

    doc.end();
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Error generating HAZOP report' });
  }
});

export default router; 