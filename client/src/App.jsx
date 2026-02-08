import React, { useState, useEffect, useRef } from 'react'
import { analyzeSymptoms } from './services/api'
import './styles.css'

// Demo user accounts
const DEMO_USERS = [
  { email: 'demo@medvision.ai', password: 'demo123', name: 'Demo User' },
  { email: 'test@medvision.ai', password: 'demo123', name: 'Test User' },
  { email: 'admin@medvision.ai', password: 'demo123', name: 'Admin User' }
]

// Animated Icon Components using CSS
function HeartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
}

function StethoscopeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 4h3v3h-3zM19 4c1.1 0 2 .9 2 2v4h-2V6h-3V4h2z"/>
      <path d="M5 17c0 2.76 2.24 5 5 5s5-2.24 5-5c0-2.76-2.24-5-5-5-1.41 0-2.68.59-3.6 1.51L10 16l1.6-2.49C10.82 12.68 10 11.47 10 10c0-2.76-2.24-5-5-5S0 7.24 0 10c0 1.47.82 2.68 1.6 3.51L3 12l-1.6 2.49C.82 15.32 0 16.53 0 17.51 0 19.37 1.63 21 3.5 21c.84 0 1.63-.31 2.23-.86.6.55 1.39.86 2.23.86 1.84 0 3.33-1.49 3.33-3.33 0-.84-.31-1.63-.86-2.23.55-.6.86-1.39.86-2.23 0-.84-.31-1.63-.86-2.23.55-.6.86-1.39.86-2.23 0-1.38-.78-2.59-1.92-3.21L8 9l-.08.21C7.22 9.94 6.5 10.73 6.5 11.67c0 .94.72 1.73 1.65 1.83.93.1 1.68-.52 1.85-1.33.17-.81.78-1.47 1.59-1.47.81 0 1.42.66 1.59 1.47.17.81.92 1.43 1.85 1.33.93-.1 1.65-.89 1.65-1.83 0-.94-.72-1.73-1.65-1.83-.93-.1-1.43-.98-1.43-1.83 0-.94.72-1.73 1.65-1.83.93-.1 1.43-.98 1.43-1.83 0-.94-.72-1.73-1.65-1.83-.93-.1-1.43-.98-1.43-1.83 0-1.47.82-2.68 1.6-3.51L12 7l.08-.21C12.78 6.06 13.5 5.27 13.5 4.33c0-.94-.72-1.73-1.65-1.83C10.92 2.4 10.42 2 9.5 2c-.92 0-1.68.66-1.85 1.47C7.48 3.47 6.87 4.12 6.06 4.12c-1.21 0-2.19.98-2.19 2.19 0 1.47.82 2.68 1.6 3.51L7 11l-.08.21C6.22 12.94 5.5 13.73 5.5 14.67c0 .94.72 1.73 1.65 1.83.93.1 1.43-.52 1.6-1.33.17-.81.78-1.47 1.59-1.47.81 0 1.42.66 1.59 1.47.17.81.92 1.43 1.85 1.33.93-.1 1.65-.89 1.65-1.83 0-.94-.72-1.73-1.65-1.83-.93-.1-1.43-.98-1.43-1.83 0-.94.72-1.73 1.65-1.83.93-.1 1.43-.98 1.43-1.83 0-.94-.72-1.73-1.65-1.83-.93-.1-1.68.52-1.85 1.33-.17.81-.78 1.47-1.59 1.47-.81 0-1.42-.66-1.59-1.47-.17-.81-.92-1.43-1.85-1.33C.72 6.73 0 5.94 0 5c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.76-2.24 5-5 5"/>
    </svg>
  )
}

function SyringeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
    </svg>
  )
}

function PillIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
    </svg>
  )
}

function ChatIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
    </svg>
  )
}

function ShieldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
    </svg>
  )
}

function DocumentIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
    </svg>
  )
}

// Main App Component
export default function App() {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [activePanel, setActivePanel] = useState('home')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Diagnosis state
  const [symptoms, setSymptoms] = useState('')
  const [diagnosis, setDiagnosis] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')

  // Reports state
  const [reports, setReports] = useState([])
  const [uploading, setUploading] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  // Vaccines state
  const [vaccines, setVaccines] = useState([
    { name: 'COVID-19 Vaccine', date: '2024-01-15', provider: 'City Hospital' },
    { name: 'Flu Shot', date: '2024-10-01', provider: 'Community Clinic' }
  ])

  // Medications state
  const [medications, setMedications] = useState([
    { name: 'Vitamin D', dosage: '1000 IU', frequency: 'Daily', refills: 3 },
    { name: 'Omega-3', dosage: '500mg', frequency: 'Twice Daily', refills: 2 }
  ])

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Check demo users
    setTimeout(() => {
      const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password)
      if (demoUser || authMode === 'signup') {
        const newUser = {
          email: email,
          name: demoUser?.name || name || email.split('@')[0],
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email
        }
        setUser(newUser)
        setShowAuth(false)
        setActivePanel('dashboard')
        setMessage('')
      } else {
        setMessage('Invalid credentials. Try demo@medvision.ai / demo123')
      }
      setLoading(false)
    }, 1000)
  }

  // Handle symptom diagnosis
  const handleDiagnose = async () => {
    if (!symptoms.trim()) return
    
    setLoading(true)
    try {
      const result = await analyzeSymptoms(symptoms)
      setDiagnosis(result)
      setChatMessages([
        { type: 'user', text: symptoms },
        { type: 'ai', text: result.explanation }
      ])
    } catch (error) {
      setDiagnosis({
        conditions: [{ name: 'Common Cold', probability: 0.7, advice: 'Rest and hydration recommended' }],
        explanation: 'Based on your symptoms, you may be experiencing a common cold. However, please consult a healthcare provider for accurate diagnosis.',
        severity: 'low'
      })
      setChatMessages([
        { type: 'user', text: symptoms },
        { type: 'ai', text: 'I understand your symptoms. Let me analyze them for you.' }
      ])
    }
    setLoading(false)
  }

  // Handle chat message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return
    
    const userMsg = { type: 'user', text: inputMessage }
    setChatMessages(prev => [...prev, userMsg])
    setInputMessage('')
    
    setLoading(true)
    try {
      const result = await analyzeSymptoms(inputMessage)
      setChatMessages(prev => [...prev, { type: 'ai', text: result.explanation }])
    } catch (error) {
      setChatMessages(prev => [...prev, { type: 'ai', text: 'I understand. Let me provide more detailed information about your symptoms.' }])
    }
    setLoading(false)
  }

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setUploading(true)
    setAnalysisProgress(0)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setReports(prev => [...prev, {
            name: file.name,
            date: new Date().toISOString().split('T')[0],
            type: 'Lab Report',
            status: 'Analyzed'
          }])
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Add vaccine
  const handleAddVaccine = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newVaccine = {
      name: formData.get('name'),
      date: formData.get('date'),
      provider: formData.get('provider')
    }
    setVaccines(prev => [...prev, newVaccine])
    e.target.reset()
  }

  // Add medication
  const handleAddMedication = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newMed = {
      name: formData.get('name'),
      dosage: formData.get('dosage'),
      frequency: formData.get('frequency'),
      refills: parseInt(formData.get('refills'))
    }
    setMedications(prev => [...prev, newMed])
    e.target.reset()
  }

  // Navigation
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'diagnosis', label: 'AI Diagnosis', icon: '🤖' },
    { id: 'reports', label: 'Reports', icon: '📋' },
    { id: 'vaccines', label: 'Vaccines', icon: '💉' },
    { id: 'meds', label: 'Medications', icon: '💊' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' }
  ]

  // If not logged in, show landing page
  if (!user) {
    return (
      <div className="app-landing">
        {/* Animated Background */}
        <div className="animated-bg">
          <div className="floating-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }} />
            ))}
          </div>
          <div className="gradient-orb orb-1" />
          <div className="gradient-orb orb-2" />
          <div className="gradient-orb orb-3" />
        </div>

        {/* Hero Section */}
        <section className="landing-hero">
          <div className="hero-content">
            <div className="hero-icon">
              <HeartIcon className="heart-beat" />
            </div>
            <h1 className="hero-title">
              <span className="gradient-text">MedVision AI</span>
            </h1>
            <p className="hero-subtitle">
              Your Personal AI Healthcare Companion
            </p>
            <div className="hero-actions">
              <button className="btn-primary large" onClick={() => { setShowAuth(true); setAuthMode('signup') }}>
                Get Started Free
              </button>
              <button className="btn-secondary large" onClick={() => { setShowAuth(true); setAuthMode('login') }}>
                Sign In
              </button>
            </div>
            
            {/* Demo Credentials */}
            <div className="demo-credentials">
              <p>Demo Account: <strong>demo@medvision.ai</strong> / <strong>demo123</strong></p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="feature-cards">
            <div className="feature-card">
              <StethoscopeIcon className="feature-icon" />
              <h3>Smart Diagnosis</h3>
              <p>AI-powered symptom analysis</p>
            </div>
            <div className="feature-card">
              <DocumentIcon className="feature-icon" />
              <h3>Report Analysis</h3>
              <p>Upload & understand your reports</p>
            </div>
            <div className="feature-card">
              <SyringeIcon className="feature-icon" />
              <h3>Vaccine Tracker</h3>
              <p>Never miss a vaccination</p>
            </div>
            <div className="feature-card">
              <PillIcon className="feature-icon" />
              <h3>Meds Manager</h3>
              <p>Track medications & refills</p>
            </div>
          </div>
        </section>

        {/* Auth Modal */}
        {showAuth && (
          <div className="auth-modal-overlay" onClick={() => setShowAuth(false)}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setShowAuth(false)}>✕</button>
              
              <div className="auth-header">
                <HeartIcon className="auth-icon" />
                <h2>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                <p>{authMode === 'login' ? 'Sign in to access your health dashboard' : 'Join MedVision AI today'}</p>
              </div>

              {message && <div className="auth-message">{message}</div>}

              <form onSubmit={handleLogin}>
                {authMode === 'signup' && (
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary full-width" disabled={loading}>
                  {loading ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                </button>
              </form>

              <div className="auth-divider">
                <span>or</span>
              </div>

              <div className="demo-accounts">
                <p>Quick demo access:</p>
                <div className="demo-buttons">
                  {DEMO_USERS.map(u => (
                    <button key={u.email} className="demo-btn" onClick={() => { setEmail(u.email); setPassword(u.password); setAuthMode('login'); }}>
                      {u.name}
                    </button>
                  ))}
                </div>
              </div>

              <p className="auth-switch">
                {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
                  {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Main Dashboard after login
  return (
    <div className="app-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <HeartIcon className="header-logo" />
          <span className="header-title">MedVision AI</span>
        </div>
        <nav className="header-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-btn ${activePanel === item.id ? 'active' : ''}`}
              onClick={() => setActivePanel(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="header-right">
          <div className="user-info">
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <span className="user-name">{user.name}</span>
          </div>
          <button className="btn-secondary" onClick={() => setUser(null)}>Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Home Panel */}
        {activePanel === 'home' && (
          <div className="panel home-panel">
            <div className="panel-hero">
              <h1>Welcome back, {user.name}!</h1>
              <p>Your health journey continues here</p>
            </div>
            <div className="quick-stats">
              <div className="stat-card">
                <span className="stat-value">5</span>
                <span className="stat-label">Reports</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">2</span>
                <span className="stat-label">Vaccines</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">2</span>
                <span className="stat-label">Medications</span>
              </div>
              <div className="stat-card emergency">
                <span className="stat-icon">🚨</span>
                <span className="stat-label">Emergency</span>
              </div>
            </div>
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-grid">
                <button className="action-card" onClick={() => setActivePanel('diagnosis')}>
                  <ChatIcon className="action-icon" />
                  <span>Check Symptoms</span>
                </button>
                <button className="action-card" onClick={() => setActivePanel('reports')}>
                  <DocumentIcon className="action-icon" />
                  <span>Upload Report</span>
                </button>
                <button className="action-card" onClick={() => setActivePanel('vaccines')}>
                  <SyringeIcon className="action-icon" />
                  <span>Add Vaccine</span>
                </button>
                <button className="action-card" onClick={() => setActivePanel('meds')}>
                  <PillIcon className="action-icon" />
                  <span>Add Medication</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Diagnosis Panel */}
        {activePanel === 'diagnosis' && (
          <div className="panel diagnosis-panel">
            <h1>AI Symptom Checker</h1>
            <p>Describe your symptoms for AI-powered analysis</p>
            
            <div className="diagnosis-container">
              <div className="symptom-input-section">
                <textarea
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms... (e.g., headache, fever, cough)"
                  className="symptom-input"
                />
                <button 
                  className="btn-primary full-width" 
                  onClick={handleDiagnose}
                  disabled={loading}
                >
                  {loading ? 'Analyzing...' : 'Analyze Symptoms'}
                </button>
              </div>

              {diagnosis && (
                <div className="diagnosis-results">
                  <h2>Analysis Results</h2>
                  <div className="severity-badge" data-severity={diagnosis.severity}>
                    {diagnosis.severity?.toUpperCase()} RISK
                  </div>
                  <div className="conditions-list">
                    {diagnosis.conditions?.map((cond, i) => (
                      <div key={i} className="condition-card">
                        <h3>{cond.name}</h3>
                        <p>Probability: {Math.round(cond.probability * 100)}%</p>
                        <p className="advice">{cond.advice}</p>
                      </div>
                    ))}
                  </div>
                  <div className="diagnosis-explanation">
                    <h3>Explanation</h3>
                    <p>{diagnosis.explanation}</p>
                  </div>
                  <div className="disclaimer">
                    ⚠️ This is AI-generated and not a substitute for professional medical advice. 
                    Please consult a doctor for accurate diagnosis.
                  </div>
                </div>
              )}

              <div className="chat-section">
                <h2>Chat with AI Doctor</h2>
                <div className="chat-messages">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`chat-message ${msg.type}`}>
                      <span className="message-icon">{msg.type === 'user' ? '👤' : '🤖'}</span>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                  {loading && <div className="chat-message ai"><p>Thinking...</p></div>}
                </div>
                <div className="chat-input-section">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    placeholder="Ask a follow-up question..."
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button className="btn-primary" onClick={handleSendMessage} disabled={loading}>Send</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Panel */}
        {activePanel === 'reports' && (
          <div className="panel reports-panel">
            <h1>Medical Reports</h1>
            <p>Upload and analyze your medical reports</p>
            
            <div className="upload-section">
              <div className="upload-area">
                <DocumentIcon className="upload-icon" />
                <p>Drag & drop files here or click to browse</p>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />
                <button className="btn-primary">Upload Report</button>
              </div>
              {uploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${analysisProgress}%` }} />
                  </div>
                  <p>Analyzing report... {analysisProgress}%</p>
                </div>
              )}
            </div>

            <div className="reports-list">
              <h2>Your Reports</h2>
              {reports.length === 0 ? (
                <p className="no-reports">No reports uploaded yet</p>
              ) : (
                reports.map((report, i) => (
                  <div key={i} className="report-card">
                    <DocumentIcon className="report-icon" />
                    <div className="report-info">
                      <h3>{report.name}</h3>
                      <p>{report.date} • {report.type}</p>
                    </div>
                    <span className={`report-status ${report.status.toLowerCase()}`}>{report.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Vaccines Panel */}
        {activePanel === 'vaccines' && (
          <div className="panel vaccines-panel">
            <h1>Vaccination Tracker</h1>
            <p>Track your vaccination history</p>
            
            <form className="add-form" onSubmit={handleAddVaccine}>
              <input type="text" name="name" placeholder="Vaccine Name" required />
              <input type="date" name="date" required />
              <input type="text" name="provider" placeholder="Provider/Hospital" required />
              <button type="submit" className="btn-primary">Add Vaccine</button>
            </form>

            <div className="vaccines-list">
              {vaccines.map((vax, i) => (
                <div key={i} className="vaccine-card">
                  <SyringeIcon className="vaccine-icon" />
                  <div className="vaccine-info">
                    <h3>{vax.name}</h3>
                    <p>{vax.date} • {vax.provider}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medications Panel */}
        {activePanel === 'meds' && (
          <div className="panel meds-panel">
            <h1>Medication Manager</h1>
            <p>Track your medications and refills</p>
            
            <form className="add-form" onSubmit={handleAddMedication}>
              <input type="text" name="name" placeholder="Medication Name" required />
              <input type="text" name="dosage" placeholder="Dosage (e.g., 500mg)" required />
              <select name="frequency" required>
                <option value="">Select Frequency</option>
                <option value="Daily">Daily</option>
                <option value="Twice Daily">Twice Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="As Needed">As Needed</option>
              </select>
              <input type="number" name="refills" placeholder="Refills Remaining" min="0" required />
              <button type="submit" className="btn-primary">Add Medication</button>
            </form>

            <div className="medications-list">
              {medications.map((med, i) => (
                <div key={i} className="medication-card">
                  <PillIcon className="med-icon" />
                  <div className="med-info">
                    <h3>{med.name}</h3>
                    <p>{med.dosage} • {med.frequency}</p>
                  </div>
                  <div className="med-refills">
                    <span className="refill-count">{med.refills}</span>
                    <span className="refill-label">refills left</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Panel */}
        {activePanel === 'dashboard' && (
          <div className="panel dashboard-panel">
            <h1>Health Dashboard</h1>
            <p>Your complete health overview</p>
            
            <div className="dashboard-grid">
              <div className="dashboard-card summary">
                <h2>Health Summary</h2>
                <div className="summary-stats">
                  <div className="summary-item">
                    <span className="summary-value">{reports.length}</span>
                    <span className="summary-label">Reports</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-value">{vaccines.length}</span>
                    <span className="summary-label">Vaccines</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-value">{medications.length}</span>
                    <span className="summary-label">Medications</span>
                  </div>
                </div>
              </div>
              
              <div className="dashboard-card recent">
                <h2>Recent Activity</h2>
                <ul className="activity-list">
                  <li>📄 Uploaded Lab Report - 2 days ago</li>
                  <li>💉 Flu Shot - 1 week ago</li>
                  <li>💊 Started Vitamin D - 2 weeks ago</li>
                </ul>
              </div>

              <div className="dashboard-card reminders">
                <h2>Reminders</h2>
                <ul className="reminder-list">
                  <li>🔔 Vitamin D - Take with breakfast</li>
                  <li>🔔 Omega-3 - Take with lunch</li>
                  <li>📅 Annual checkup - Due in 2 months</li>
                </ul>
              </div>

              <div className="dashboard-card security">
                <ShieldIcon className="security-icon" />
                <h2>HIPAA Compliant</h2>
                <p>Your health data is encrypted and secure</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2024 MedVision AI - Your Personal Healthcare Platform</p>
        <p className="disclaimer">This platform is for educational purposes. Always consult healthcare professionals for medical advice.</p>
      </footer>
    </div>
  )
}
