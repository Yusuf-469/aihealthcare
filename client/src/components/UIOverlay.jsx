import React, { useState } from 'react'
import { useStore } from '../store'
import { ChatInterface } from './ChatInterface'
import { ReportUpload } from './ReportUpload'
import { Dashboard } from './Dashboard'
import { EmergencyBanner } from './EmergencyBanner'

export function UIOverlay() {
  const { activeTool, setActiveTool, chatMessages } = useStore()
  const [showDashboard, setShowDashboard] = useState(false)

  const emergencyKeywords = ['chest pain', 'difficulty breathing', 'stroke', 'heart attack', 'severe bleeding']
  const hasEmergency = chatMessages.some(msg => 
    msg.sender === 'user' && emergencyKeywords.some(keyword => msg.content.toLowerCase().includes(keyword))
  )

  return (
    <>
      {/* Top Navigation Bar */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(10, 22, 40, 0.9) 0%, rgba(10, 22, 40, 0) 100%)',
        zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0066CC 0%, #20B2AA 100%)',
            borderRadius: '8px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.5L18 8v8l-6 3.5L6 16V8l6-3.5z"/>
              <path d="M12 12m-2 0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>MedVision AI</h1>
            <p style={{ fontSize: '0.75rem', color: '#78909C', margin: 0 }}>Virtual Healthcare Platform</p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setShowDashboard(!showDashboard)}
            className="btn-secondary"
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            {showDashboard ? 'Close' : 'Dashboard'}
          </button>
          <button 
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            Emergency: 911
          </button>
        </div>
      </header>

      {/* Emergency Banner */}
      {hasEmergency && <EmergencyBanner />}

      {/* Active Tool Panels */}
      {activeTool === 'avatar' && (
        <div style={{
          position: 'fixed',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '420px',
          maxHeight: '80vh',
          zIndex: 50
        }}>
          <ChatInterface onClose={() => setActiveTool(null)} />
        </div>
      )}

      {activeTool === 'stethoscope' && (
        <div style={{
          position: 'fixed',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '600px',
          maxHeight: '80vh',
          zIndex: 50
        }}>
          <ReportUpload onClose={() => setActiveTool(null)} />
        </div>
      )}

      {/* Dashboard Modal */}
      {showDashboard && (
        <div className="modal-overlay" onClick={() => setShowDashboard(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
            <Dashboard onClose={() => setShowDashboard(false)} />
          </div>
        </div>
      )}

      {/* Welcome Message */}
      {!activeTool && !showDashboard && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 50
        }}>
          <div className="glass-card glass-card-hover" style={{
            padding: '20px 32px',
            cursor: 'pointer',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <p style={{ fontSize: '1rem', color: '#FAFBFC', marginBottom: '8px' }}>
              👋 Welcome to your virtual clinic. Click on any tool to begin.
            </p>
            <p style={{ fontSize: '0.875rem', color: '#78909C' }}>
              💬 Chat with AI Doctor • 📄 Analyze Reports • 💊 Track Medications
            </p>
          </div>
        </div>
      )}

      {/* Bottom Disclaimer */}
      <footer style={{
        position: 'fixed',
        bottom: '8px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '0.75rem',
        color: '#546E7A',
        textAlign: 'center',
        zIndex: 10
      }}>
        ⚠️ This AI system is not a substitute for professional medical advice. Always consult a doctor for medical concerns.
      </footer>
    </>
  )
}
