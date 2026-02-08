import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { authenticateJWT } from '../middleware/auth.js'

const router = express.Router()

// In-memory chat sessions (replace with PostgreSQL in production)
const chatSessions = new Map()
const messages = new Map()

// Get chat history for user
router.get('/history', authenticateJWT, (req, res) => {
  const userSessions = []
  
  for (const [sessionId, session] of chatSessions) {
    if (session.userId === req.userId) {
      userSessions.push({
        sessionId,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        messageCount: messages.get(sessionId)?.length || 0
      })
    }
  }
  
  res.json({ sessions: userSessions })
})

// Get messages for a session
router.get('/session/:sessionId', authenticateJWT, (req, res) => {
  const { sessionId } = req.params
  const sessionMessages = messages.get(sessionId) || []
  
  res.json({ messages: sessionMessages })
})

// Create new chat session
router.post('/session', authenticateJWT, (req, res) => {
  const sessionId = uuidv4()
  
  chatSessions.set(sessionId, {
    sessionId,
    userId: req.userId,
    startedAt: new Date(),
    endedAt: null,
    summary: null,
    severityLevel: 'normal'
  })
  
  messages.set(sessionId, [])
  
  res.status(201).json({ sessionId, startedAt: new Date() })
})

// Save a message
router.post('/message', authenticateJWT, (req, res) => {
  const { sessionId, content, sender } = req.body
  
  if (!chatSessions.has(sessionId)) {
    return res.status(404).json({ error: 'Session not found' })
  }
  
  const message = {
    id: uuidv4(),
    sessionId,
    sender,
    content,
    timestamp: new Date(),
    sentiment: analyzeSentiment(content)
  }
  
  const sessionMessages = messages.get(sessionId) || []
  sessionMessages.push(message)
  messages.set(sessionId, sessionMessages)
  
  res.status(201).json({ message })
})

// End chat session
router.put('/session/:sessionId/end', authenticateJWT, (req, res) => {
  const { sessionId } = req.params
  
  if (chatSessions.has(sessionId)) {
    const session = chatSessions.get(sessionId)
    session.endedAt = new Date()
    session.summary = generateSummary(messages.get(sessionId) || [])
    chatSessions.set(sessionId, session)
  }
  
  res.json({ message: 'Session ended' })
})

function analyzeSentiment(content) {
  const emergencyKeywords = ['chest pain', 'difficulty breathing', 'stroke', 'heart attack']
  const concerningKeywords = ['severe', 'worse', 'unbearable', 'intense']
  
  const lowerContent = content.toLowerCase()
  
  if (emergencyKeywords.some(kw => lowerContent.includes(kw))) {
    return 'emergency'
  }
  if (concerningKeywords.some(kw => lowerContent.includes(kw))) {
    return 'concern'
  }
  return 'neutral'
}

function generateSummary(messageList) {
  const userMessages = messageList.filter(m => m.sender === 'user')
  if (userMessages.length === 0) return 'No messages'
  
  const summary = userMessages[0].content.substring(0, 100)
  return summary + (userMessages[0].content.length > 100 ? '...' : '')
}

export default router
