import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Text } from '@react-three/drei'
import { useStore } from '../../store'

export function DoctorAvatar({ isActive, onClick }) {
  const groupRef = useRef()
  const headRef = useRef()
  const eyesRef = useRef()
  const mouthRef = useRef()
  const leftHandRef = useRef()
  const rightHandRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { avatarMood, setAvatarMood } = useStore()

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle breathing animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
    }

    if (headRef.current) {
      // Head movement based on mood
      const time = state.clock.elapsedTime
      switch (avatarMood) {
        case 'analyzing':
          headRef.current.rotation.z = Math.sin(time * 2) * 0.05
          headRef.current.rotation.x = Math.sin(time * 3) * 0.02
          break;
        case 'concerned':
          headRef.current.rotation.z = Math.sin(time * 1.5) * 0.08
          headRef.current.rotation.x = 0.05
          break;
        case 'reassuring':
          headRef.current.rotation.z = Math.sin(time * 1) * 0.1
          headRef.current.rotation.x = -0.03
          break;
        default:
          headRef.current.rotation.z = Math.sin(time * 0.5) * 0.02
      }
    }

    if (eyesRef.current) {
      // Eye animation
      const blink = Math.sin(state.clock.elapsedTime * 3) > 0.995 ? 0.1 : 1
      eyesRef.current.scale.y = blink
    }

    if (leftHandRef.current && rightHandRef.current) {
      // Hand gestures
      switch (avatarMood) {
        case 'analyzing':
          leftHandRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 0.8
          rightHandRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + Math.PI) * 0.02 + 0.8
          break;
        case 'concerned':
          leftHandRef.current.position.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.03 + 0.1
          rightHandRef.current.position.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.03 + 0.1
          break;
        default:
          leftHandRef.current.position.y = 0.8
          rightHandRef.current.position.y = 0.8
      }
    }
  })

  const handleClick = () => {
    onClick()
  }

  const moodColors = {
    neutral: '#FAFBFC',
    analyzing: '#20B2AA',
    concerned: '#FF6B6B',
    reassuring: '#4CAF50',
    emergency: '#FF6B6B'
  }

  return (
    <group 
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered || isActive ? 1.1 : 1}
    >
      {/* Body/White Coat */}
      <group position={[0, 0, 0]}>
        {/* Torso */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.5, 1.2, 8, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>
        
        {/* Coat lapels */}
        <mesh position={[0, 0.3, 0.26]}>
          <boxGeometry args={[0.15, 0.6, 0.02]} />
          <meshStandardMaterial color="#E8E8E8" />
        </mesh>
        <mesh position={[-0.15, 0.3, 0.26]}>
          <boxGeometry args={[0.15, 0.6, 0.02]} />
          <meshStandardMaterial color="#E8E8E8" />
        </mesh>

        {/* Tie */}
        <mesh position={[0, 0.4, 0.28]}>
          <coneGeometry args={[0.06, 0.2, 4]} />
          <meshStandardMaterial color="#0066CC" />
        </mesh>
      </group>

      {/* Head */}
      <group ref={headRef} position={[0, 1.4, 0]}>
        {/* Face */}
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial color="#E8C4A0" roughness={0.7} />
        </mesh>

        {/* Hair */}
        <mesh position={[0, 0.35, 0]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.36, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
          <meshStandardMaterial color="#4A3728" roughness={0.9} />
        </mesh>

        {/* Eyes */}
        <group ref={eyesRef} position={[0, 0.05, 0.28]}>
          {/* Left eye */}
          <mesh position={[-0.12, 0, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[-0.12, 0, 0.32]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshStandardMaterial color="#0066CC" />
          </mesh>
          
          {/* Right eye */}
          <mesh position={[0.12, 0, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.12, 0, 0.32]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshStandardMaterial color="#0066CC" />
          </mesh>
        </group>

        {/* Eyebrows */}
        <mesh position={[-0.12, 0.15, 0.26]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshStandardMaterial color="#4A3728" />
        </mesh>
        <mesh position={[0.12, 0.15, 0.26]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshStandardMaterial color="#4A3728" />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.05, 0.32]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#E0B894" roughness={0.8} />
        </mesh>

        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, -0.18, 0.3]}>
          <boxGeometry args={[0.1, 0.03, 0.02]} />
          <meshStandardMaterial 
            color={avatarMood === 'concerned' ? '#CC6666' : '#CC9999'} 
          />
        </mesh>

        {/* Stethoscope around neck */}
        <group position={[0, -0.3, 0.2]}>
          <mesh rotation={[0, 0, Math.PI / 8]}>
            <torusGeometry args={[0.2, 0.02, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#2C2C2C" />
          </mesh>
          <mesh position={[0, -0.4, 0.2]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Arms */}
      <group position={[-0.55, 0.8, 0]}>
        <mesh rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <group ref={leftHandRef} position={[0, -0.4, 0]}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#E8C4A0" roughness={0.7} />
          </mesh>
        </group>
      </group>

      <group position={[0.55, 0.8, 0]}>
        <mesh rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <group ref={rightHandRef} position={[0, -0.4, 0]}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#E8C4A0" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Glow effect when active */}
      {isActive && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial color="#0066CC" transparent opacity={0.1} />
        </mesh>
      )}

      {/* Mood indicator light */}
      <pointLight 
        position={[0, 1.8, 0.5]} 
        intensity={0.5} 
        color={moodColors[avatarMood] || moodColors.neutral} 
      />

      {/* Tooltip */}
      {hovered && (
        <Html position={[0, 2.2, 0]} center>
          <div style={{
            background: 'rgba(10, 22, 40, 0.95)',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #0066CC',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            color: '#FAFBFC'
          }}>
            AI Symptom Checker
          </div>
        </Html>
      )}
    </group>
  )
}
