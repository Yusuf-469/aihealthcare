import React, { useState, useRef } from 'react'
import { useStore } from '../store'

// Mock analysis results
const mockAnalysisResults = {
  overallStatus: 'Attention Needed',
  anomalies: [
    { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '12.0-16.0', status: 'normal', explanation: 'Within healthy range' },
    { name: 'WBC', value: '11.5', unit: '10³/µL', range: '4.5-11.0', status: 'high', explanation: 'Slightly elevated - may indicate infection or inflammation' },
    { name: 'Platelets', value: '245', unit: '10³/µL', range: '150-400', status: 'normal', explanation: 'Within healthy range' },
    { name: 'Glucose', value: '126', unit: 'mg/dL', range: '70-100', status: 'high', explanation: 'Above normal - consider diabetes screening' },
  ],
  summary: 'Your blood test shows elevated white blood cell count and glucose levels. These findings warrant attention. The WBC elevation suggests possible infection or inflammation, while elevated glucose may indicate prediabetes or diabetes. I recommend discussing these results with your healthcare provider for proper evaluation and follow-up testing.',
  recommendations: [
    'Schedule appointment with primary care physician within 1-2 weeks',
    'Request HbA1c test for diabetes screening',
    'Monitor symptoms of infection (fever, fatigue)',
    'Consider fasting glucose test for confirmation'
  ]
}

export function ReportUpload({ onClose }) {
  const { setIsAnalyzing } = useStore()
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [results, setResults] = useState(null)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (selectedFile) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/dicom']
    if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.dcm')) {
      setFile(selectedFile)
    } else {
      alert('Please upload a PDF, JPEG, PNG, or DICOM file')
    }
  }

  const handleAnalyze = () => {
    if (!file) return
    
    setAnalyzing(true)
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      setResults(mockAnalysisResults)
      setAnalyzing(false)
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }, 3000)
  }

  const resetUpload = () => {
    setFile(null)
    setAnalysisComplete(false)
    setResults(null)
  }

  return (
    <div className="glass-card" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #20B2AA 0%, #0066CC 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Medical Report Analyzer</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#78909C' }}>Upload blood tests, X-rays, MRIs, prescriptions</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#78909C',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          ✕
        </button>
      </div>

      {!analysisComplete ? (
        <>
          {/* File Upload Area */}
          {!file ? (
            <div
              className={`file-upload ${dragActive ? 'dragging' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              style={{ marginBottom: '20px' }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#0066CC" style={{ marginBottom: '16px' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/>
              </svg>
              <p style={{ fontSize: '1rem', marginBottom: '8px' }}>
                Drag & drop your medical report here
              </p>
              <p style={{ fontSize: '0.875rem', color: '#78909C', marginBottom: '16px' }}>
                Supports PDF, JPEG, PNG, DICOM files
              </p>
              <button className="btn-primary">Browse Files</button>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.dcm"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            /* File Selected */
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0066CC 0%, #20B2AA 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v9h4v4H6z"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '500' }}>{file.name}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#78909C' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={resetUpload}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#78909C',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          {file && !analyzing && (
            <button 
              className="btn-primary" 
              onClick={handleAnalyze}
              style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
            >
              Analyze Report
            </button>
          )}

          {/* Analyzing Animation */}
          {analyzing && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                position: 'relative'
              }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(0, 102, 204, 0.2)" strokeWidth="4"/>
                  <circle 
                    cx="40" cy="40" r="35" 
                    fill="none" 
                    stroke="#0066CC" 
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="220"
                    strokeDashoffset="220"
                    style={{ 
                      animation: 'analyzeRing 3s ease-in-out forwards',
                      transform: 'rotate(-90deg)',
                      transformOrigin: '50% 50%'
                    }}
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '0.875rem',
                  color: '#FAFBFC'
                }}>
                  AI Processing
                </div>
              </div>
              <p style={{ color: '#78909C' }}>
                Analyzing medical report with AI vision model...
              </p>
              <p style={{ fontSize: '0.8rem', color: '#546E7A', marginTop: '8px' }}>
                Extracting data • Comparing to normal ranges • Generating insights
              </p>
            </div>
          )}
        </>
      ) : (
        /* Analysis Results */
        <div className="animate-fade-in">
          {/* Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            padding: '16px',
            background: 'rgba(255, 152, 0, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 152, 0, 0.3)'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#FF9800'
            }} />
            <span style={{ fontWeight: '500' }}>{results.overallStatus}</span>
          </div>

          {/* Anomalies Table */}
          <h4 style={{ marginBottom: '12px' }}>Detected Values</h4>
          <div style={{ marginBottom: '24px' }}>
            {results.anomalies.map((item, i) => (
              <div 
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '500' }}>{item.name}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#78909C' }}>
                    {item.explanation}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '1.1rem', 
                    fontWeight: '600',
                    color: item.status === 'normal' ? '#4CAF50' : item.status === 'high' ? '#FF6B6B' : '#FF9800'
                  }}>
                    {item.value} <span style={{ fontSize: '0.8rem', fontWeight: '400' }}>{item.unit}</span>
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#78909C' }}>
                    Normal: {item.range}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <h4 style={{ marginBottom: '12px' }}>AI Summary</h4>
          <p style={{ 
            marginBottom: '24px', 
            fontSize: '0.9rem', 
            lineHeight: '1.6',
            color: '#B0BEC5'
          }}>
            {results.summary}
          </p>

          {/* Recommendations */}
          <h4 style={{ marginBottom: '12px' }}>Recommended Next Steps</h4>
          <ul style={{ 
            marginBottom: '24px', 
            paddingLeft: '20px',
            color: '#B0BEC5'
          }}>
            {results.recommendations.map((rec, i) => (
              <li key={i} style={{ marginBottom: '8px', fontSize: '0.9rem' }}>{rec}</li>
            ))}
          </ul>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn-primary" 
              style={{ flex: 1 }}
              onClick={() => alert('Connecting to AI Doctor chat...')}
            >
              💬 Consult AI Doctor
            </button>
            <button 
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              📄 Download Report
            </button>
          </div>

          <button 
            onClick={resetUpload}
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '12px',
              background: 'transparent',
              border: 'none',
              color: '#78909C',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            ← Upload Another Report
          </button>
        </div>
      )}

      <style>{`
        @keyframes analyzeRing {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  )
}
