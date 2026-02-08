import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

export function PillBottle({ isActive, onClick }) {
  const groupRef = useRef()
  const capRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.08
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1) * 0.06
    }

    if (capRef.current && isActive) {
      // Cap lifts slightly when active
      capRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.02 + 0.45
    } else if (capRef.current) {
      capRef.current.position.y = 0.45
    }
  })

  return (
    <group 
      ref={groupRef}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered || isActive ? 1.1 : 1}
    >
      {/* Bottle Body */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
        <meshStandardMaterial 
          color="#FFB347" 
          transparent 
          opacity={0.7} 
          roughness={0.3}
        />
      </mesh>

      {/* Pills visible inside */}
      {[
        [-0.05, 0.1, 0.05], [0.05, 0.05, -0.05], [-0.03, -0.1, 0.02],
        [0.04, -0.05, 0.04], [-0.06, 0, -0.03], [0.02, -0.15, 0],
        [-0.02, 0.15, -0.02], [0.05, 0.12, -0.04], [-0.04, -0.08, -0.05]
      ].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
          <capsuleGeometry args={[0.025, 0.06, 4, 8]} />
          <meshStandardMaterial color="#FAFBFC" />
        </mesh>
      ))}

      {/* Bottle Label */}
      <mesh position={[0, 0, 0.21]}>
        <planeGeometry args={[0.35, 0.4]} />
        <meshStandardMaterial color="#FAFBFC" />
      </mesh>
      
      {/* Label text lines */}
      <mesh position={[0, 0.1, 0.22]}>
        <planeGeometry args={[0.28, 0.03]} />
        <meshStandardMaterial color="#0066CC" />
      </mesh>
      <mesh position={[0, 0, 0.22]}>
        <planeGeometry args={[0.25, 0.02]} />
        <meshStandardMaterial color="#B0BEC5" />
      </mesh>
      <mesh position={[0, -0.08, 0.22]}>
        <planeGeometry args={[0.22, 0.02]} />
        <meshStandardMaterial color="#B0BEC5" />
      </mesh>

      {/* Medical cross on label */}
      <mesh position={[0.1, -0.08, 0.22]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[0.06, 0.01]} />
        <meshStandardMaterial color="#0066CC" />
      </mesh>
      <mesh position={[0.1, -0.08, 0.22]}>
        <planeGeometry args={[0.01, 0.06]} />
        <meshStandardMaterial color="#0066CC" />
      </mesh>

      {/* Cap */}
      <group ref={capRef} position={[0, 0.45, 0]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
          <meshStandardMaterial 
            color={hovered || isActive ? "#20B2AA" : "#FAFBFC"} 
            roughness={0.5}
          />
        </mesh>
        {/* Cap ridges */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} rotation={[0, 0, (i / 5) * Math.PI * 2]}>
            <boxGeometry args={[0.01, 0.02, 0.1]} />
            <meshStandardMaterial color="#E8E8E8" />
          </mesh>
        ))}
      </group>

      {/* Glow effect when hovered */}
      {hovered && (
        <mesh>
          <cylinderGeometry args={[0.25, 0.25, 0.8, 16]} />
          <meshBasicMaterial color="#20B2AA" transparent opacity={0.15} />
        </mesh>
      )}

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
            Medication Manager
          </div>
        </Html>
      )}
    </group>
  )
}
