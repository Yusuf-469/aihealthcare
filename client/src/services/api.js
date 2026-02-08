const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Chat with AI
export async function analyzeSymptoms(message, sessionHistory = []) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diagnose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        sessionHistory
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to get AI response')
    }
    
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Analyze medical report
export async function analyzeReport(file, reportType) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('reportType', reportType)
    
    const response = await fetch(`${API_BASE_URL}/api/reports/analyze`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Failed to analyze report')
    }
    
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Drug interaction check
export async function checkDrugInteractions(medications) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/medications/check-interactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ medications })
    })
    
    if (!response.ok) {
      throw new Error('Failed to check interactions')
    }
    
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
