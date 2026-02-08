import React, { useState, useEffect } from 'react'
import InteractiveLanding from './components/InteractiveLanding'
import InteractiveDashboard from './components/InteractiveDashboard'
import './styles.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const saved = localStorage.getItem('medvision_user')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch (e) {
        localStorage.removeItem('medvision_user')
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('medvision_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('medvision_user')
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading MedVision AI...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <InteractiveDashboard user={user} onLogout={handleLogout} />
  }

  return <InteractiveLanding onLogin={handleLogin} />
}
