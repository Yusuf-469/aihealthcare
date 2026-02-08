import React from 'react'

export function EmergencyBanner() {
  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 200,
      animation: 'slideDown 0.3s ease-out'
    }}>
      <div className="emergency-banner" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(255, 107, 107, 0.4)'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <div>
          <p style={{ margin: 0, fontWeight: '600', fontSize: '1rem' }}>
            ⚠️ Emergency Symptoms Detected
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
            Based on your symptoms, please seek immediate medical attention
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
          <button 
            style={{
              background: 'white',
              color: '#FF6B6B',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onClick={() => window.location.href = 'tel:911'}
          >
            Call 911
          </button>
          <button 
            style={{
              background: 'transparent',
              color: 'white',
              border: '1px solid white',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=emergency+room+near+me', '_blank')}
          >
            Find ER
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
