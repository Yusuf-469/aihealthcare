import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, useGLTF, Sparkles, Stars, MeshDistortMaterial, Html } from '@react-three/drei'
import * as THREE from 'three'
import Dashboard from './Dashboard'

// GLB Model Components
function ModelDoctor({ position, rotation, scale, onClick, isHovered }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/medical doctor 3d model.glb', true)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
      const targetScale = isHovered ? scale * 1.1 : scale
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })
  
  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} onClick={onClick}>
      <primitive object={scene} />
    </group>
  )
}

function ModelStethoscope({ position, rotation, scale, onClick, isHovered }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/stethoscope 3d model.glb', true)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
      const targetScale = isHovered ? scale * 1.15 : scale
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })
  
  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} onClick={onClick}>
      <primitive object={scene} />
    </group>
  )
}

function ModelSyringe({ position, rotation, scale, onClick, isHovered }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/cartoon syringe 3d model.glb', true)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      const targetScale = isHovered ? scale * 1.15 : scale
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })
  
  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} onClick={onClick}>
      <primitive object={scene} />
    </group>
  )
}

function ModelPillBottle({ position, rotation, scale, onClick, isHovered }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/pill bottle 3d model.glb', true)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.015
      const targetScale = isHovered ? scale * 1.15 : scale
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })
  
  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} onClick={onClick}>
      <primitive object={scene} />
    </group>
  )
}

function ModelDashboard({ position, rotation, scale }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/dashboard.glb', true)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })
  
  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
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
    <group ref={groupRef} position={[-8, 0, -5]} scale={1.5}>
      {strands.map((strand, i) => (
        <group key={i}>
          <mesh position={[Math.cos(strand.angle) * 0.6, strand.y, Math.sin(strand.angle) * 0.6]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#0066CC" emissive="#0066CC" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[Math.cos(strand.angle + Math.PI) * 0.6, strand.y, Math.sin(strand.angle + Math.PI) * 0.6]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#20B2AA" emissive="#20B2AA" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Floating Particles
function FloatingParticles({ count = 200 }) {
  const particles = React.useMemo(() => {
    return new Array(count).fill().map(() => ({
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 30,
      z: (Math.random() - 0.5) * 30,
      size: Math.random() * 0.08 + 0.02,
      speed: Math.random() * 0.02 + 0.01
    }))
  }, [count])

  return (
    <group>
      {particles.map((particle, i) => (
        <FloatingParticle key={i} {...particle} />
      ))}
    </group>
  )
}

function FloatingParticle({ x, y, z, size, speed }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed + x) * 0.002
      meshRef.current.rotation.x += speed * 0.5
    }
  })
  
  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial 
        color="#0066CC" 
        transparent 
        opacity={0.6} 
        emissive="#0066CC" 
        emissiveIntensity={0.5} 
      />
    </mesh>
  )
}

// Medical Crosses
function MedicalCrosses() {
  const crosses = React.useMemo(() => [
    { pos: [5, 3, -3], rot: [0, 0, 0.02] },
    { pos: [-6, -2, -4], rot: [0, 0, -0.02] },
    { pos: [7, -3, -2], rot: [0, 0, 0.01] },
    { pos: [-4, 4, -5], rot: [0, 0, -0.01] },
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
        <boxGeometry args={[0.3, 1, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.25} />
      </mesh>
      <mesh>
        <boxGeometry args={[1, 0.3, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.25} />
      </mesh>
    </group>
  )
}

// Main Scene
function MainScene({ onToolSelect, selectedTool }) {
  const [hovered, setHovered] = useState(null)

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
      <FloatingParticles count={100} />
      
      {/* Interactive Tools */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <ModelDoctor 
          position={[-3, 0, 2]} 
          rotation={[0, 0.3, 0]} 
          scale={1.2}
          onClick={() => onToolSelect('doctor')}
          isHovered={hovered === 'doctor'}
        />
      </Float>
      
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
        <ModelStethoscope 
          position={[3, 0, 2]} 
          rotation={[0, -0.3, 0]} 
          scale={1.3}
          onClick={() => onToolSelect('stethoscope')}
          isHovered={hovered === 'stethoscope'}
        />
      </Float>
      
      <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.3}>
        <ModelSyringe 
          position={[-2, -2.5, 1.5]} 
          rotation={[0.2, 0.5, 0.1]} 
          scale={1}
          onClick={() => onToolSelect('syringe')}
          isHovered={hovered === 'syringe'}
        />
      </Float>
      
      <Float speed={1.1} rotationIntensity={0.1} floatIntensity={0.3}>
        <ModelPillBottle 
          position={[2, -2.5, 1.5]} 
          rotation={[0, -0.5, 0]} 
          scale={1}
          onClick={() => onToolSelect('pills')}
          isHovered={hovered === 'pills'}
        />
      </Float>
    </>
  )
}

// Tool Info Panel
function ToolInfo({ tool, onClose }) {
  if (!tool) return null

  const toolInfo = {
    doctor: {
      title: 'AI Symptom Checker',
      description: 'Describe your symptoms and get AI-powered analysis',
      icon: '🩺',
      features: ['Symptom Analysis', 'Health Guidance', '24/7 Available']
    },
    stethoscope: {
      title: 'Medical Report Analyzer',
      description: 'Upload and analyze your medical reports with AI vision',
      icon: '📊',
      features: ['PDF/Image Upload', 'OCR Processing', 'Anomaly Detection']
    },
    syringe: {
      title: 'Vaccination Tracker',
      description: 'Keep track of your vaccines and set reminders',
      icon: '💉',
      features: ['Vaccine History', 'Smart Reminders', 'Export Records']
    },
    pills: {
      title: 'Medication Records',
      description: 'Manage your medications and check interactions',
      icon: '💊',
      features: ['Drug Interaction Check', 'Dosage Tracking', 'Refill Reminders']
    }
  }

  const info = toolInfo[tool]

  return (
    <div className="tool-info-panel">
      <button className="close-btn" onClick={onClose}>✕</button>
      <div className="tool-icon">{info.icon}</div>
      <h2>{info.title}</h2>
      <p>{info.description}</p>
      <ul className="tool-features">
        {info.features.map((feature, i) => (
          <li key={i}>✓ {feature}</li>
        ))}
      </ul>
      <button className="open-tool-btn">Open Tool</button>
    </div>
  )
}

// Main Landing Page Component
export default function InteractiveLanding() {
  const [user, setUser] = useState(null)
  const [selectedTool, setSelectedTool] = useState(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('medvision_user')
    if (saved) {
      setUser(JSON.parse(saved))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('medvision_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('medvision_user')
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />
  }

  return (
    <div className="interactive-landing">
      {/* 3D Background */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <MainScene 
              onToolSelect={setSelectedTool} 
              selectedTool={selectedTool} 
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="ui-overlay">
        {/* Header */}
        <header className="landing-header">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <span className="logo-text">MedVision AI</span>
          </div>
          <nav className="nav-links">
            <button className="get-started-btn" onClick={() => setSelectedTool('demo')}>
              Get Started
            </button>
          </nav>
        </header>

        {/* Hero Content */}
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Your AI Healthcare</span>
            <br />
            Companion
          </h1>
          <p className="hero-subtitle">
            Experience the future of healthcare with our immersive 3D platform
          </p>
          <p className="hero-description">
            Interact with our 3D tools to explore AI-powered health features
          </p>
        </div>

        {/* Tool Labels */}
        <div className="tool-labels">
          <div className="tool-label" style={{ left: '15%', bottom: '30%' }}>
            <span>AI Symptom Checker</span>
          </div>
          <div className="tool-label" style={{ right: '15%', bottom: '30%' }}>
            <span>Report Analyzer</span>
          </div>
          <div className="tool-label" style={{ left: '20%', bottom: '15%' }}>
            <span>Vaccine Tracker</span>
          </div>
          <div className="tool-label" style={{ right: '20%', bottom: '15%' }}>
            <span>Medication Manager</span>
          </div>
        </div>

        {/* Tool Info Panel */}
        <ToolInfo 
          tool={selectedTool} 
          onClose={() => setSelectedTool(null)} 
        />

        {/* Auth Modal */}
        {selectedTool === 'demo' && (
          <AuthModal onLogin={handleLogin} onClose={() => setSelectedTool(null)} />
        )}
      </div>

      {/* CSS Styles */}
      <style>{`
        .interactive-landing {
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

        .landing-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(to bottom, rgba(10, 22, 40, 0.9), transparent);
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

        .nav-links {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .get-started-btn {
          background: linear-gradient(135deg, #0066CC, #0052A3);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 102, 204, 0.4);
        }

        .get-started-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(0, 102, 204, 0.6);
        }

        .hero-content {
          position: absolute;
          top: 25%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          max-width: 800px;
          padding: 0 20px;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #FAFBFC;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .gradient-text {
          background: linear-gradient(135deg, #0066CC, #20B2AA, #4CAF50);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          color: #B0BEC5;
          margin-bottom: 15px;
        }

        .hero-description {
          font-size: 1.1rem;
          color: #78909C;
          max-width: 600px;
          margin: 0 auto;
        }

        .tool-labels {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          pointer-events: none;
        }

        .tool-label {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 10px 20px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FAFBFC;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .tool-info-panel {
          position: fixed;
          top: 50%;
          right: 40px;
          transform: translateY(-50%);
          background: rgba(10, 22, 40, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 30px;
          width: 350px;
          z-index: 100;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }

        .tool-info-panel .close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #FAFBFC;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
        }

        .tool-info-panel .tool-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .tool-info-panel h2 {
          color: #FAFBFC;
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .tool-info-panel p {
          color: #B0BEC5;
          margin-bottom: 20px;
        }

        .tool-features {
          list-style: none;
          margin-bottom: 25px;
        }

        .tool-features li {
          color: #20B2AA;
          padding: 8px 0;
          font-size: 0.95rem;
        }

        .open-tool-btn {
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

        .open-tool-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 102, 204, 0.4);
        }

        .auth-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(10, 22, 40, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
        }

        .auth-form {
          background: rgba(10, 22, 40, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 40px;
          width: 400px;
          max-width: 90%;
        }

        .auth-form h2 {
          color: #FAFBFC;
          text-align: center;
          margin-bottom: 10px;
        }

        .auth-form p {
          color: #B0BEC5;
          text-align: center;
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 20px;
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

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #0066CC, #0052A3);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
        }

        .demo-link {
          display: block;
          text-align: center;
          color: #20B2AA;
          margin-top: 20px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .demo-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

// Auth Modal Component
function AuthModal({ onLogin, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      onLogin({ email: email || 'Demo User', name: 'Demo User' })
    }, 1000)
  }

  const handleDemoLogin = () => {
    setLoading(true)
    setTimeout(() => {
      onLogin({ email: 'demo@medvision.ai', name: 'Demo User' })
    }, 1000)
  }

  return (
    <div className="auth-modal" onClick={onClose}>
      <div className="auth-form" onClick={(e) => e.stopPropagation()}>
        <h2>Welcome to MedVision AI</h2>
        <p>Sign in to access your health dashboard</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : 'Sign In'}
          </button>
        </form>
        
        <span className="demo-link" onClick={handleDemoLogin}>
          Try Demo Account (demo@medvision.ai)
        </span>
      </div>
    </div>
  )
}

// Preload models
useGLTF.preload('/models/medical doctor 3d model.glb')
useGLTF.preload('/models/stethoscope 3d model.glb')
useGLTF.preload('/models/cartoon syringe 3d model.glb')
useGLTF.preload('/models/pill bottle 3d model.glb')
useGLTF.preload('/models/dashboard.glb')
