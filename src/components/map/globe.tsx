"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

function Earth() {
  const mesh = useRef<THREE.Mesh>(null!)

  return (
    <mesh ref={mesh} rotation={[0.4, 0.5, 0]}>
      <sphereGeometry args={[3, 128, 128]} />
      <meshStandardMaterial
        color="#0b1a2b"
        wireframe={false}
      />
    </mesh>
  )
}

function Satellites() {
  const points = []

  for (let i = 0; i < 2000; i++) {
    points.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        Math.random() * 3 + 3,
        (Math.random() - 0.5) * 20
      )
    )
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="yellow"
      />
    </points>
  )
}

export default function Globe() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 2, 8] }}>

        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} />

        <Earth />

        <Satellites />

        <Stars
          radius={300}
          depth={50}
          count={5000}
          factor={6}
        />

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.1}
        />

      </Canvas>
    </div>
  )
}