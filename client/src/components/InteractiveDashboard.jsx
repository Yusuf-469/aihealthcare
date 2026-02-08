import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, useGLTF, Sparkles, Stars, Html } from '@react-three/drei'
import * as THREE from 'three'
import Dashboard from './Dashboard'

// GLB Model Components
function ModelDoctor({ position, rotation, scale, onClick, isActive }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/medical doctor 3d model.glb', true)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
      const targetScale = isActive ? scale * 1.3 : scale * 1.1
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
      
      // Pulse when active
      if (isActive) {
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1
      }
    }
  })
  
  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} onClick={onClick}>
      <primitive object={scene} />
    </group>
  )
}

function ModelStethoscope({ position, rotation, scale, onClick, isActive }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/stethoscope 3d model.glb', true)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
      const targetScale = isActive ? scale * 1.3 : scale * 1.1
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
      
      if (isActive) {
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1
      }
    }
  })
  
  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} onClick={onClick}>
      <primitive object={scene} />
    </group>
  )
}

function ModelSyringe({ position, rotation, scale, onClick, isActive }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/cartoon syringe 3d model.glb', true)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      const targetScale = isActive ? scale * 1.3 : scale * 1.1
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
      
      if (isActive) {
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1
      }
    }
  })
  
  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} onClick={onClick}>
      <primitive object={scene} />
    </group>
  )
}

function ModelPillBottle({ position, rotation, scale, onClick, isActive }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/pill bottle 3d model.glb', true)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.015
      const targetScale = isActive ? scale * 1.3 : scale * 1.1
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
      
      if (isActive) {
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1
      }
    }
  })
  
  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} onClick={onClick}>
      <primitive object={scene} />
    </group>
  )
}

// Big DNA Helix
function BigDNAHelix() {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003
    }
  })

  const strands = React.useMemo(() => {
    const temp = []
    for (let i = 0; i < 40; i++) {
      const y = (i - 20) * 0.25
      const angle = i * 0.3
      temp.push({ y, angle })
    }
    return temp
  }, [])

  return (
    <group ref={groupRef} position={[-10, 0, -8]} scale={2}>
      {strands.map((strand, i) => (
        <group key={i}>
          <mesh position={[Math.cos(strand.angle) * 0.6, strand.y, Math.sin(strand.angle) * 0.6]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#0066CC" emissive="#0066CC" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[Math.cos(strand.angle + Math.PI) * 0.6, strand.y, Math.sin(strand.angle + Math.PI) * 0.6]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#20B2AA" emissive="#20B2AA" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Floating Particles
function FloatingParticles({ count = 100 }) {
  return (
    <group>
      {new Array(count).fill().map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}
    </group>
  )
}

function FloatingParticle({ index }) {
  const meshRef = useRef()
  const initialY = (Math.random() - 0.5) * 30
  const speed = Math.random() * 0.02 + 0.01
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * speed + index) * 3
      meshRef.current.rotation.x += speed * 0.5
    }
  })
  
  return (
    <mesh ref={meshRef} position={[(Math.random() - 0.5) * 30, initialY, (Math.random() - 0.5) * 20]}>
      <sphereGeometry args={[Math.random() * 0.05 + 0.02, 8, 8]} />
      <meshStandardMaterial 
        color="#0066CC" 
        transparent 
        opacity={0.4} 
        emissive="#0066CC" 
        emissiveIntensity={0.3} 
      />
    </mesh>
  )
}

// Medical Crosses
function MedicalCrosses() {
  const crosses = React.useMemo(() => [
    { pos: [8, 4, -5], rot: [0, 0, 0.02] },
    { pos: [-8, -3, -6], rot: [0, 0, -0.02] },
    { pos: [6, -4, -4], rot: [0, 0, 0.01] },
    { pos: [-7, 5, -7], rot: [0, 0, -0.01] },
  ], [])

  return (
    <group>
      {crosses.map((cross, i) => (
        <MedicalCross key={i} position={cross.pos} rotation={cross.rot} />
      ))}
    </group>
  )
}

function MedicalCross({ position, rotation }) {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.002
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[0.4, 1.2, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.2} />
      </mesh>
      <mesh>
        <boxGeometry args={[1.2, 0.4, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

// AI Symptom Checker Panel
function SymptomCheckerPanel({ onClose }) {
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeSymptoms = () => {
    setLoading(true)
    setTimeout(() => {
      setResult({
        conditions: [
          { name: 'Common Cold', probability: 75, advice: 'Rest, fluids, OTC pain relievers' },
          { name: 'Seasonal Allergies', probability: 60, advice: 'Antihistamines, avoid allergens' },
        ],
        severity: 'mild',
        recommendation: 'Monitor symptoms. Consult a doctor if they worsen.'
      })
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="tool-panel symptom-checker">
      <button className="close-btn" onClick={onClose}>✕</button>
      <div className="panel-header">
        <span className="panel-icon">🩺</span>
        <h2>AI Symptom Checker</h2>
      </div>
      
      <div className="panel-content">
        <textarea
          placeholder="Describe your symptoms here..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={5}
        />
        
        <button 
          className="analyze-btn" 
          onClick={analyzeSymptoms}
          disabled={loading || !symptoms}
        >
          {loading ? 'Analyzing...' : 'Analyze Symptoms'}
        </button>
        
        {result && (
          <div className="analysis-result">
            <h3>Possible Conditions:</h3>
            {result.conditions.map((condition, i) => (
              <div key={i} className="condition-item">
                <span className="condition-name">{condition.name}</span>
                <span className="condition-prob">{condition.probability}%</span>
                <p className="condition-advice">{condition.advice}</p>
              </div>
            ))}
            <div className={`severity-badge ${result.severity}`}>
              Severity: {result.severity}
            </div>
            <p className="recommendation">{result.recommendation}</p>
          </div>
        )}
      </div>
      
      <style>{`
        .tool-panel {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(10, 22, 40, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          padding: 0;
          width: 500px;
          max-width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          z-index: 1000;
          animation: panelIn 0.4s ease;
        }
        
        @keyframes panelIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        .panel-header {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 25px 25px 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .panel-icon {
          font-size: 2.5rem;
        }
        
        .panel-header h2 {
          color: #FAFBFC;
          font-size: 1.5rem;
          margin: 0;
        }
        
        .panel-content {
          padding: 20px 25px 25px;
        }
        
        .panel-content textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 15px;
          color: #FAFBFC;
          font-size: 1rem;
          resize: vertical;
          margin-bottom: 15px;
        }
        
        .panel-content textarea:focus {
          outline: none;
          border-color: #0066CC;
        }
        
        .analyze-btn {
          width: 100%;
          background: linear-gradient(135deg, #0066CC, #0052A3);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 102, 204, 0.4);
        }
        
        .analyze-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .analysis-result {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .analysis-result h3 {
          color: #FAFBFC;
          font-size: 1.1rem;
          margin-bottom: 15px;
        }
        
        .condition-item {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 10px;
        }
        
        .condition-name {
          color: #FAFBFC;
          font-weight: 600;
          display: block;
        }
        
        .condition-prob {
          color: #20B2AA;
          font-size: 0.9rem;
        }
        
        .condition-advice {
          color: #B0BEC5;
          font-size: 0.9rem;
          margin-top: 8px;
        }
        
        .severity-badge {
          display: inline-block;
          padding: 6px 15px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin: 15px 0;
        }
        
        .severity-badge.mild {
          background: rgba(76, 175, 80, 0.2);
          color: #4CAF50;
        }
        
        .severity-badge.moderate {
          background: rgba(255, 152, 0, 0.2);
          color: #FF9800;
        }
        
        .severity-badge.severe {
          background: rgba(255, 107, 107, 0.2);
          color: #FF6B6B;
        }
        
        .recommendation {
          color: #B0BEC5;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        
        .close-btn {
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
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}

// Report Analyzer Panel
function ReportAnalyzerPanel({ onClose }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    setUploaded(true)
  }

  const analyzeReport = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setResults({
        summary: 'Blood test results show normal ranges for most indicators',
        findings: [
          { name: 'Hemoglobin', value: '14.2 g/dL', status: 'normal', range: '12-16 g/dL' },
          { name: 'White Blood Cells', value: '8,500 /µL', status: 'normal', range: '4,500-11,000 /µL' },
          { name: 'Platelets', value: '180,000 /µL', status: 'warning', range: '150,000-400,000 /µL' },
          { name: 'Cholesterol', value: '210 mg/dL', status: 'high', range: '<200 mg/dL' },
        ]
      })
      setAnalyzing(false)
    }, 3000)
  }

  return (
    <div className="tool-panel report-analyzer">
      <button className="close-btn" onClick={onClose}>✕</button>
      <div className="panel-header">
        <span className="panel-icon">📊</span>
        <h2>Medical Report Analyzer</h2>
      </div>
      
      <div className="panel-content">
        {!uploaded ? (
          <div 
            className={`drop-zone ${dragActive ? 'active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <span className="drop-icon">📄</span>
            <p>Drag & drop your medical report</p>
            <span className="drop-formats">PDF, JPG, PNG supported</span>
          </div>
        ) : (
          <div className="uploaded-file">
            <span>✓</span>
            <span>Report uploaded successfully</span>
            <button className="change-btn">Change file</button>
          </div>
        )}
        
        {uploaded && !results && (
          <button 
            className="analyze-btn" 
            onClick={analyzeReport}
            disabled={analyzing}
          >
            {analyzing ? 'Analyzing with AI...' : 'Analyze Report'}
          </button>
        )}
        
        {results && (
          <div className="analysis-result">
            <h3>Analysis Summary</h3>
            <p className="summary">{results.summary}</p>
            
            <div className="findings">
              {results.findings.map((finding, i) => (
                <div key={i} className={`finding-item ${finding.status}`}>
                  <div className="finding-header">
                    <span className="finding-name">{finding.name}</span>
                    <span className={`status-badge ${finding.status}`}>{finding.status}</span>
                  </div>
                  <div className="finding-values">
                    <span className="finding-value">{finding.value}</span>
                    <span className="finding-range">Normal: {finding.range}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        .tool-panel {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(10, 22, 40, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          padding: 0;
          width: 500px;
          max-width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          z-index: 1000;
          animation: panelIn 0.4s ease;
        }
        
        @keyframes panelIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        .panel-header {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 25px 25px 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .panel-icon {
          font-size: 2.5rem;
        }
        
        .panel-header h2 {
          color: #FAFBFC;
          font-size: 1.5rem;
          margin: 0;
        }
        
        .panel-content {
          padding: 20px 25px 25px;
        }
        
        .drop-zone {
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 40px 20px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .drop-zone.active {
          border-color: #0066CC;
          background: rgba(0, 102, 204, 0.1);
        }
        
        .drop-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 15px;
        }
        
        .drop-zone p {
          color: #FAFBFC;
          font-size: 1.1rem;
          margin-bottom: 8px;
        }
        
        .drop-formats {
          color: #78909C;
          font-size: 0.9rem;
        }
        
        .uploaded-file {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
          border-radius: 12px;
          padding: 15px;
          color: #4CAF50;
        }
        
        .change-btn {
          margin-left: auto;
          background: none;
          border: none;
          color: #20B2AA;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .analyze-btn {
          width: 100%;
          background: linear-gradient(135deg, #0066CC, #0052A3);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 15px;
          transition: all 0.3s ease;
        }
        
        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 102, 204, 0.4);
        }
        
        .analyze-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .analysis-result h3 {
          color: #FAFBFC;
          font-size: 1.1rem;
          margin-bottom: 10px;
        }
        
        .summary {
          color: #B0BEC5;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        
        .findings {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .finding-item {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 15px;
          border-left: 3px solid;
        }
        
        .finding-item.normal {
          border-left-color: #4CAF50;
        }
        
        .finding-item.warning {
          border-left-color: #FF9800;
        }
        
        .finding-item.high {
          border-left-color: #FF6B6B;
        }
        
        .finding-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .finding-name {
          color: #FAFBFC;
          font-weight: 600;
        }
        
        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .status-badge.normal {
          background: rgba(76, 175, 80, 0.2);
          color: #4CAF50;
        }
        
        .status-badge.warning {
          background: rgba(255, 152, 0, 0.2);
          color: #FF9800;
        }
        
        .status-badge.high {
          background: rgba(255, 107, 107, 0.2);
          color: #FF6B6B;
        }
        
        .finding-values {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }
        
        .finding-value {
          color: #FAFBFC;
        }
        
        .finding-range {
          color: #78909C;
        }
        
        .close-btn {
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
      `}</style>
    </div>
  )
}

// Vaccine Tracker Panel
function VaccineTrackerPanel({ onClose }) {
  const vaccines = [
    { name: 'COVID-19 Vaccine', date: '2023-05-15', dose: 'Booster', status: 'completed' },
    { name: 'Flu Shot', date: '2023-10-01', dose: 'Annual', status: 'completed' },
    { name: 'Tetanus', date: '2022-03-20', dose: 'Booster', status: 'completed' },
    { name: 'Hepatitis B', date: '2024-02-10', dose: 'Final', status: 'upcoming' },
  ]

  return (
    <div className="tool-panel vaccine-tracker">
      <button className="close-btn" onClick={onClose}>✕</button>
      <div className="panel-header">
        <span className="panel-icon">💉</span>
        <h2>Vaccination Tracker</h2>
      </div>
      
      <div className="panel-content">
        <div className="vaccine-list">
          {vaccines.map((vaccine, i) => (
            <div key={i} className={`vaccine-item ${vaccine.status}`}>
              <div className="vaccine-info">
                <span className="vaccine-name">{vaccine.name}</span>
                <span className="vaccine-dose">{vaccine.dose}</span>
                <span className="vaccine-date">{vaccine.date}</span>
              </div>
              <span className={`vaccine-status ${vaccine.status}`}>
                {vaccine.status === 'completed' ? '✓ Completed' : 'Upcoming'}
              </span>
            </div>
          ))}
        </div>
        
        <button className="add-btn">+ Add Vaccination Record</button>
      </div>
      
      <style>{`
        .tool-panel {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(10, 22, 40, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          padding: 0;
          width: 450px;
          max-width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          z-index: 1000;
        }
        
        .panel-header {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 25px 25px 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .panel-icon {
          font-size: 2.5rem;
        }
        
        .panel-header h2 {
          color: #FAFBFC;
          font-size: 1.5rem;
          margin: 0;
        }
        
        .panel-content {
          padding: 20px 25px 25px;
        }
        
        .vaccine-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .vaccine-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 15px;
          border-left: 3px solid #4CAF50;
        }
        
        .vaccine-item.upcoming {
          border-left-color: #FF9800;
        }
        
        .vaccine-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .vaccine-name {
          color: #FAFBFC;
          font-weight: 600;
        }
        
        .vaccine-dose {
          color: #B0BEC5;
          font-size: 0.85rem;
        }
        
        .vaccine-date {
          color: #78909C;
          font-size: 0.8rem;
        }
        
        .vaccine-status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .vaccine-status.completed {
          background: rgba(76, 175, 80, 0.2);
          color: #4CAF50;
        }
        
        .vaccine-status.upcoming {
          background: rgba(255, 152, 0, 0.2);
          color: #FF9800;
        }
        
        .add-btn {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px dashed rgba(255, 255, 255, 0.3);
          color: #FAFBFC;
          padding: 15px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .add-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: #0066CC;
        }
        
        .close-btn {
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
      `}</style>
    </div>
  )
}

// Medication Manager Panel
function MedicationManagerPanel({ onClose }) {
  const medications = [
    { name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Daily', time: 'Morning', refill: 15 },
    { name: 'Omega-3', dosage: '500mg', frequency: 'Daily', time: 'With food', refill: 8 },
    { name: 'Magnesium', dosage: '400mg', frequency: 'Daily', time: 'Evening', refill: 22 },
  ]

  return (
    <div className="tool-panel medication-manager">
      <button className="close-btn" onClick={onClose}>✕</button>
      <div className="panel-header">
        <span className="panel-icon">💊</span>
        <h2>Medication Manager</h2>
      </div>
      
      <div className="panel-content">
        <div className="medication-list">
          {medications.map((med, i) => (
            <div key={i} className="medication-item">
              <div className="med-icon">💊</div>
              <div className="med-info">
                <span className="med-name">{med.name}</span>
                <span className="med-details">{med.dosage} • {med.frequency} • {med.time}</span>
              </div>
              <div className="med-refill">
                <span className={`refill-indicator ${med.refill < 10 ? 'low' : ''}`}>
                  {med.refill} days left
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <button className="add-btn">+ Add Medication</button>
        
        <div className="interaction-check">
          <h4>Drug Interaction Check</h4>
          <p className="safe">✓ No interactions detected</p>
        </div>
      </div>
      
      <style>{`
        .tool-panel {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(10, 22, 40, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          padding: 0;
          width: 450px;
          max-width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          z-index: 1000;
        }
        
        .panel-header {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 25px 25px 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .panel-icon {
          font-size: 2.5rem;
        }
        
        .panel-header h2 {
          color: #FAFBFC;
          font-size: 1.5rem;
          margin: 0;
        }
        
        .panel-content {
          padding: 20px 25px 25px;
        }
        
        .medication-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .medication-item {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 15px;
        }
        
        .med-icon {
          font-size: 1.8rem;
        }
        
        .med-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .med-name {
          color: #FAFBFC;
          font-weight: 600;
        }
        
        .med-details {
          color: #B0BEC5;
          font-size: 0.85rem;
        }
        
        .refill-indicator {
          background: rgba(76, 175, 80, 0.2);
          color: #4CAF50;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .refill-indicator.low {
          background: rgba(255, 107, 107, 0.2);
          color: #FF6B6B;
        }
        
        .add-btn {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px dashed rgba(255, 255, 255, 0.3);
          color: #FAFBFC;
          padding: 15px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1rem;
          margin-bottom: 20px;
        }
        
        .interaction-check {
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
          border-radius: 12px;
          padding: 15px;
        }
        
        .interaction-check h4 {
          color: #FAFBFC;
          margin: 0 0 8px;
          font-size: 1rem;
        }
        
        .interaction-check .safe {
          color: #4CAF50;
          margin: 0;
        }
        
        .close-btn {
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
      `}</style>
    </div>
  )
}

// Main Scene
function MainScene({ onToolSelect, activeTool }) {
  return (
    <>
      <color attach="background" args={['#0a1628']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#0066CC" />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#20B2AA" />
      <pointLight position={[0, 5, 5]} intensity={0.3} color="#FFFFFF" />
      
      {/* Background */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
      <Sparkles count={100} scale={15} size={3} speed={0.4} opacity={0.4} color="#0066CC" />
      
      <BigDNAHelix />
      <MedicalCrosses />
      <FloatingParticles count={80} />
      
      {/* Interactive Tools */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <ModelDoctor 
          position={[-3, 0, 2]} 
          rotation={[0, 0.3, 0]} 
          scale={1.2}
          onClick={() => onToolSelect('doctor')}
          isActive={activeTool === 'doctor'}
        />
      </Float>
      
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
        <ModelStethoscope 
          position={[3, 0, 2]} 
          rotation={[0, -0.3, 0]} 
          scale={1.3}
          onClick={() => onToolSelect('stethoscope')}
          isActive={activeTool === 'stethoscope'}
        />
      </Float>
      
      <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.3}>
        <ModelSyringe 
          position={[-2, -2.5, 1.5]} 
          rotation={[0.2, 0.5, 0.1]} 
          scale={1}
          onClick={() => onToolSelect('syringe')}
          isActive={activeTool === 'syringe'}
        />
      </Float>
      
      <Float speed={1.1} rotationIntensity={0.1} floatIntensity={0.3}>
        <ModelPillBottle 
          position={[2, -2.5, 1.5]} 
          rotation={[0, -0.5, 0]} 
          scale={1}
          onClick={() => onToolSelect('pills')}
          isActive={activeTool === 'pills'}
        />
      </Float>
    </>
  )
}

// Main Dashboard Component
export default function InteractiveDashboard({ user, onLogout }) {
  const [activeTool, setActiveTool] = useState(null)

  const handleToolSelect = (tool) => {
    setActiveTool(tool)
  }

  const handleCloseTool = () => {
    setActiveTool(null)
  }

  return (
    <div className="interactive-dashboard">
      {/* 3D Background */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <MainScene 
              onToolSelect={handleToolSelect}
              activeTool={activeTool}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="ui-overlay">
        {/* Header */}
        <header className="dashboard-header">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <span className="logo-text">MedVision AI</span>
          </div>
          <div className="user-info">
            <span className="user-name">Welcome, {user.name}</span>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        </header>

        {/* Instructions */}
        <div className="instructions">
          <p>Click on any 3D model to open its tool</p>
        </div>

        {/* Tool Panels */}
        {activeTool === 'doctor' && <SymptomCheckerPanel onClose={handleCloseTool} />}
        {activeTool === 'stethoscope' && <ReportAnalyzerPanel onClose={handleCloseTool} />}
        {activeTool === 'syringe' && <VaccineTrackerPanel onClose={handleCloseTool} />}
        {activeTool === 'pills' && <MedicationManagerPanel onClose={handleCloseTool} />}
      </div>

      {/* CSS */}
      <style>{`
        .interactive-dashboard {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          position: relative;
          background: #0a1628;
        }

        .canvas-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .ui-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
          pointer-events: none;
        }

        .ui-overlay > * {
          pointer-events: auto;
        }

        .dashboard-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(to bottom, rgba(10, 22, 40, 0.95), transparent);
          z-index: 100;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 700;
          color: #FAFBFC;
        }

        .logo-icon {
          font-size: 2rem;
        }

        .logo-text {
          background: linear-gradient(135deg, #0066CC, #20B2AA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-name {
          color: #B0BEC5;
          font-size: 0.95rem;
        }

        .logout-btn {
          background: rgba(255, 107, 107, 0.2);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: #FF6B6B;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: rgba(255, 107, 107, 0.3);
        }

        .instructions {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 15px 30px;
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 50;
        }

        .instructions p {
          color: #FAFBFC;
          font-size: 0.95rem;
          margin: 0;
        }
      `}</style>
    </div>
  )
}

// Preload models
useGLTF.preload('/models/medical doctor 3d model.glb')
useGLTF.preload('/models/stethoscope 3d model.glb')
useGLTF.preload('/models/cartoon syringe 3d model.glb')
useGLTF.preload('/models/pill bottle 3d model.glb')
