import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'healthcare-platform-secret-key'

// In-memory user store (replace with PostgreSQL in production)
const users = new Map()

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, age, sex, medicalHistory } = req.body
    
    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = uuidv4()
    
    const user = {
      id: userId,
      email,
      passwordHash: hashedPassword,
      name,
      profile: {
        age,
        sex,
        medicalHistory: medicalHistory || [],
        allergies: [],
        currentMedications: []
      },
      createdAt: new Date()
    }
    
    users.set(email, user)
    
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        email,
        name,
        profile: user.profile
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    const user = users.get(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
})

// Get user profile
router.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    // Find user by ID (in production, query PostgreSQL)
    for (const [, user] of users) {
      if (user.id === decoded.userId) {
        return res.json({ user: { id: user.id, email: user.email, name: user.name, profile: user.profile } })
      }
    }
    res.status(404).json({ error: 'User not found' })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

// Update user profile
router.put('/profile', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const updates = req.body
    
    for (const [email, user] of users) {
      if (user.id === decoded.userId) {
        user.profile = { ...user.profile, ...updates }
        return res.json({ message: 'Profile updated', profile: user.profile })
      }
    }
    res.status(404).json({ error: 'User not found' })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

export default router
