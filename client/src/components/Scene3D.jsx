import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  Float, MeshDistortMaterial, Stars, Sparkles,
  PerspectiveCamera, Html, useGLTF
} from '@react-three/drei'
import * as THREE from 'three'

// ============================================================================
// GLB Model Loader Component
// ============================================================================

function ModelDoctor({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/medical doctor 3d model.glb', true)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

function ModelStethoscope({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/stethoscope 3d model.glb', true)
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
    }
  })
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

function ModelSyringe({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/cartoon syringe 3d model.glb', true)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

function ModelPillBottle({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/pill bottle 3d model.glb', true)
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.015
    }
  })
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

function ModelDashboard({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/dashboard.glb', true)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

// ============================================================================
// Fallback 3D Models (when GLB fails to load)
// ============================================================================

function FallbackDoctor({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.4, 1, 8, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#E8C4A0" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.5, 0.25]} rotation={[0, 0, Math.PI / 8]}>
        <torusGeometry args={[0.2, 0.03, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#2C2C2C" />
      </mesh>
      <pointLight position={[0, 1, 0.5]} intensity={0.5} color="#0066CC" />
    </group>
  )
}

function FallbackStethoscope({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <cylinderGeometry args={[0.25, 0.25, 0.12, 32]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial color="#D4D4D4" metalness={0.6} roughness={0.3} />
      </mesh>
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
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 1, 16]} />
        <meshStandardMaterial color="#FAFBFC" transparent opacity={0.8} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
        <meshStandardMaterial color="#0066CC" transparent opacity={0.6} />
      </mesh>
      <mesh position={[-0.7, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
      </mesh>
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
      <mesh>
        <cylinderGeometry args={[0.18, 0.18, 0.5, 16]} />
        <meshStandardMaterial color="#FFB347" transparent opacity={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#FAFBFC" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.19]}>
        <planeGeometry args={[0.3, 0.35]} />
        <meshStandardMaterial color="#FAFBFC" />
      </mesh>
    </group>
  )
}

function FallbackDashboard({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <boxGeometry args={[2, 1.2, 0.1]} />
        <meshStandardMaterial color="#1a2a4a" />
      </mesh>
      <mesh position={[0, 0.2, 0.06]}>
        <planeGeometry args={[1.6, 0.6]} />
        <meshStandardMaterial color="#0a1628" />
      </mesh>
      <mesh position={[-0.5, 0.3, 0.07]}>
        <boxGeometry args={[0.3, 0.08, 0.01]} />
        <meshStandardMaterial color="#4CAF50" emissive="#4CAF50" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.3, 0.07]}>
        <boxGeometry args={[0.3, 0.08, 0.01]} />
        <meshStandardMaterial color="#20B2AA" emissive="#20B2AA" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.5, 0.3, 0.07]}>
        <boxGeometry args={[0.3, 0.08, 0.01]} />
        <meshStandardMaterial color="#0066CC" emissive="#0066CC" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.3, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.5} />
      </mesh>
    </group>
  )
}

// ============================================================================
// Error Boundary Component
// ============================================================================

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <group>
      <Html center>
        <div style={{ color: '#FF6B6B', textAlign: 'center' }}>
          <p>Error loading 3D model</p>
          <p style={{ fontSize: '12px' }}>{error.message}</p>
        </div>
      </Html>
    </group>
  )
}

// ============================================================================
// Model Wrapper with Error Handling
// ============================================================================

function ModelWrapper({ primary: Primary, fallback: Fallback, ...props }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Fallback {...props} />}>
        <Primary {...props} />
      </Suspense>
    </ErrorBoundary>
  )
}

// ============================================================================
// DNA Helix Component
// ============================================================================

function DNAHelix({ position = [3, 0, -3] }) {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  const strands = useMemo(() => {
    const temp = []
    for (let i = 0; i < 20; i++) {
      const y = (i - 10) * 0.3
      const angle = i * 0.5
      temp.push({ y, angle })
    }
    return temp
  }, [])

  return (
    <group ref={groupRef} position={position} scale={0.5}>
      {strands.map((strand, i) => (
        <group key={i}>
          <mesh position={[Math.cos(strand.angle) * 0.5, strand.y, Math.sin(strand.angle) * 0.5]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#0066CC" emissive="#0066CC" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[Math.cos(strand.angle + Math.PI) * 0.5, strand.y, Math.sin(strand.angle + Math.PI) * 0.5]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#20B2AA" emissive="#20B2AA" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ============================================================================
// Heart Component
// ============================================================================

function BeatingHeart({ position = [0, 0, 0] }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      meshRef.current.scale.setScalar(scale)
      meshRef.current.rotation.y += 0.005
    }
  })
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef} position={position}>
        <mesh position={[-0.5, 0.3, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#FF4444" emissive="#FF0000" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.5, 0.3, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#FF4444" emissive="#FF0000" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.6, 1.2, 32]} />
          <meshStandardMaterial color="#FF4444" emissive="#FF0000" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  )
}

// ============================================================================
// Medical Cross Component
// ============================================================================

function MedicalCross({ position = [0, 0, 0] }) {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.002
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <boxGeometry args={[0.4, 1.2, 0.1]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.3} />
      </mesh>
      <mesh>
        <boxGeometry args={[1.2, 0.4, 0.1]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

// ============================================================================
// Particle System
// ============================================================================

function ParticleSystem({ count = 100 }) {
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 20
      const size = Math.random() * 0.05 + 0.02
      temp.push({ x, y, z, size })
    }
    return temp
  }, [count])

  return (
    <group>
      {particles.map((particle, i) => (
        <mesh key={i} position={[particle.x, particle.y, particle.z]}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial 
            color="#0066CC" 
            transparent 
            opacity={0.6} 
            emissive="#0066CC" 
            emissiveIntensity={0.3} 
          />
        </mesh>
      ))}
    </group>
  )
}

// ============================================================================
// Main Scene3D Component
// ============================================================================

export default function Scene3D({ section = 0 }) {
  return (
    <Canvas
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#0a1628']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#0066CC" />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#20B2AA" />
      <pointLight position={[0, 5, 5]} intensity={0.3} />
      
      {/* Stars Background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} color="#0066CC" />
      
      {/* Background Elements */}
      <DNAHelix position={[3, 0, -3]} />
      <DNAHelix position={[-3, 2, -5]} rotation={[0, Math.PI, 0]} />
      <MedicalCross position={[-3, 2, -2]} />
      <MedicalCross position={[3, -2, -2]} />
      <ParticleSystem count={50} />
      
      {/* Section-specific Content */}
      {section === 0 && (
        <>
          <BeatingHeart position={[0, 0, 0]} />
          <ModelWrapper 
            primary={ModelDoctor} 
            fallback={FallbackDoctor} 
            position={[-2, -0.5, 1]} 
            scale={1.5} 
          />
        </>
      )}
      
      {section === 1 && (
        <ModelWrapper 
          primary={ModelDoctor} 
          fallback={FallbackDoctor} 
          position={[0, 0, 0]} 
          scale={1.5} 
        />
      )}
      
      {section === 2 && (
        <ModelWrapper 
          primary={ModelStethoscope} 
          fallback={FallbackStethoscope} 
          position={[0, 0, 0]} 
          scale={1.5} 
        />
      )}
      
      {section === 3 && (
        <>
          <ModelWrapper 
            primary={ModelDoctor} 
            fallback={FallbackDoctor} 
            position={[-2, 0, 0]} 
            scale={1.5} 
          />
          <ModelWrapper 
            primary={ModelStethoscope} 
            fallback={FallbackStethoscope} 
            position={[2, 0, 0]} 
            scale={1.5} 
          />
        </>
      )}
      
      {section === 4 && (
        <>
          <ModelWrapper 
            primary={ModelSyringe} 
            fallback={FallbackSyringe} 
            position={[-2, 0, 0]} 
            scale={1.5} 
          />
          <ModelWrapper 
            primary={ModelPillBottle} 
            fallback={FallbackPillBottle} 
            position={[2, 0, 0]} 
            scale={1.5} 
          />
        </>
      )}
      
      {section === 5 && (
        <ModelWrapper 
          primary={ModelDashboard} 
          fallback={FallbackDashboard} 
          position={[0, 0, 0]} 
          scale={1.5} 
        />
      )}
      
      {section >= 6 && (
        <>
          <ModelWrapper 
            primary={ModelDoctor} 
            fallback={FallbackDoctor} 
            position={[-3, 0, -2]} 
            scale={1.2} 
          />
          <ModelWrapper 
            primary={ModelStethoscope} 
            fallback={FallbackStethoscope} 
            position={[3, 0, -2]} 
            scale={1.2} 
          />
          <ModelWrapper 
            primary={ModelSyringe} 
            fallback={FallbackSyringe} 
            position={[-5, 2, -4]} 
            scale={1} 
          />
          <ModelWrapper 
            primary={ModelPillBottle} 
            fallback={FallbackPillBottle} 
            position={[5, 2, -4]} 
            scale={1} 
          />
        </>
      )}
    </Canvas>
  )
}

// ============================================================================
// Preload GLB Models
// ============================================================================

useGLTF.preload('/models/medical doctor 3d model.glb')
useGLTF.preload('/models/stethoscope 3d model.glb')
useGLTF.preload('/models/cartoon syringe 3d model.glb')
useGLTF.preload('/models/pill bottle 3d model.glb')
useGLTF.preload('/models/dashboard.glb')
