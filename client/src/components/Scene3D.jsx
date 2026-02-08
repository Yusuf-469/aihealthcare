import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  Float, Stars, Sparkles, 
  PerspectiveCamera, useGLTF, OrbitControls
} from '@react-three/drei'
import * as THREE from 'three'

// ============================================================================
// GLB Model Loader - Simple and Clean
// ============================================================================

function ModelDoctor({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  
  try {
    const { scene } = useGLTF('/models/medical doctor 3d model.glb')
    
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
  } catch (e) {
    return null
  }
}

function ModelStethoscope({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  
  try {
    const { scene } = useGLTF('/models/stethoscope 3d model.glb')
    
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
  } catch (e) {
    return null
  }
}

function ModelSyringe({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  
  try {
    const { scene } = useGLTF('/models/cartoon syringe 3d model.glb')
    
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
  } catch (e) {
    return null
  }
}

function ModelPillBottle({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  
  try {
    const { scene } = useGLTF('/models/pill bottle 3d model.glb')
    
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
  } catch (e) {
    return null
  }
}

function ModelDashboard({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  
  try {
    const { scene } = useGLTF('/models/dashboard.glb')
    
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
  } catch (e) {
    return null
  }
}

// ============================================================================
// Animated Background Elements
// ============================================================================

function DNAHelix() {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  const points = []
  for (let i = 0; i < 40; i++) {
    const t = i / 40 * Math.PI * 4
    points.push({
      pos1: new THREE.Vector3(Math.cos(t) * 0.5, (i / 40 - 0.5) * 6, Math.sin(t) * 0.5),
      pos2: new THREE.Vector3(Math.cos(t + Math.PI) * 0.5, (i / 40 - 0.5) * 6, Math.sin(t + Math.PI) * 0.5)
    })
  }
  
  return (
    <group ref={groupRef} position={[-6, 0, -10]}>
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
        </React.Fragment>
      ))}
    </group>
  )
}

function HeartbeatLine() {
  const lineRef = useRef()
  const points = []
  
  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.elapsedTime
      points.length = 0
      for (let i = 0; i < 60; i++) {
        const x = (i / 60) * 20 - 10
        let y = Math.sin(i * 0.2 + time) * 0.1
        if (i > 20 && i < 30) {
          y += Math.sin((i - 20) * Math.PI / 10) * 0.6 * Math.sin(time * 3)
        }
        points.push(new THREE.Vector3(x, y, 0))
      }
      lineRef.current.geometry.setFromPoints(points)
    }
  })
  
  return (
    <group position={[0, 6, -8]}>
      <line ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#4CAF50" linewidth={2} />
      </line>
    </group>
  )
}

function MedicalCross({ position }) {
  const groupRef = useRef()
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })
  
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={position}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.15, 0.8, 0.1]} />
          <meshStandardMaterial color="#0066CC" emissive="#0066CC" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.8, 0.15, 0.1]} />
          <meshStandardMaterial color="#0066CC" emissive="#0066CC" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  )
}

function Particles() {
  const particles = []
  for (let i = 0; i < 50; i++) {
    particles.push({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5
      ],
      size: Math.random() * 0.05 + 0.02
    })
  }
  
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
// Main 3D Scene
// ============================================================================

function SceneContent() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#0066CC" />
      <pointLight position={[-10, 5, 10]} intensity={0.5} color="#20B2AA" />
      <pointLight position={[0, -5, 5]} intensity={0.3} color="#FAFBFC" />
      
      {/* Background */}
      <DNAHelix />
      <HeartbeatLine />
      <Particles />
      
      <MedicalCross position={[-5, -4, -8]} />
      <MedicalCross position={[5, -12, -10]} />
      
      <Stars radius={100} depth={50} count={200} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={50} scale={20} size={2} speed={0.3} color="#0066CC" />
      
      {/* GLB Models */}
      <Suspense fallback={null}>
        <ModelDoctor position={[0, -1, 0]} scale={0.8} />
        <ModelStethoscope position={[-3, 0, 0]} scale={1.2} />
        <ModelSyringe position={[3, 0, 0]} scale={1} />
        <ModelPillBottle position={[5, -1, 0]} scale={1.3} />
        <ModelDashboard position={[0, -3, -2]} scale={0.6} />
      </Suspense>
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0a1628" transparent opacity={0.5} />
      </mesh>
      
      {/* Fog */}
      <fog attach="fog" args={['#0a1628', 5, 30]} />
    </>
  )
}

export default function Scene3D() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a1628', 1)
        }}
      >
        <Suspense fallback={null}>
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
    </div>
  )
}

// Preload models
useGLTF.preload('/models/medical doctor 3d model.glb')
useGLTF.preload('/models/stethoscope 3d model.glb')
useGLTF.preload('/models/cartoon syringe 3d model.glb')
useGLTF.preload('/models/pill bottle 3d model.glb')
useGLTF.preload('/models/dashboard.glb')
