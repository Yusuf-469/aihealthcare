import React, { useState, useEffect } from 'react'

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

function BrainIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
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
      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14v-2h2v2h-2zm0-4V9h2v4h-2zm4 4v-2h2v2h-2zm4-4v-2h2v2h-2zm0-4V9h2v4h-2z"/>
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

function ShieldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
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

// Auth Modal Component
function AuthModal({ onLogin, onClose }) {
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

  const handleDemoLogin = () => {
    setLoading(true)
    setTimeout(() => {
      onLogin({ email: 'demo@medvision.ai', name: 'Demo User' })
    }, 500)
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>✕</button>
        <div className="auth-content">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Sign in to access your interactive 3D dashboard' : 'Join MedVision AI today'}</p>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
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
          
          <button className="demo-btn full-width" onClick={handleDemoLogin} disabled={loading}>
            Try Demo Account
          </button>
          
          <p className="auth-switch">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

// Main Landing Page Component
export default function InteractiveLanding({ onLogin }) {
  const [showAuth, setShowAuth] = useState(false)
  const [scrolled, setScrolled] = useState(0)

  // Scroll animation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogin = (userData) => {
    onLogin(userData)
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <BrainIcon /> AI-Powered Healthcare Platform
          </div>
          <h1 className="hero-title">
            <span className="gradient-text">MedVision AI</span>
          </h1>
          <p className="hero-subtitle">
            Experience the Future of Healthcare
          </p>
          <p className="hero-description">
            An immersive 3D platform with AI-powered symptom checking,
            medical report analysis, vaccination tracking, and medication management.
          </p>
          <div className="hero-actions">
            <button className="cta-primary large" onClick={() => setShowAuth(true)}>
              <HeartIcon /> Get Started Free
            </button>
            <button className="cta-secondary" onClick={() => {
              document.getElementById('features').scrollIntoView({ behavior: 'smooth' })
            }}>
              Explore Features
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
        
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">
              <ChatIcon /> Interactive 3D Tools
            </span>
            <h2>Your Personal Health Assistant</h2>
            <p>Four powerful 3D interactive tools to manage your healthcare journey</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card doctor">
              <div className="feature-icon">
                <HeartIcon />
              </div>
              <h3>AI Symptom Checker</h3>
              <p>Describe your symptoms and get instant AI-powered analysis with possible conditions and recommendations.</p>
              <ul className="feature-list">
                <li>✓ Natural language symptom input</li>
                <li>✓ Condition probability analysis</li>
                <li>✓ Severity assessment</li>
                <li>✓ Professional recommendations</li>
              </ul>
            </div>
            
            <div className="feature-card stethoscope">
              <div className="feature-icon">
                <StethoscopeIcon />
              </div>
              <h3>Medical Report Analyzer</h3>
              <p>Upload and analyze your medical reports using advanced AI vision technology.</p>
              <ul className="feature-list">
                <li>✓ PDF & Image upload</li>
                <li>✓ OCR text extraction</li>
                <li>✓ Anomaly detection</li>
                <li>✓ Plain English explanations</li>
              </ul>
            </div>
            
            <div className="feature-card syringe">
              <div className="feature-icon">
                <SyringeIcon />
              </div>
              <h3>Vaccination Tracker</h3>
              <p>Keep track of all your vaccinations and receive timely reminders.</p>
              <ul className="feature-list">
                <li>✓ Complete vaccination history</li>
                <li>✓ Smart reminder alerts</li>
                <li>✓ Export records</li>
                <li>✓ Travel vaccination advice</li>
              </ul>
            </div>
            
            <div className="feature-card pills">
              <div className="feature-icon">
                <PillIcon />
              </div>
              <h3>Medication Manager</h3>
              <p>Track your medications, check interactions, and never miss a dose.</p>
              <ul className="feature-list">
                <li>✓ Dosage tracking</li>
                <li>✓ Drug interaction check</li>
                <li>✓ Refill reminders</li>
                <li>✓ Prescription storage</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">
              <EyeIcon /> Simple Process
            </span>
            <h2>How It Works</h2>
            <p>Get started in three simple steps</p>
          </div>
          
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up for free and set up your health profile in minutes</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Explore 3D Tools</h3>
              <p>Access our interactive 3D healthcare tools after login</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get AI Insights</h3>
              <p>Receive personalized health analysis and recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="security-section">
        <div className="section-container">
          <div className="security-content">
            <div className="security-info">
              <span className="section-badge">
                <LockIcon /> Enterprise Security
              </span>
              <h2>Your Privacy Matters</h2>
              <p>We take data security seriously with enterprise-grade protection for your health information.</p>
              <div className="security-features">
                <div className="security-item">
                  <ShieldIcon />
                  <div>
                    <h4>HIPAA Compliant</h4>
                    <p>Meeting the highest healthcare data protection standards</p>
                  </div>
                </div>
                <div className="security-item">
                  <LockIcon />
                  <div>
                    <h4>End-to-End Encryption</h4>
                    <p>Your data is encrypted at rest and in transit</p>
                  </div>
                </div>
                <div className="security-item">
                  <BrainIcon />
                  <div>
                    <h4>AI Privacy</h4>
                    <p>Your health data is never used for AI training</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>
        <div className="cta-content">
          <h2>Ready to Transform Your Health?</h2>
          <p>Join 100,000+ users taking control of their health journey</p>
          <button className="cta-primary large" onClick={() => setShowAuth(true)}>
            Get Started Free
          </button>
          <p className="cta-note">No credit card required • Free for 14 days</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <HeartIcon />
            <span>MedVision AI</span>
          </div>
          <p className="footer-text">
            © 2024 MedVision AI. All rights reserved.
          </p>
          <p className="disclaimer">
            MedVision AI is not a substitute for professional medical advice.
            Always consult a healthcare provider for medical concerns.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal onLogin={handleLogin} onClose={() => setShowAuth(false)} />
      )}

      {/* CSS Styles */}
      <style>{`
        .landing-page {
          min-height: 100vh;
          background: #0a1628;
          color: #FAFBFC;
        }

        /* Hero Section */
        .hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 100px 20px 50px;
          position: relative;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
          animation: float 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #0066CC, #20B2AA);
          top: -200px;
          left: -200px;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #20B2AA, #0066CC);
          bottom: -150px;
          right: -150px;
          animation-delay: -5s;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #0066CC, #4CAF50);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 30px); }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 102, 204, 0.2);
          border: 1px solid rgba(0, 102, 204, 0.3);
          padding: 10px 20px;
          border-radius: 30px;
          font-size: 0.9rem;
          color: #20B2AA;
          margin-bottom: 30px;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          margin-bottom: 20px;
          line-height: 1.1;
        }

        .gradient-text {
          background: linear-gradient(135deg, #0066CC, #20B2AA, #4CAF50);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          color: #B0BEC5;
          margin-bottom: 15px;
        }

        .hero-description {
          font-size: 1.1rem;
          color: #78909C;
          max-width: 700px;
          margin: 0 auto 30px;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 50px;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #0066CC, #0052A3);
          color: white;
          border: none;
          padding: 15px 35px;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 102, 204, 0.4);
        }

        .cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 102, 204, 0.5);
        }

        .cta-primary.large {
          padding: 18px 45px;
          font-size: 1.1rem;
        }

        .cta-secondary {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FAFBFC;
          padding: 15px 35px;
          border-radius: 30px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cta-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 60px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #20B2AA;
        }

        .stat-label {
          color: #78909C;
          font-size: 0.9rem;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #78909C;
          font-size: 0.85rem;
          animation: bounce 2s ease-in-out infinite;
        }

        .scroll-arrow {
          width: 20px;
          height: 20px;
          border-right: 2px solid #20B2AA;
          border-bottom: 2px solid #20B2AA;
          transform: rotate(45deg);
        }

        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }

        /* Features Section */
        .features-section {
          padding: 100px 20px;
          position: relative;
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 102, 204, 0.2);
          border: 1px solid rgba(0, 102, 204, 0.3);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #20B2AA;
          margin-bottom: 15px;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .section-header p {
          color: #78909C;
          font-size: 1.1rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 35px;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          border-color: rgba(0, 102, 204, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .feature-card.doctor:hover {
          border-color: #FF6B6B;
        }

        .feature-card.stethoscope:hover {
          border-color: #20B2AA;
        }

        .feature-card.syringe:hover {
          border-color: #0066CC;
        }

        .feature-card.pills:hover {
          border-color: #4CAF50;
        }

        .feature-icon {
          width: 70px;
          height: 70px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 20px;
        }

        .feature-card.doctor .feature-icon {
          background: rgba(255, 107, 107, 0.2);
        }

        .feature-card.stethoscope .feature-icon {
          background: rgba(32, 178, 170, 0.2);
        }

        .feature-card.syringe .feature-icon {
          background: rgba(0, 102, 204, 0.2);
        }

        .feature-card.pills .feature-icon {
          background: rgba(76, 175, 80, 0.2);
        }

        .feature-card h3 {
          font-size: 1.3rem;
          margin-bottom: 10px;
        }

        .feature-card > p {
          color: #78909C;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .feature-list {
          list-style: none;
        }

        .feature-list li {
          color: #B0BEC5;
          font-size: 0.9rem;
          padding: 5px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .feature-list li::before {
          content: '✓';
          color: #20B2AA;
        }

        /* How It Works */
        .how-it-works-section {
          padding: 100px 20px;
          background: rgba(0, 102, 204, 0.05);
        }

        .steps-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .step {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px 30px;
          text-align: center;
          max-width: 280px;
          transition: all 0.3s ease;
        }

        .step:hover {
          transform: translateY(-5px);
          border-color: rgba(0, 102, 204, 0.3);
        }

        .step-number {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #0066CC, #20B2AA);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 auto 20px;
        }

        .step h3 {
          font-size: 1.2rem;
          margin-bottom: 10px;
        }

        .step p {
          color: #78909C;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .step-connector {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, #0066CC, #20B2AA);
        }

        /* Security Section */
        .security-section {
          padding: 100px 20px;
        }

        .security-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .security-info h2 {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .security-info > p {
          color: #78909C;
          font-size: 1.1rem;
          margin-bottom: 40px;
        }

        .security-features {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .security-item {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 25px;
        }

        .security-item svg {
          width: 40px;
          height: 40px;
          color: #20B2AA;
          flex-shrink: 0;
        }

        .security-item h4 {
          color: #FAFBFC;
          font-size: 1.1rem;
          margin-bottom: 5px;
        }

        .security-item p {
          color: #78909C;
          font-size: 0.9rem;
          margin: 0;
        }

        /* CTA Section */
        .cta-section {
          padding: 100px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .cta-content {
          position: relative;
          z-index: 1;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .cta-content > p {
          color: #78909C;
          font-size: 1.1rem;
          margin-bottom: 30px;
        }

        .cta-note {
          color: #78909C;
          font-size: 0.9rem;
          margin-top: 20px;
        }

        /* Footer */
        .footer {
          padding: 50px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 1.3rem;
          font-weight: 700;
          color: #FAFBFC;
          margin-bottom: 15px;
        }

        .footer-text {
          color: #78909C;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .disclaimer {
          color: #78909C;
          font-size: 0.8rem;
          opacity: 0.7;
        }

        /* Auth Modal */
        .auth-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(10, 22, 40, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .auth-modal {
          background: rgba(10, 22, 40, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          padding: 40px;
          width: 420px;
          max-width: 90%;
          position: relative;
        }

        .close-modal {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #FAFBFC;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
        }

        .auth-content h2 {
          text-align: center;
          margin-bottom: 5px;
        }

        .auth-content > p {
          text-align: center;
          color: #78909C;
          margin-bottom: 25px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-group label {
          display: block;
          color: #FAFBFC;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .form-group input {
          width: 100%;
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: #FAFBFC;
          font-size: 1rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: #0066CC;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0066CC, #0052A3);
          color: white;
          border: none;
          padding: 14px 25px;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary.full-width {
          width: 100%;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 102, 204, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-error {
          background: rgba(255, 107, 107, 0.2);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: #FF6B6B;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          text-align: center;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          margin: 25px 0;
          color: #78909C;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
        }

        .auth-divider span {
          padding: 0 15px;
          font-size: 0.85rem;
        }

        .demo-btn {
          background: rgba(0, 102, 204, 0.2);
          border: 1px solid rgba(0, 102, 204, 0.3);
          color: #20B2AA;
          padding: 14px 25px;
          border-radius: 10px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .demo-btn:hover:not(:disabled) {
          background: rgba(0, 102, 204, 0.3);
        }

        .demo-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-switch {
          text-align: center;
          color: #78909C;
          margin-top: 20px;
          font-size: 0.9rem;
        }

        .auth-switch button {
          background: none;
          border: none;
          color: #20B2AA;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .auth-switch button:hover {
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-stats {
            gap: 30px;
          }

          .hero-actions {
            flex-direction: column;
          }

          .steps-grid {
            flex-direction: column;
          }

          .step-connector {
            width: 2px;
            height: 30px;
          }
        }
      `}</style>
    </div>
  )
}
