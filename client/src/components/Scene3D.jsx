import React, { useRef, useMemo, useState, useEffect, Suspense, ErrorBoundary } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  Float, Text, MeshDistortMaterial, Environment, 
  useGLTF, OrbitControls, Stars, Sparkles,
  PerspectiveCamera, Html, Loader
} from '@react-three/drei'
import * as THREE from 'three'

// ============================================================================
// GLB Model Loader with Fallback
// ============================================================================

function GLBModel({ path, fallbackGeometry, position, rotation, scale, ...props }) {
  const groupRef = useRef()
  const [error, setError] = useState(null)
  const [loaded, setLoaded] = useState(false)
  
  // Try to load GLB model
  let gltf = null
  try {
    gltf = useGLTF(path, true)
    setLoaded(true)
  } catch (e) {
    setError(e)
  }
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y += 0.002
    }
  })
  
  if (error || !loaded) {
    // Return fallback geometry
    return (
      <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
        {fallbackGeometry}
      </group>
    )
  }
  
  return (
    <primitive 
      object={gltf.scene} 
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      {...props}
    />
  )
}

// ============================================================================
// Fallback 3D Models (when GLB fails to load)
// ============================================================================

function FallbackDoctor({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.4, 1, 8, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#E8C4A0" roughness={0.7} />
      </mesh>
      {/* Stethoscope */}
      <mesh position={[0, 0.5, 0.25]} rotation={[0, 0, Math.PI / 8]}>
        <torusGeometry args={[0.2, 0.03, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#2C2C2C" />
      </mesh>
      {/* Glow */}
      <pointLight position={[0, 1, 0.5]} intensity={0.5} color="#0066CC" />
    </group>
  )
}

function FallbackStethoscope({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Chest piece */}
      <mesh>
        <cylinderGeometry args={[0.25, 0.25, 0.12, 32]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Diaphragm */}
      <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial color="#D4D4D4" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Tubing */}
      <mesh position={[0, -0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.3, 0.05, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#2C2C2C" roughness={0.8} />
      </mesh>
    </group>
  )
}

function FallbackSyringe({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale} rotation={[0, 0, Math.PI / 2]}>
      {/* Body */}
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 1, 16]} />
        <meshStandardMaterial color="#FAFBFC" transparent opacity={0.8} roughness={0.1} />
      </mesh>
      {/* Liquid */}
      <mesh position={[0, 0, 0.02]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
        <meshStandardMaterial color="#0066CC" transparent opacity={0.6} />
      </mesh>
      {/* Needle */}
      <mesh position={[-0.7, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Plunger */}
      <mesh position={[0.6, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
        <meshStandardMaterial color="#FAFBFC" />
      </mesh>
    </group>
  )
}

function FallbackPillBottle({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Bottle */}
      <mesh>
        <cylinderGeometry args={[0.18, 0.18, 0.5, 16]} />
        <meshStandardMaterial color="#FFB347" transparent opacity={0.7} roughness={0.3} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#FAFBFC" roughness={0.5} />
      </mesh>
      {/* Label */}
      <mesh position={[0, 0, 0.19]}>
        <planeGeometry args={[0.3, 0.35]} />
        <meshStandardMaterial color="#FAFBFC" />
      </mesh>
      {/* Medical cross */}
      <mesh position={[0.08, 0, 0.2]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[0.05, 0.01]} />
        <meshStandardMaterial color="#0066CC" />
      </mesh>
      <mesh position={[0.08, 0, 0.2]}>
        <planeGeometry args={[0.01, 0.05]} />
        <meshStandardMaterial color="#0066CC" />
      </mesh>
    </group>
  )
}

function FallbackDashboard({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Main screen */}
      <mesh>
        <boxGeometry args={[2, 1.2, 0.1]} />
        <meshStandardMaterial color="#1a2a4a" roughness={0.3} />
      </mesh>
      {/* Screen content */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.8, 1]} />
        <meshStandardMaterial color="#0a1628" />
      </mesh>
      {/* Chart bars */}
      <mesh position={[-0.5, 0.1, 0.07]}>
        <boxGeometry args={[0.15, 0.3, 0.02]} />
        <meshStandardMaterial color="#0066CC" />
      </mesh>
      <mesh position={[-0.2, 0.2, 0.07]}>
        <boxGeometry args={[0.15, 0.5, 0.02]} />
        <meshStandardMaterial color="#20B2AA" />
      </mesh>
      <mesh position={[0.1, 0.05, 0.07]}>
        <boxGeometry args={[0.15, 0.2, 0.02]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
      {/* Heart icon */}
      <mesh position={[0.5, -0.2, 0.07]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial color="#FF6B6B" />
      </mesh>
    </group>
  )
}

// ============================================================================
// DNA Helix Animation
// ============================================================================

function DNAHelix({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i < 40; i++) {
      const t = i / 40 * Math.PI * 4
      pts.push({
        pos1: new THREE.Vector3(Math.cos(t) * 0.5, (i / 40 - 0.5) * 6, Math.sin(t) * 0.5),
        pos2: new THREE.Vector3(Math.cos(t + Math.PI) * 0.5, (i / 40 - 0.5) * 6, Math.sin(t + Math.PI) * 0.5)
      })
    }
    return pts
  }, [])
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      {points.map((pt, i) => (
        <React.Fragment key={i}>
          <mesh position={pt.pos1}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#0066CC" emissive="#0066CC" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={pt.pos2}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#20B2AA" emissive="#20B2AA" emissiveIntensity={0.5} />
          </mesh>
          {/* Connection */}
          <mesh 
            position={[(pt.pos1.x + pt.pos2.x) / 2, pt.pos1.y, (pt.pos1.z + pt.pos2.z) / 2]}
            rotation={[0, (i * 0.1) + Math.PI / 2, 0]}
          >
            <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
            <meshStandardMaterial color="#FFFFFF" transparent opacity={0.3} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  )
}

// ============================================================================
// Heartbeat/EKG Line
// ============================================================================

function HeartbeatLine({ position = [0, 0, 0], color = "#4CAF50" }) {
  const lineRef = useRef()
  const points = useRef([])
  
  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.elapsedTime
      points.current = []
      for (let i = 0; i < 60; i++) {
        const x = (i / 60) * 20 - 10
        let y = Math.sin(i * 0.2 + time) * 0.1
        // Heartbeat spike
        if (i > 20 && i < 30) {
          y += Math.sin((i - 20) * Math.PI / 10) * 0.6 * Math.sin(time * 3)
        }
        points.current.push([x, y, 0])
      }
      lineRef.current.geometry.setFromPoints(points.current.map(p => new THREE.Vector3(...p)))
    }
  })
  
  return (
    <group position={position}>
      <line ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color={color} linewidth={2} />
      </line>
      {/* Glow */}
      <line ref={(el) => {
        if (el && lineRef.current) {
          el.geometry.copy(lineRef.current.geometry)
        }
      }}>
        <bufferGeometry />
        <lineBasicMaterial color={color} linewidth={1} transparent opacity={0.3} />
      </line>
    </group>
  )
}

// ============================================================================
// Medical Cross
// ============================================================================

function MedicalCross({ position = [0, 0, 0], scale = 1, color = "#0066CC" }) {
  const groupRef = useRef()
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })
  
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Vertical bar */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.15, 0.8, 0.1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
        {/* Horizontal bar */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.8, 0.15, 0.1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
        {/* Glow ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
      </group>
    </Float>
  )
}

// ============================================================================
// Particle System
// ============================================================================

function ParticleSystem({ count = 50 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5
      ],
      size: Math.random() * 0.05 + 0.02,
      speed: Math.random() * 0.5 + 0.2
    }))
  }, [count])
  
  return (
    <group>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial 
            color="#FAFBFC" 
            emissive="#0066CC"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

// ============================================================================
// Ambient Molecules
// ============================================================================

function Molecule({ position = [0, 0, 0], color = "#0066CC", scale = 1 }) {
  const groupRef = useRef()
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.3
      groupRef.current.rotation.y += delta * 0.4
    }
  })
  
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Center atom */}
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
        {/* Orbiting atoms */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[
            Math.cos(i * Math.PI * 2 / 3) * 0.3,
            Math.sin(i * Math.PI * 2 / 3) * 0.3,
            0
          ]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// ============================================================================
// Pill Capsule
// ============================================================================

function PillCapsule({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.5
      groupRef.current.rotation.z += delta * 0.3
    }
  })
  
  return (
    <Float speed={1} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
        {/* Top half */}
        <mesh position={[0, 0.25, 0]}>
          <capsuleGeometry args={[0.15, 0.4, 8, 16]} />
          <meshStandardMaterial color="#FAFBFC" emissive="#FAFBFC" emissiveIntensity={0.1} />
        </mesh>
        {/* Bottom half */}
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.15, 0.4, 8, 16]} />
          <meshStandardMaterial color="#0066CC" emissive="#0066CC" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </Float>
  )
}

// ============================================================================
// Main 3D Scene Component
// ============================================================================

function SceneContent() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#0066CC" />
      <pointLight position={[-10, 5, 10]} intensity={0.5} color="#20B2AA" />
      <pointLight position={[0, -5, 5]} intensity={0.3} color="#FAFBFC" />
      
      {/* Background Elements */}
      <DNAHelix position={[-6, 0, -10]} scale={1.2} />
      <DNAHelix position={[7, 5, -15]} scale={0.8} />
      
      <HeartbeatLine position={[0, 6, -8]} />
      <HeartbeatLine position={[0, -8, -10]} color="#0066CC" />
      
      <MedicalCross position={[-5, -4, -8]} scale={1} color="#0066CC" />
      <MedicalCross position={[5, -12, -10]} scale={0.8} color="#FF6B6B" />
      <MedicalCross position={[-4, -18, -12]} scale={1.2} color="#20B2AA" />
      
      <Molecule position={[-7, -6, -10]} color="#20B2AA" scale={1.5} />
      <Molecule position={[6, -16, -12]} color="#0066CC" scale={1.2} />
      <Molecule position={[-5, -24, -15]} color="#FF6B6B" scale={1.8} />
      
      <PillCapsule position={[7, -8, -8]} rotation={[0.2, 0.3, 0]} scale={1.2} />
      <PillCapsule position={[-6, -14, -10]} rotation={[0.3, 0.5, 0.2]} scale={1} color1="#20B2AA" />
      
      {/* Particles */}
      <ParticleSystem count={80} />
      <Sparkles count={50} scale={20} size={2} speed={0.3} color="#0066CC" />
      
      {/* Stars */}
      <Stars radius={100} depth={50} count={200} factor={4} saturation={0} fade speed={1} />
      
      {/* GLB Models with Fallbacks */}
      {/* Doctor Model */}
      <GLBModel 
        path="/models/medical doctor 3d model.glb"
        fallbackGeometry={<FallbackDoctor position={[0, -1, 0]} scale={0.8} />}
        position={[0, -1, 0]}
        scale={0.8}
      />
      
      {/* Stethoscope Model */}
      <GLBModel 
        path="/models/stethoscope 3d model.glb"
        fallbackGeometry={<FallbackStethoscope position={[-3, 0, 0]} scale={1.2} />}
        position={[-3, 0, 0]}
        scale={1.2}
      />
      
      {/* Syringe Model */}
      <GLBModel 
        path="/models/cartoon syringe 3d model.glb"
        fallbackGeometry={<FallbackSyringe position={[3, 0, 0]} scale={1} />}
        position={[3, 0, 0]}
        scale={1}
      />
      
      {/* Pill Bottle Model */}
      <GLBModel 
        path="/models/pill bottle 3d model.glb"
        fallbackGeometry={<FallbackPillBottle position={[5, -1, 0]} scale={1.3} />}
        position={[5, -1, 0]}
        scale={1.3}
      />
      
      {/* Dashboard Model */}
      <GLBModel 
        path="/models/dashboard.glb"
        fallbackGeometry={<FallbackDashboard position={[0, -3, -2]} scale={0.6} />}
        position={[0, -3, -2]}
        scale={0.6}
      />
      
      {/* Ground Reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#0a1628"
          transparent
          opacity={0.5}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#0a1628', 5, 30]} />
    </>
  )
}

// ============================================================================
// WebGL Error Fallback
// ============================================================================

function WebGLFallback() {
  return (
    <Html center>
      <div style={{
        textAlign: 'center',
        color: '#FAFBFC',
        padding: '20px',
        background: 'rgba(10, 22, 40, 0.9)',
        borderRadius: '12px',
        border: '1px solid rgba(0, 102, 204, 0.3)'
      }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>3D Environment Loading...</p>
        <p style={{ fontSize: '0.9rem', color: '#B0BEC5' }}>WebGL is being initialized</p>
      </div>
    </Html>
  )
}

// ============================================================================
// Scene3D Main Component
// ============================================================================

export default function Scene3D({ children }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <ErrorBoundary fallback={<WebGLFallback />}>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false
          }}
          onCreated={({ gl }) => {
            gl.setClearColor('#0a1628', 1)
          }}
        >
          <Suspense fallback={<WebGLFallback />}>
            <SceneContent />
          </Suspense>
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
            rotateSpeed={0.5}
          />
        </Canvas>
      </ErrorBoundary>
      
      {/* Loading overlay handled by drei's Loader */}
      <Loader 
        containerStyles={{ background: '#0a1628' }}
        innerStyles={{ 
          background: 'rgba(0, 102, 204, 0.2)',
          border: '1px solid rgba(0, 102, 204, 0.3)',
          borderRadius: '8px'
        }}
        barStyles={{ 
          background: 'linear-gradient(90deg, #0066CC, #20B2AA)',
          borderRadius: '6px'
        }}
        dataStyles={{ 
          color: '#FAFBFC',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif'
        }}
      />
    </div>
  )
}

// Preload models for faster loading
useGLTF.preload('/models/medical doctor 3d model.glb')
useGLTF.preload('/models/stethoscope 3d model.glb')
useGLTF.preload('/models/cartoon syringe 3d model.glb')
useGLTF.preload('/models/pill bottle 3d model.glb')
useGLTF.preload('/models/dashboard.glb')
