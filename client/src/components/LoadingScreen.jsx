import React from 'react'

export default function LoadingScreen() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a1628 0%, #1a2a4a 50%, #0d2137 100%)',
      color: '#FAFBFC'
    }}>
      {/* Medical Cross Logo Animation */}
      <div style={{
        width: '80px',
        height: '80px',
        position: 'relative',
        marginBottom: '32px',
        animation: 'pulse 2s ease-in-out infinite'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '70px',
          background: 'linear-gradient(135deg, #0066CC 0%, #20B2AA 100%)',
          borderRadius: '8px',
          boxShadow: '0 0 40px rgba(0, 102, 204, 0.5)'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70px',
          height: '40px',
          background: 'linear-gradient(135deg, #0066CC 0%, #20B2AA 100%)',
          borderRadius: '8px',
          boxShadow: '0 0 40px rgba(0, 102, 204, 0.5)'
        }} />
      </div>

      <h1 style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '2rem',
        fontWeight: '600',
        marginBottom: '8px',
        background: 'linear-gradient(135deg, #0066CC 0%, #20B2AA 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        MedVision AI
      </h1>
      
      <p style={{
        fontFamily: "'Roboto', sans-serif",
        fontSize: '1rem',
        color: '#B0BEC5',
        marginBottom: '32px'
      }}>
        Virtual Healthcare Platform
      </p>

      {/* Loading Spinner */}
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid rgba(0, 102, 204, 0.2)',
        borderTopColor: '#0066CC',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />

      <p style={{
        fontFamily: "'Roboto', sans-serif",
        fontSize: '0.875rem',
        color: '#78909C',
        marginTop: '24px'
      }}>
        Initializing medical environment...
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
