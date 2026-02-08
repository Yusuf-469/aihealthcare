import express from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { authenticateJWT } from '../middleware/auth.js'
import { AIService } from '../services/aiService.js'

const router = express.Router()
const aiService = new AIService()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/dicom']
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.dcm')) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
})

// In-memory reports store (replace with MongoDB in production)
const reports = new Map()

// Get all reports for user
router.get('/', authenticateJWT, (req, res) => {
  const userReports = []
  
  for (const [reportId, report] of reports) {
    if (report.userId === req.userId) {
      userReports.push({
        reportId,
        reportType: report.reportType,
        uploadDate: report.uploadDate,
        aiAnalysis: report.aiAnalysis
      })
    }
  }
  
  res.json({ reports: userReports })
})

// Get single report
router.get('/:reportId', authenticateJWT, (req, res) => {
  const { reportId } = req.params
  const report = reports.get(reportId)
  
  if (!report) {
    return res.status(404).json({ error: 'Report not found' })
  }
  
  if (report.userId !== req.userId) {
    return res.status(403).json({ error: 'Access denied' })
  }
  
  res.json({ report })
})

// Upload and analyze report
router.post('/upload', authenticateJWT, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    
    const { reportType } = req.body
    const reportId = uuidv4()
    
    // Analyze the report using AI service
    const analysis = await aiService.analyzeReport(req.file.path, reportType)
    
    const report = {
      reportId,
      userId: req.userId,
      filePath: req.file.path,
      fileName: req.file.originalname,
      reportType: reportType || 'general',
      uploadDate: new Date(),
      aiAnalysis: analysis,
      flaggedValues: analysis.flaggedValues || [],
      rawText: analysis.rawText || ''
    }
    
    reports.set(reportId, report)
    
    res.status(201).json({
      message: 'Report uploaded and analyzed successfully',
      report: {
        reportId,
        reportType: report.reportType,
        uploadDate: report.uploadDate,
        aiAnalysis: report.aiAnalysis
      }
    })
  } catch (error) {
    console.error('Report analysis error:', error)
    res.status(500).json({ error: 'Failed to analyze report' })
  }
})

// Delete report
router.delete('/:reportId', authenticateJWT, (req, res) => {
  const { reportId } = req.params
  const report = reports.get(reportId)
  
  if (!report) {
    return res.status(404).json({ error: 'Report not found' })
  }
  
  if (report.userId !== req.userId) {
    return res.status(403).json({ error: 'Access denied' })
  }
  
  reports.delete(reportId)
  res.json({ message: 'Report deleted' })
})

export default router
