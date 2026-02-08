import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, MeshDistortMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { Stethoscope } from './tools/Stethoscope'
import { DoctorAvatar } from './tools/DoctorAvatar'
import { Syringe } from './tools/Syringe'
import { PillBottle } from './tools/PillBottle'
import { useStore } from '../store'
import MedicalBackground from './MedicalBackground'

// DNA Helix Background
function DNAHelix() {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const points = useMemo(() => {
    const points = []
    for (let i = 0; i < 50; i++) {
      const t = i / 50 * Math.PI * 4
      points.push(new THREE.Vector3(Math.cos(t) * 0.5, (i / 50 - 0.5) * 8, Math.sin(t) * 0.5))
      points.push(new THREE.Vector3(Math.cos(t + Math.PI) * 0.5, (i / 50 - 0.5) * 8, Math.sin(t + Math.PI) * 0.5))
    }
    return points
  }, [])

  return (
    <group ref={groupRef} position={[-8, 0, -10]}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#0066CC" opacity={0.6} transparent />
      </line>
      {points.map((point, i) => (
        <mesh key={i} position={point}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#20B2AA" : "#0066CC"} 
            emissive={i % 2 === 0 ? "#20B2AA" : "#0066CC"}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

// EKG Line Background
function EKGLine() {
  const lineRef = useRef()
  
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.material.dashOffset = state.clock.elapsedTime * 0.5
    }
  })

  const points = useMemo(() => {
    const pts = []
    pts.push(new THREE.Vector3(-10, -3, -5))
    pts.push(new THREE.Vector3(-8, -3, -5))
    pts.push(new THREE.Vector3(-7, -3, -5))
    pts.push(new THREE.Vector3(-6.5, -1, -5))
    pts.push(new THREE.Vector3(-6, -5, -5))
    pts.push(new THREE.Vector3(-5.5, -3, -5))
    pts.push(new THREE.Vector3(10, -3, -5))
    return pts
  }, [])

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#4CAF50" linewidth={2} />
    </line>
  )
}

// Floating Particles
function FloatingParticles() {
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 100; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20 - 5
        ],
        size: Math.random() * 0.05 + 0.02,
        speed: Math.random() * 0.2 + 0.1
      })
    }
    return temp
  }, [])

  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(state.clock.elapsedTime * child.userData.speed + i) * 0.001
      })
    }
  })

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position} userData={particle}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial
            color="#FAFBFC"
            emissive="#FAFBFC"
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

// Ambient Medical Cross Markers
function MedicalCrosses() {
  const crosses = useMemo(() => [
    { position: [6, 4, -8], scale: 0.5 },
    { position: [-7, 3, -6], scale: 0.3 },
    { position: [8, -2, -7], scale: 0.4 },
    { position: [-5, 5, -9], scale: 0.35 },
  ], [])

  return (
    <>
      {crosses.map((cross, i) => (
        <Float key={i} speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
          <group position={cross.position} scale={cross.scale}>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.3, 1, 0.1]} />
              <meshStandardMaterial color="#0066CC" emissive="#0066CC" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1, 0.3, 0.1]} />
              <meshStandardMaterial color="#0066CC" emissive="#0066CC" emissiveIntensity={0.3} />
            </mesh>
          </group>
        </Float>
      ))}
    </>
  )
}

// Main Scene Component
export function Scene() {
  const { activeTool, setActiveTool } = useStore()

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#0066CC" />
      <pointLight position={[-10, 5, 10]} intensity={0.5} color="#20B2AA" />
      <pointLight position={[0, -5, 5]} intensity={0.3} color="#FAFBFC" />
      
      {/* Background Elements - Full Medical Environment */}
      <MedicalBackground />
      <DNAHelix />
      <EKGLine />
      <FloatingParticles />
      <MedicalCrosses />
      
      {/* Interactive Medical Tools */}
      <group position={[0, 0, 0]}>
        {/* Stethoscope - Report Analyzer (Left) */}
        <group position={[-4, 0.5, 0]}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
            <Stethoscope 
              isActive={activeTool === 'stethoscope'}
              onClick={() => setActiveTool(activeTool === 'stethoscope' ? null : 'stethoscope')}
            />
          </Float>
        </group>
        
        {/* Doctor Avatar - Chat (Center) */}
        <group position={[0, -1, 0]}>
          <DoctorAvatar 
            isActive={activeTool === 'avatar'}
            onClick={() => setActiveTool(activeTool === 'avatar' ? null : 'avatar')}
          />
        </group>
        
        {/* Syringe - Vaccination Tracker (Right) */}
        <group position={[4, 0.5, 0]}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <Syringe 
              isActive={activeTool === 'syringe'}
              onClick={() => setActiveTool(activeTool === 'syringe' ? null : 'syringe')}
            />
          </Float>
        </group>
        
        {/* Pill Bottle - Medication Manager (Far Right) */}
        <group position={[6.5, -0.5, 0]}>
          <Float speed={1.8} rotationIntensity={0.1} floatIntensity={0.25}>
            <PillBottle 
              isActive={activeTool === 'pillbottle'}
              onClick={() => setActiveTool(activeTool === 'pillbottle' ? null : 'pillbottle')}
            />
          </Float>
        </group>
      </group>
      
      {/* Ground Reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#0a1628"
          transparent
          opacity={0.5}
        />
      </mesh>
    </>
  )
}
