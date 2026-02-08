import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import * as THREE from 'three'

export function Stethoscope({ isActive, onClick }) {
  const groupRef = useRef()
  const chestPieceRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      // Idle animation - gentle float
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1
    }
    
    if (chestPieceRef.current && isAnalyzing) {
      // Pulse animation when analyzing
      const pulse = Math.sin(state.clock.elapsedTime * 8) * 0.05 + 1
      chestPieceRef.current.scale.setScalar(pulse)
    } else if (chestPieceRef.current) {
      // Gentle heartbeat rhythm
      const heartbeat = Math.sin(state.clock.elapsedTime * 1.2) * 0.02 + 1
      chestPieceRef.current.scale.setScalar(heartbeat)
    }
  })

  const handleClick = () => {
    if (isAnalyzing) return
    onClick()
  }

  return (
    <group 
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Stethoscope Head/Chest Piece */}
      <group position={[0, 0, 0]}>
        {/* Main chest piece */}
        <mesh ref={chestPieceRef}>
          <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
          <meshStandardMaterial 
            color={hovered || isActive ? "#20B2AA" : "#C0C0C0"} 
            metalness={0.8}
            roughness={0.2}
            emissive={hovered || isActive ? "#20B2AA" : "#000000"}
            emissiveIntensity={hovered || isActive ? 0.3 : 0}
          />
        </mesh>
        
        {/* Diaphragm */}
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshStandardMaterial 
            color={hovered || isActive ? "#40E0D0" : "#D4D4D4"}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        
        {/* Tubing connection */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.15, 16]} />
          <meshStandardMaterial color="#2C2C2C" roughness={0.8} />
        </mesh>
      </group>

      {/* Tubing - U-shape */}
      <group position={[0, -0.2, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.4, 0.05, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#2C2C2C" roughness={0.8} />
        </mesh>
      </group>

      {/* Ear tips */}
      <group position={[0.5, 0.5, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
          <meshStandardMaterial color="#2C2C2C" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      </group>

      <group position={[-0.5, 0.5, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
          <meshStandardMaterial color="#2C2C2C" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      </group>

      {/* Glow ring when hovered/active */}
      {hovered || isActive ? (
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.5, 32]} />
          <meshBasicMaterial color="#20B2AA" transparent opacity={0.4} />
        </mesh>
      ) : null}

      {/* Tooltip */}
      {hovered && (
        <Html position={[0, 0.8, 0]} center>
          <div style={{
            background: 'rgba(10, 22, 40, 0.95)',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #0066CC',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            color: '#FAFBFC'
          }}>
            Analyze Medical Reports
          </div>
        </Html>
      )}

      {/* Analyzing animation ring */}
      {isAnalyzing && (
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 32]} />
          <meshBasicMaterial color="#20B2AA" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}
