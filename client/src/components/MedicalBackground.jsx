import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import * as THREE from 'three'

// Large Main DNA Helix - spans entire page
function LargeDNAHelix() {
  const groupRef = useRef()
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15
    }
  })
  
  const strand1 = []
  const strand2 = []
  const connections = []
  
  // Create a large helix with 60 pairs
  for (let i = 0; i < 60; i++) {
    const y = i * 0.3 - 9
    const angle1 = i * 0.4
    const angle2 = angle1 + Math.PI
    
    strand1.push({ x: Math.cos(angle1) * 1.5, y, z: Math.sin(angle1) * 1.5 })
    strand2.push({ x: Math.cos(angle2) * 1.5, y, z: Math.sin(angle2) * 1.5 })
    connections.push({ x1: Math.cos(angle1) * 1.5, y1: y, z1: Math.sin(angle1) * 1.5, x2: Math.cos(angle2) * 1.5, y2: y, z2: Math.sin(angle2) * 1.5 })
  }
  
  return (
    <group ref={groupRef} position={[-5, 0, -15]} scale={1.5}>
      {/* Strand 1 - Blue */}
      {strand1.map((pos, i) => (
        <mesh key={`s1-${i}`} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#0066CC" emissive="#0066CC" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* Strand 2 - Teal */}
      {strand2.map((pos, i) => (
        <mesh key={`s2-${i}`} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#20B2AA" emissive="#20B2AA" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* Connections */}
      {connections.map((conn, i) => (
        <mesh key={`conn-${i}`} position={[(conn.x1 + conn.x2) / 2, conn.y1, (conn.z1 + conn.z2) / 2]} rotation={[0, (i * 0.4) + Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  )
}

// Large Heartbeat/EKG Line
function LargeHeartbeatLine() {
  const lineRef = useRef()
  const points = useRef([])
  
  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.elapsedTime
      const offset = Math.sin(time * 2) * 0.05
      
      points.current = []
      // Create a longer, more visible heartbeat line
      for (let i = 0; i < 100; i++) {
        const x = (i / 100) * 40 - 20
        let y = Math.sin(i * 0.1 + time) * 0.1 + offset
        
        // Create prominent heartbeat spikes
        if (i > 30 && i < 50) {
          y += Math.sin((i - 30) * Math.PI / 10) * 0.8 * Math.sin(time * 4)
        }
        
        points.current.push([x, y, 0])
      }
      
      lineRef.current.geometry.setFromPoints(points.current.map(p => new THREE.Vector3(...p)))
    }
  })
  
  return (
    <group position={[0, 5, -10]}>
      {/* Main EKG line */}
      <line ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#4CAF50" linewidth={3} />
      </line>
      {/* Glow effect line */}
      <line ref={(el) => {
        if (el && lineRef.current) {
          el.geometry.copy(lineRef.current.geometry)
        }
      }}>
        <bufferGeometry />
        <lineBasicMaterial color="#4CAF50" linewidth={1} transparent opacity={0.3} />
      </line>
    </group>
  )
}

// Medical Cross in Circle
function CrossInCircle({ position, scale = 1 }) {
  const circleRef = useRef()
  const crossRef = useRef()
  
  useFrame((state, delta) => {
    if (circleRef.current) {
      // Only rotate the circle
      circleRef.current.rotation.z += delta * 0.5
    }
    // Cross stays stationary (no rotation)
  })
  
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={circleRef} position={position} scale={scale}>
        {/* Outer circle glow - rotates */}
        <mesh>
          <circleGeometry args={[2.5, 64]} />
          <meshBasicMaterial color="#0066CC" transparent opacity={0.1} />
        </mesh>
        {/* Middle circle - rotates */}
        <mesh>
          <circleGeometry args={[2.2, 64]} />
          <meshBasicMaterial color="#0D1B2A" transparent opacity={0.8} />
        </mesh>
        {/* Inner circle border - rotates */}
        <mesh>
          <ringGeometry args={[2.0, 2.1, 64]} />
          <meshBasicMaterial color="#0066CC" transparent opacity={0.5} />
        </mesh>
      </group>
      {/* Stationary Cross (not inside rotating circle) */}
      <group ref={crossRef} position={position} scale={scale}>
        {/* Vertical bar - stationary */}
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[0.6, 2, 0.2]} />
          <meshStandardMaterial color="#FF6B6B" emissive="#FF6B6B" emissiveIntensity={0.3} />
        </mesh>
        {/* Horizontal bar - stationary */}
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[2, 0.6, 0.2]} />
          <meshStandardMaterial color="#FF6B6B" emissive="#FF6B6B" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  )
}

// Floating Molecule with atoms
function FloatingMolecule({ position, color = "#0066CC", scale = 1 }) {
  const moleculeRef = useRef()
  
  useFrame((state, delta) => {
    if (moleculeRef.current) {
      moleculeRef.current.rotation.x += delta * 0.4
      moleculeRef.current.rotation.y += delta * 0.5
    }
  })
  
  const atoms = [
    { pos: [0, 0.8, 0], size: 0.25 },
    { pos: [-0.7, -0.4, 0], size: 0.2 },
    { pos: [0.7, -0.4, 0], size: 0.2 },
    { pos: [0, -0.4, 0.7], size: 0.2 },
    { pos: [0, -0.4, -0.7], size: 0.2 },
  ]
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={moleculeRef} position={position} scale={scale}>
        {atoms.map((atom, i) => (
          <mesh key={i} position={atom.pos}>
            <sphereGeometry args={[atom.size, 32, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
          </mesh>
        ))}
        {/* Bonds */}
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.06, 0.06, 0.9, 16]} />
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
        </mesh>
        <mesh position={[-0.35, -0.1, 0]} rotation={[0, 0, -Math.PI / 3]}>
          <cylinderGeometry args={[0.06, 0.06, 0.8, 16]} />
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.35, -0.1, 0]} rotation={[0, 0, Math.PI / 3]}>
          <cylinderGeometry args={[0.06, 0.06, 0.8, 16]} />
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
        </mesh>
      </group>
    </Float>
  )
}

// Floating Pill Capsule
function PillCapsule({ position, rotation = [0, 0, 0], scale = 1, color1 = "#FAFBFC", color2 = "#0066CC" }) {
  const pillRef = useRef()
  
  useFrame((state, delta) => {
    if (pillRef.current) {
      pillRef.current.rotation.x += delta * 0.6
      pillRef.current.rotation.z += delta * 0.4
    }
  })
  
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
      <group ref={pillRef} position={position} rotation={rotation} scale={scale}>
        {/* Top half */}
        <mesh position={[0, 0.5, 0]}>
          <capsuleGeometry args={[0.25, 0.8, 8, 16]} />
          <meshStandardMaterial color={color1} emissive={color1} emissiveIntensity={0.1} />
        </mesh>
        {/* Bottom half */}
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.25, 0.8, 8, 16]} />
          <meshStandardMaterial color={color2} emissive={color2} emissiveIntensity={0.2} />
        </mesh>
      </group>
    </Float>
  )
}

// Main Medical Background Component
export default function MedicalBackground() {
  return (
    <group>
      {/* Large DNA Helix spanning the page */}
      <LargeDNAHelix />
      <LargeDNAHelix position={[8, 0, -18]} scale={1.2} />
      
      {/* Large Heartbeat Line */}
      <LargeHeartbeatLine />
      <LargeHeartbeatLine position={[0, -15, -12]} />
      <LargeHeartbeatLine position={[0, -32, -14]} />
      
      {/* Medical Crosses in Circles */}
      <CrossInCircle position={[-8, -5, -10]} scale={1.5} />
      <CrossInCircle position={[7, -18, -12]} scale={1.2} />
      <CrossInCircle position={[-6, -28, -15]} scale={1.8} />
      <CrossInCircle position={[8, -38, -12]} scale={1.3} />
      
      {/* Floating Molecules */}
      <FloatingMolecule position={[-9, -12, -12]} color="#20B2AA" scale={1.5} />
      <FloatingMolecule position={[6, -25, -14]} color="#0066CC" scale={1.3} />
      <FloatingMolecule position={[-7, -35, -16]} color="#FF6B6B" scale={1.6} />
      
      {/* Floating Pills */}
      <PillCapsule position={[9, -8, -10]} rotation={[0.3, 0.5, 0]} scale={1.2} />
      <PillCapsule position={[-8, -22, -12]} rotation={[0.2, 0.3, 0.5]} scale={1.4} color1="#20B2AA" color2="#FAFBFC" />
      <PillCapsule position={[7, -38, -15]} rotation={[0.5, 0.2, 0.3]} scale={1.1} />
      
      {/* Ambient particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0} floatIntensity={1.2}>
          <mesh position={[
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 60 - 10,
            (Math.random() - 0.5) * 30 - 10
          ]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial 
              color="#0066CC" 
              transparent 
              opacity={0.5} 
              emissive="#0066CC" 
              emissiveIntensity={0.6} 
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}
