import { useState, useEffect, useRef, Suspense } from 'react'
import Dashboard from './Dashboard'
import Scene3D from './Scene3D'
import LoadingScreen from './LoadingScreen'
import '../styles.css'

// Demo user accounts
const DEMO_USERS = [
  { email: 'demo@medvision.ai', password: 'demo123', name: 'Demo User' },
  { email: 'test@medvision.ai', password: 'demo123', name: 'Test User' },
  { email: 'admin@medvision.ai', password: 'demo123', name: 'Admin User' }
]

// Animated Icons
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
      <path d="M5 17c0 2.76 2.24 5 5 5s5-2.24 5-5c0-2.76-2.24-5-5-5-1.41 0-2.68.59-3.6 1.51L10 16l1.6-2.49C10.82 12.68 10 11.47 10 10c0-2.76-2.24-5-5-5S0 7.24 0 10c0 1.47.82 2.68 1.6 3.51L3 12l-.08.21C7.22 9.94 6.5 10.73 6.5 11.67c0 .94.72 1.73 1.65 1.83.93.1 1.68-.52 1.85-1.33.17-.81.78-1.47 1.59-1.47.81 0 1.42.66 1.59 1.47.17.81.92 1.43 1.85 1.33.93-.1 1.65-.89 1.65-1.83 0-.94-.72-1.73-1.65-1.83-.93-.1-1.43-.98-1.43-1.83 0-.94.72-1.73 1.65-1.83.93-.1 1.43-.98 1.43-1.83 0-.94-.72-1.73-1.65-1.83-.93-.1-1.68.52-1.85 1.33-.17.81-.78 1.47-1.59 1.47-.81 0-1.42-.66-1.59-1.47-.17-.81-.92-1.43-1.85-1.33C.72 6.73 0 5.94 0 5c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.76-2.24 5-5 5"/>
    </svg>
  )
}

function SyringeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14v-2h2v2h-2zm0-4V9h-2zm42v4h 4v-2h2v2h-2zm4-4v-2h2v2h-2zm0-4V9h2v4h-2z"/>
    </svg>
  )
}

function PillIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm3.5-7H8.5V8h7v2.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-1c0-.83-.67-1.5-1.5-1.5h-1c-.83 0-1.5.67-1.5 1.5v1.5c0 .28.22.5.5.5s.5-.22.5-.5V8h-1v3z"/>
    </svg>
  )
}

function DashboardIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
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

function BrainIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.33 12.91c.04.32.06.64.06.97 0 .34-.02.66-.06.97l-1.74.81c-.13.06-.28.09-.43.09-.15 0-.3-.03-.43-.09l-.77-.36c-.19-.09-.43-.09-.62 0l-.77.36c-.13.06-.28.09-.43.09-.15 0-.3-.03-.43-.09l-1.74-.81c-.04-.32-.06-.64-.06-.97s.02-.65.06-.97l1.74-.81c.13-.06.28-.09.43-.09.15 0 .3.03.43.09l.77.36c.19.09.43.09.62 0l.77-.36c.13-.06.28-.09.43-.09.15 0 .3.03.43.09l1.74.81zM12 5.5c1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5-3.5-1.57-3.5-3.5 1.57-3.5 3.5-3.5zM6 15l.75 2.66L9 19l2.25-1.25L13 19l3.25-1.25L18 15H6z"/>
    </svg>
  )
}

function ChatIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
    </svg>
  )
}

function EyeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
  )
}

function LockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>
  )
}

function BoltIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
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

function UserIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  )
}

function SettingsIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
    </svg>
  )
}

// Auth Section
function AuthSection({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    setTimeout(() => {
      if (isLogin) {
        const user = DEMO_USERS.find(u => u.email === email && u.password === password)
        if (user) {
          onLogin({ email: user.email, name: user.name })
        } else {
          setError('Invalid credentials. Try demo@medvision.ai / demo123')
          setLoading(false)
        }
      } else {
        onLogin({ email, name: name || email.split('@')[0] })
      }
    }, 1000)
  }

  return (
    <div className="auth-content">
      <div className="auth-logo">
        <HeartIcon className="auth-heart heartbeat" />
      </div>
      <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
      <p>{isLogin ? 'Sign in to access your health dashboard' : 'Join MedVision AI today'}</p>
      
      {error && <div className="auth-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label><UserIcon /> Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
        )}
        <div className="form-group">
          <label><DocumentIcon /> Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label><LockIcon /> Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" className="btn-primary full-width" disabled={loading}>
          {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
      </form>
      
      <div className="auth-divider">
        <span>or</span>
      </div>
      
      <div className="demo-buttons">
        {DEMO_USERS.map(u => (
          <button 
            key={u.email} 
            className="demo-btn"
            onClick={() => { setEmail(u.email); setPassword(u.password); }}
          >
            {u.name}
          </button>
        ))}
      </div>
      
      <div className="auth-switch">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}

// 3D-like Card Component
function Card3D({ icon: Icon, title, description, onClick }) {
  return (
    <div className="card-3d" onClick={onClick}>
      <div className="card-glow"></div>
      <div className="card-icon">
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

// Feature Item
function FeatureItem({ icon: Icon, title, description }) {
  return (
    <div className="feature-item-landing">
      <div className="feature-icon-landing">
        <Icon />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

// Pricing Card
function PricingCard({ title, price, features, recommended = false }) {
  return (
    <div className={`pricing-card ${recommended ? 'recommended' : ''}`}>
      {recommended && <span className="recommended-badge">Most Popular</span>}
      <h3>{title}</h3>
      <div className="price">
        <span className="amount">{price}</span>
        <span className="period">/month</span>
      </div>
      <ul className="features-list">
        {features.map((feature, i) => (
          <li key={i}><BoltIcon /> {feature}</li>
        ))}
      </ul>
      <button className={recommended ? 'btn-primary' : 'btn-secondary'}>
        Get Started
      </button>
    </div>
  )
}

// Testimonial Card
function TestimonialCard({ name, role, image, quote, rating }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-header">
        <div className="testimonial-avatar">{image}</div>
        <div>
          <h4>{name}</h4>
          <span>{role}</span>
        </div>
      </div>
      <p className="testimonial-quote">"{quote}"</p>
      <div className="testimonial-rating">
        {[...Array(rating)].map((_, i) => (
          <HeartIcon key={i} className="star" />
        ))}
      </div>
    </div>
  )
}

// Main Landing Page Component
export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [webglSupported, setWebglSupported] = useState(true)

  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'ai-doctor', label: 'AI Doctor' },
    { id: 'features', label: 'Features' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'cta', label: 'Get Started' }
  ]

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('medvision_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('medvision_user')
  }

  const scrollToSection = (index) => {
    const section = document.getElementById(`section-${index}`)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
    setCurrentSection(index)
  }

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setWebglSupported(false)
      } else {
        setWebglSupported(true)
      }
    } catch (e) {
      setWebglSupported(false)
    }
    setIsLoading(false)
  }, [])

  // Handle scroll for section tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2
      sections.forEach((section, index) => {
        const element = document.getElementById(`section-${index}`)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            setCurrentSection(index)
          }
        }
      })
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  // Check for existing user
  useEffect(() => {
    const savedUser = localStorage.getItem('medvision_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  // If logged in, show dashboard
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />
  }

  return (
    <div className="landing-container">
      {/* 3D Background */}
      <Suspense fallback={<LoadingScreen />}>
        <Scene3D />
      </Suspense>

      {/* Header */}
      <header className="landing-header glass">
        <div className="logo">
          <HeartIcon className="logo-icon heartbeat" />
          <span className="logo-text">MedVision AI</span>
        </div>
        <nav className="nav-links">
          {sections.map((section, index) => (
            <button 
              key={section.id} 
              className={currentSection === index ? 'active' : ''}
              onClick={() => scrollToSection(index)}
            >
              {section.label}
            </button>
          ))}
          <button className="get-started-btn" onClick={() => setShowAuth(true)}>
            <HeartIcon /> Get Started
          </button>
        </nav>
      </header>

      {/* Progress Dots */}
      <div className="progress-dots-landing">
        {sections.map((_, index) => (
          <button
            key={index}
            className={`progress-dot ${currentSection === index ? 'active' : ''}`}
            onClick={() => scrollToSection(index)}
          />
        ))}
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div className="auth-modal-overlay" onClick={() => setShowAuth(false)}>
          <div className="auth-modal glass" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowAuth(false)}>✕</button>
            <AuthSection onLogin={(userData) => { handleLogin(userData); setShowAuth(false); }} />
          </div>
        </div>
      )}

      {/* Scroll Container */}
      <div className="scroll-container">
        {/* Section 0: Hero */}
        <section id="section-0" className="landing-section hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <BrainIcon /> AI-Powered Healthcare
            </div>
            <h1 className="hero-title">
              <span className="gradient-text">MedVision AI</span>
            </h1>
            <p className="hero-subtitle">
              Your Personal AI Healthcare Companion
            </p>
            <p className="hero-description">
              Experience the future of healthcare with our immersive 3D AI platform.
              Get instant symptom analysis, medical report insights, and personalized care.
            </p>
            <div className="hero-actions">
              <button className="cta-primary large" onClick={() => setShowAuth(true)}>
                <HeartIcon /> Get Started Free
              </button>
              <button className="cta-secondary" onClick={() => scrollToSection(1)}>
                Watch Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">100K+</span>
                <span className="stat-label">Users</span>
              </div>
              <div className="stat">
                <span className="stat-value">50M+</span>
                <span className="stat-label">Analyses</span>
              </div>
              <div className="stat">
                <span className="stat-value">4.9</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card glass">
              <div className="hero-card-icon">
                <ChatIcon />
              </div>
              <div className="hero-card-content">
                <p>Describe your symptoms...</p>
              </div>
            </div>
            <div className="hero-card response glass">
              <div className="hero-card-icon ai">
                <BrainIcon />
              </div>
              <div className="hero-card-content">
                <p>Based on your symptoms, this could be a tension headache...</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: AI Doctor */}
        <section id="section-1" className="landing-section">
          <div className="section-content">
            <div className="section-header">
              <span className="section-badge">
                <ChatIcon /> 24/7 AI Assistant
              </span>
              <h2>Your Personal AI Doctor</h2>
              <p>
                Meet your AI healthcare companion, available around the clock to answer your 
                health questions, analyze symptoms, and provide personalized recommendations.
              </p>
            </div>
            <div className="features-grid">
              <FeatureItem 
                icon={ChatIcon}
                title="Symptom Analysis"
                description="Describe your symptoms and get AI-powered insights instantly"
              />
              <FeatureItem 
                icon={BrainIcon}
                title="Smart Diagnosis"
                description="Advanced AI compares your symptoms against medical databases"
              />
              <FeatureItem 
                icon={LockIcon}
                title="Privacy First"
                description="Your health data is encrypted and completely confidential"
              />
              <FeatureItem 
                icon={EyeIcon}
                title="Visual Analysis"
                description="Upload medical images for AI-powered interpretation"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Features */}
        <section id="section-2" className="landing-section">
          <div className="section-content">
            <div className="section-header">
              <span className="section-badge">
                <StethoscopeIcon /> Complete Healthcare
              </span>
              <h2>Everything You Need</h2>
              <p>
                A comprehensive suite of AI-powered tools to manage your health journey
              </p>
            </div>
            <div className="cards-grid">
              <Card3D 
                icon={StethoscopeIcon}
                title="Report Analyzer"
                description="Upload and analyze medical reports with AI vision"
                onClick={() => setShowAuth(true)}
              />
              <Card3D 
                icon={ChatIcon}
                title="AI Chatbot"
                description="24/7 symptom checking and health guidance"
                onClick={() => setShowAuth(true)}
              />
              <Card3D 
                icon={SyringeIcon}
                title="Vaccination Tracker"
                description="Never miss a vaccine with smart reminders"
                onClick={() => setShowAuth(true)}
              />
              <Card3D 
                icon={PillIcon}
                title="Medication Manager"
                description="Track medications and check drug interactions"
                onClick={() => setShowAuth(true)}
              />
            </div>
          </div>
        </section>

        {/* Section 3: Dashboard Preview */}
        <section id="section-3" className="landing-section">
          <div className="section-content">
            <div className="section-header">
              <span className="section-badge">
                <DashboardIcon /> Your Health Hub
              </span>
              <h2>Complete Health Dashboard</h2>
              <p>
                Access all your health metrics, reports, and AI insights in one place
              </p>
            </div>
            <div className="dashboard-preview">
              <div className="preview-card glass">
                <div className="preview-header">
                  <DashboardIcon />
                  <span>Health Overview</span>
                </div>
                <div className="preview-stats">
                  <div className="preview-stat">
                    <HeartIcon className="pulse" />
                    <span>72 bpm</span>
                  </div>
                  <div className="preview-stat">
                    <span>120/80</span>
                    <small>Blood Pressure</small>
                  </div>
                  <div className="preview-stat">
                    <span>98.6°F</span>
                    <small>Temperature</small>
                  </div>
                </div>
              </div>
              <div className="preview-features">
                <div className="preview-feature">
                  <StethoscopeIcon />
                  <span>Medical Reports</span>
                </div>
                <div className="preview-feature">
                  <ChatIcon />
                  <span>Chat History</span>
                </div>
                <div className="preview-feature">
                  <SyringeIcon />
                  <span>Vaccinations</span>
                </div>
                <div className="preview-feature">
                  <PillIcon />
                  <span>Medications</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Pricing */}
        <section id="section-4" className="landing-section">
          <div className="section-content">
            <div className="section-header">
              <span className="section-badge">
                <BoltIcon /> Simple Pricing
              </span>
              <h2>Choose Your Plan</h2>
              <p>
                Flexible pricing options to match your healthcare needs
              </p>
            </div>
            <div className="pricing-grid">
              <PricingCard 
                title="Free"
                price="$0"
                features={[
                  'Basic symptom checker',
                  '1 AI consultation/month',
                  'Report upload (3/month)',
                  'Community support'
                ]}
              />
              <PricingCard 
                title="Premium"
                price="$9.99"
                recommended
                features={[
                  'Advanced symptom analysis',
                  'Unlimited AI consultations',
                  'Unlimited report uploads',
                  'Priority support',
                  'Medication reminders'
                ]}
              />
              <PricingCard 
                title="Family"
                price="$24.99"
                features={[
                  'Everything in Premium',
                  'Up to 5 family members',
                  'Family health dashboard',
                  'Vaccination tracking',
                  'Annual health reports'
                ]}
              />
            </div>
          </div>
        </section>

        {/* Section 5: Testimonials */}
        <section id="section-5" className="landing-section">
          <div className="section-content">
            <div className="section-header">
              <span className="section-badge">
                <HeartIcon /> User Reviews
              </span>
              <h2>What Our Users Say</h2>
              <p>
                Hear from people who have transformed their healthcare experience
              </p>
            </div>
            <div className="testimonials-grid">
              <TestimonialCard 
                name="Sarah Johnson"
                role="Working Mom"
                image="SJ"
                quote="MedVision AI helped me identify my daughter's ear infection early. The AI chatbot is incredibly helpful!"
                rating={5}
              />
              <TestimonialCard 
                name="Michael Chen"
                role="Fitness Enthusiast"
                image="MC"
                quote="The medication manager feature has been a game-changer. Never miss a dose again!"
                rating={5}
              />
              <TestimonialCard 
                name="Emily Rodriguez"
                role="Senior Citizen"
                image="ER"
                quote="As someone who takes multiple medications, this app gives me peace of mind."
                rating={4}
              />
            </div>
          </div>
        </section>

        {/* Section 6: FAQ */}
        <section id="section-6" className="landing-section">
          <div className="section-content">
            <div className="section-header">
              <span className="section-badge">
                <BrainIcon /> Common Questions
              </span>
              <h2>Frequently Asked Questions</h2>
              <p>
                Everything you need to know about MedVision AI
              </p>
            </div>
            <div className="faq-grid">
              <div className="faq-item glass">
                <h4><ChatIcon /> Is my health data secure?</h4>
                <p>Yes! We use bank-level encryption and never share your personal health information.</p>
              </div>
              <div className="faq-item glass">
                <h4><EyeIcon /> Can the AI replace my doctor?</h4>
                <p>No, MedVision AI is designed to complement, not replace, professional medical advice.</p>
              </div>
              <div className="faq-item glass">
                <h4><DocumentIcon /> What types of reports can I upload?</h4>
                <p>We support PDF, images (JPG, PNG), and common document formats.</p>
              </div>
              <div className="faq-item glass">
                <h4><BoltIcon /> How accurate is the symptom checker?</h4>
                <p>Our AI has been trained on millions of medical cases with 95% accuracy rate.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: About */}
        <section id="section-7" className="landing-section">
          <div className="section-content">
            <div className="section-header">
              <span className="section-badge">
                <HeartIcon /> Our Mission
              </span>
              <h2>About MedVision AI</h2>
              <p>
                Making healthcare accessible, personalized, and intelligent through AI technology
              </p>
            </div>
            <div className="about-content">
              <div className="about-text">
                <p>
                  MedVision AI was founded with a simple mission: to make healthcare more accessible 
                  and personalized for everyone. Our platform combines cutting-edge AI technology with 
                  a user-friendly interface to help you take control of your health journey.
                </p>
                <p>
                  Our team includes doctors, AI researchers, and healthcare technology experts who 
                  are passionate about improving patient outcomes through innovation.
                </p>
                <div className="about-stats">
                  <div className="about-stat">
                    <span className="about-stat-value">50M+</span>
                    <span className="about-stat-label">Analyses Performed</span>
                  </div>
                  <div className="about-stat">
                    <span className="about-stat-value">100K+</span>
                    <span className="about-stat-label">Active Users</span>
                  </div>
                  <div className="about-stat">
                    <span className="about-stat-value">95%</span>
                    <span className="about-stat-label">Satisfaction Rate</span>
                  </div>
                </div>
              </div>
              <div className="about-values">
                <div className="value-item glass">
                  <ShieldIcon />
                  <h4>Security</h4>
                  <p>Your data is protected with industry-leading encryption</p>
                </div>
                <div className="value-item glass">
                  <BrainIcon />
                  <h4>Innovation</h4>
                  <p>Continuously improving our AI capabilities</p>
                </div>
                <div className="value-item glass">
                  <HeartIcon />
                  <h4>Care</h4>
                  <p>Putting patients first in everything we do</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Contact */}
        <section id="section-8" className="landing-section">
          <div className="section-content">
            <div className="section-header">
              <span className="section-badge">
                <ChatIcon /> Get in Touch
              </span>
              <h2>Contact Us</h2>
              <p>
                Have questions? We'd love to hear from you
              </p>
            </div>
            <div className="contact-grid">
              <div className="contact-info glass">
                <div className="contact-item">
                  <HeartIcon />
                  <div>
                    <h4>Support</h4>
                    <p>support@medvision.ai</p>
                  </div>
                </div>
                <div className="contact-item">
                  <ChatIcon />
                  <div>
                    <h4>Sales</h4>
                    <p>sales@medvision.ai</p>
                  </div>
                </div>
                <div className="contact-item">
                  <DocumentIcon />
                  <div>
                    <h4>Press</h4>
                    <p>press@medvision.ai</p>
                  </div>
                </div>
              </div>
              <form className="contact-form glass">
                <div className="form-group">
                  <label><UserIcon /> Name</label>
                  <input type="text" placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label><DocumentIcon /> Email</label>
                  <input type="email" placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label><ChatIcon /> Message</label>
                  <textarea placeholder="How can we help?" rows={4} />
                </div>
                <button type="submit" className="btn-primary full-width">Send Message</button>
              </form>
            </div>
          </div>
        </section>

        {/* Section 9: CTA */}
        <section id="section-9" className="landing-section cta-section">
          <div className="cta-content">
            <h2>Ready to Transform Your Healthcare?</h2>
            <p>
              Join thousands of users who have already discovered the future of AI-powered healthcare
            </p>
            <div className="cta-actions">
              <button className="cta-primary large" onClick={() => setShowAuth(true)}>
                <HeartIcon /> Get Started Free
              </button>
              <div className="cta-demo">
                <p>Demo Account:</p>
                <code>demo@medvision.ai / demo123</code>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="landing-footer glass">
        <div className="footer-content">
          <div className="footer-brand">
            <HeartIcon className="footer-logo heartbeat" />
            <span>MedVision AI</span>
          </div>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#hipaa">HIPAA Compliance</a>
            <a href="#contact">Contact</a>
          </div>
          <p className="footer-copyright">
            © 2024 MedVision AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
