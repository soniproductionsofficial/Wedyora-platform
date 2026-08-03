"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import type { Group, Mesh, Points, PointLight } from "three";
import * as THREE from "three";

function CursorLight() {
  const light = useRef<PointLight>(null);
  const { viewport } = useThree();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!light.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * viewport.width;
      const y = -(e.clientY / window.innerHeight - 0.5) * viewport.height;
      light.current.position.x += (x - light.current.position.x) * 0.08;
      light.current.position.y += (y - light.current.position.y) * 0.08;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [viewport.height, viewport.width]);

  return <pointLight ref={light} intensity={1.4} color="#fff1dc" distance={12} position={[1, 1, 3]} />;
}

function AmbientParticles({ count = 64 }: { count?: number }) {
  const points = useRef<Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.04;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#f0e4d0"
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Rings() {
  const group = useRef<Group>(null);
  const a = useRef<Mesh>(null);
  const b = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += delta * 0.32;
      group.current.position.x = 1.15 + Math.sin(t * 0.35) * 0.08;
    }
    if (a.current) {
      a.current.rotation.x = 0.55 + Math.sin(t * 0.6) * 0.22;
      a.current.rotation.z = Math.cos(t * 0.4) * 0.18;
    }
    if (b.current) {
      b.current.rotation.y += delta * 0.55;
      b.current.rotation.x = -0.35 + Math.cos(t * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.05}>
      <group ref={group} position={[1.2, 0.1, 0]}>
        <mesh ref={a}>
          <torusGeometry args={[1.4, 0.13, 48, 120]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.96}
            roughness={0.1}
            emissive="#8a6a3d"
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh ref={b} scale={0.78} position={[0.2, -0.12, 0.25]}>
          <torusGeometry args={[1.25, 0.08, 36, 96]} />
          <meshStandardMaterial
            color="#fff3e0"
            metalness={0.85}
            roughness={0.16}
            emissive="#c97b84"
            emissiveIntensity={0.28}
          />
        </mesh>
        <mesh position={[1.0, 0.8, 0.4]} scale={0.3}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#fff8ee"
            metalness={0.7}
            roughness={0.08}
            emissive="#e2711d"
            emissiveIntensity={0.45}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function StagingHero3DScene({
  dprMax = 1.75,
  particleCount = 64,
}: {
  dprMax?: number;
  particleCount?: number;
}) {
  return (
    <Canvas
      dpr={[1, dprMax]}
      camera={{ position: [0, 0, 4.1], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", willChange: "transform" }}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 2]} intensity={1.5} color="#fff2dd" />
      <pointLight position={[-3, 1, 2]} intensity={0.9} color="#c97b84" />
      <CursorLight />
      <Rings />
      {particleCount > 0 ? <AmbientParticles count={particleCount} /> : null}
    </Canvas>
  );
}
