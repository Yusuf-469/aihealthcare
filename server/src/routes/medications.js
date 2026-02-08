import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { authenticateJWT } from '../middleware/auth.js'

const router = express.Router()

// In-memory medications store (replace with PostgreSQL in production)
const medications = new Map()

// Common drug interactions database (simplified)
const drugInteractions = {
  'warfarin': {
    interactions: ['aspirin', 'ibuprofen', 'naproxen'],
    severity: 'high',
    message: 'Blood thinners can cause increased bleeding risk when combined with NSAIDs'
  },
  'lisinopril': {
    interactions: ['potassium', 'spironolactone'],
    severity: 'medium',
    message: 'ACE inhibitors may increase potassium levels when combined with potassium supplements'
  },
  'metformin': {
    interactions: ['alcohol'],
    severity: 'medium',
    message: 'Alcohol may increase the risk of lactic acidosis with metformin'
  },
  'atorvastatin': {
    interactions: ['grapefruit', 'erythromycin', 'ketoconazole'],
    severity: 'medium',
    message: 'These substances may increase statin levels in blood'
  }
}

// Get all medications for user
router.get('/', authenticateJWT, (req, res) => {
  const userMedications = []
  
  for (const [medId, medication] of medications) {
    if (medication.userId === req.userId) {
      userMedications.push({
        medId,
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        startDate: medication.startDate,
        endDate: medication.endDate,
        remindersEnabled: medication.remindersEnabled,
        nextReminder: calculateNextReminder(medication)
      })
    }
  }
  
  res.json({ medications: userMedications })
})

// Add new medication
router.post('/', authenticateJWT, (req, res) => {
  const { name, dosage, frequency, startDate, endDate, remindersEnabled } = req.body
  const medId = uuidv4()
  
  const medication = {
    medId,
    userId: req.userId,
    name,
    dosage,
    frequency,
    startDate: startDate || new Date(),
    endDate,
    remindersEnabled: remindersEnabled !== false,
    createdAt: new Date()
  }
  
  medications.set(medId, medication)
  
  res.status(201).json({
    message: 'Medication added successfully',
    medication: {
      medId,
      name,
      dosage,
      frequency,
      startDate,
      endDate,
      remindersEnabled
    }
  })
})

// Update medication
router.put('/:medId', authenticateJWT, (req, res) => {
  const { medId } = req.params
  const updates = req.body
  
  const medication = medications.get(medId)
  if (!medication) {
    return res.status(404).json({ error: 'Medication not found' })
  }
  
  if (medication.userId !== req.userId) {
    return res.status(403).json({ error: 'Access denied' })
  }
  
  const updatedMedication = { ...medication, ...updates, updatedAt: new Date() }
  medications.set(medId, updatedMedication)
  
  res.json({ message: 'Medication updated', medication: updatedMedication })
})

// Delete medication
router.delete('/:medId', authenticateJWT, (req, res) => {
  const { medId } = req.params
  const medication = medications.get(medId)
  
  if (!medication) {
    return res.status(404).json({ error: 'Medication not found' })
  }
  
  if (medication.userId !== req.userId) {
    return res.status(403).json({ error: 'Access denied' })
  }
  
  medications.delete(medId)
  res.json({ message: 'Medication deleted' })
})

// Check drug interactions
router.post('/check-interactions', authenticateJWT, (req, res) => {
  const { medications: medList } = req.body
  
  const interactions = []
  const medicationNames = medList.map(m => m.name.toLowerCase())
  
  for (const medName of medicationNames) {
    const interactionData = drugInteractions[medName]
    if (interactionData) {
      const conflicting = medicationNames.filter(name => 
        interactionData.interactions.some(interaction => name.includes(interaction))
      )
      
      if (conflicting.length > 0) {
        interactions.push({
          medication: medName,
          severity: interactionData.severity,
          message: interactionData.message,
          conflictingWith: conflicting
        })
      }
    }
  }
  
  res.json({ 
    hasInteractions: interactions.length > 0,
    interactions,
    warnings: interactions.filter(i => i.severity === 'high').length > 0
  })
})

// Get vaccination history
router.get('/vaccinations', authenticateJWT, (req, res) => {
  // Simplified vaccination tracking
  res.json({ 
    vaccinations: [
      { id: 1, name: 'COVID-19 Booster', date: '2023-11-20', provider: 'City Health Clinic' },
      { id: 2, name: 'Flu Shot', date: '2023-10-05', provider: 'Primary Care Office' },
      { id: 3, name: 'Tdap', date: '2020-05-15', provider: 'Primary Care Office' }
    ]
  })
})

function calculateNextReminder(medication) {
  // Simplified next reminder calculation
  const now = new Date()
  const hours = 8 // Default to 8 AM
  const next = new Date(now)
  next.setHours(hours, 0, 0, 0)
  
  if (next <= now) {
    next.setDate(next.getDate() + 1)
  }
  
  return next
}

export default router
