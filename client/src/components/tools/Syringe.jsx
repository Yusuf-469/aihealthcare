import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

export function Syringe({ isActive, onClick }) {
  const groupRef = useRef()
  const plungerRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.08
    }

    if (plungerRef.current && isActive) {
      // Subtle plunger movement when active
      plungerRef.current.position.x = Math.sin(state.clock.elapsedTime * 2) * 0.05
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
      {/* Syringe Body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
        <meshStandardMaterial 
          color="#FAFBFC" 
          transparent 
          opacity={0.8} 
          roughness={0.1} 
          metalness={0.1}
        />
      </mesh>

      {/* Liquid inside */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.02]}>
        <cylinderGeometry args={[0.12, 0.12, 0.6, 16]} />
        <meshStandardMaterial 
          color={isActive ? "#20B2AA" : "#0066CC"} 
          transparent 
          opacity={0.6}
        />
      </mesh>

      {/* Measurement markings */}
      {[-0.4, -0.2, 0, 0.2, 0.4].map((y, i) => (
        <mesh key={i} position={[y, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.01, 0.03, 0.01]} />
          <meshStandardMaterial color="#0066CC" />
        </mesh>
      ))}

      {/* Needle */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.7, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Needle tip */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.9, 0, 0]}>
        <coneGeometry args={[0.015, 0.05, 8]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Plunger handle */}
      <group ref={plungerRef} position={[0.7, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.1, 16]} />
          <meshStandardMaterial color="#FAFBFC" />
        </mesh>
        {/* Plunger rod */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.15, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial color="#FAFBFC" />
        </mesh>
        {/* Plunger thumb rest */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
          <meshStandardMaterial color="#0066CC" />
        </mesh>
      </group>

      {/* Glow effect when hovered */}
      {hovered && (
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 1.4, 16]} />
          <meshBasicMaterial color="#20B2AA" transparent opacity={0.2} />
        </mesh>
      )}

      {/* Tooltip */}
      {hovered && (
        <Html position={[0, 0.5, 0]} center>
          <div style={{
            background: 'rgba(10, 22, 40, 0.95)',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #0066CC',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            color: '#FAFBFC'
          }}>
            Vaccination Tracker
          </div>
        </Html>
      )}
    </group>
  )
}
