import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'
import reportRoutes from './routes/reports.js'
import medicationRoutes from './routes/medications.js'
import diagnoseRoutes from './routes/diagnose.js'
import { authenticateSocket } from './middleware/auth.js'
import { AIService } from './services/aiService.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// AI Service instance
const aiService = new AIService()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/medications', medicationRoutes)
app.use('/api/diagnose', diagnoseRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Socket.io for real-time chat
io.use(authenticateSocket)

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.userId}`)

  // Join user's personal room
  socket.join(socket.userId)

  // Handle new chat messages
  socket.on('chat:message', async (data) => {
    try {
      const { message, sessionId, symptoms, medicalHistory } = data

      // Emit user message
      socket.emit('chat:message', {
        id: Date.now(),
        sender: 'user',
        content: message,
        timestamp: new Date()
      })

      // Analyze message for emergency keywords
      const emergencyKeywords = ['chest pain', 'difficulty breathing', 'stroke', 'heart attack', 'severe bleeding']
      const isEmergency = emergencyKeywords.some(keyword => message.toLowerCase().includes(keyword))

      if (isEmergency) {
        socket.emit('chat:message', {
          id: Date.now() + 1,
          sender: 'ai',
          content: '⚠️ Based on your symptoms, I strongly recommend seeking immediate medical attention. Please call emergency services (911) or go to your nearest emergency room.',
          timestamp: new Date(),
          isEmergency: true
        })
        return
      }

      // Get AI response
      const response = await aiService.analyzeSymptoms({
        message,
        symptoms,
        medicalHistory,
        sessionHistory: [] // Would include actual history in production
      })

      // Emit AI response with typing indicator
      socket.emit('chat:typing', { isTyping: true })
      
      setTimeout(() => {
        socket.emit('chat:typing', { isTyping: false })
        socket.emit('chat:message', {
          id: Date.now() + 2,
          sender: 'ai',
          content: response.message,
          diagnosis: response.diagnosis,
          recommendations: response.recommendations,
          timestamp: new Date()
        })
      }, 1500)

    } catch (error) {
      console.error('Chat error:', error)
      socket.emit('chat:error', { message: 'An error occurred processing your message' })
    }
  })

  // Handle session management
  socket.on('session:start', (data) => {
    socket.emit('session:created', {
      sessionId: `session_${Date.now()}`,
      startedAt: new Date()
    })
  })

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.userId}`)
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`🏥 Healthcare Platform Server running on port ${PORT}`)
})

export { io }
