import express from 'express'
import { AIService } from '../services/aiService.js'

const router = express.Router()
const aiService = new AIService()

// Simple diagnosis endpoint (no auth for demo)
router.post('/', async (req, res) => {
  try {
    const { message, sessionHistory } = req.body
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const response = await aiService.analyzeSymptoms({
      message,
      symptoms: [],
      medicalHistory: [],
      sessionHistory: sessionHistory || []
    })

    res.json({
      response: response.message,
      diagnosis: response.diagnosis,
      recommendations: response.recommendations
    })
  } catch (error) {
    console.error('Diagnosis error:', error)
    res.status(500).json({ error: 'Failed to analyze symptoms' })
  }
})

export default router
