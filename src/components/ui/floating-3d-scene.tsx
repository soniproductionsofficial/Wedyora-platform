"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { Group, Mesh } from "three";

function WeddingRing() {
  const group = useRef<Group>(null);
  const ring = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.28;
    if (ring.current) ring.current.rotation.x = Math.sin(Date.now() * 0.0004) * 0.12;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.75}>
      <group ref={group} position={[0.2, 0.15, 0]} rotation={[0.45, 0.25, 0.15]}>
        <mesh ref={ring}>
          <torusGeometry args={[1.05, 0.16, 32, 80]} />
          <meshStandardMaterial
            color="#d4af6a"
            metalness={0.95}
            roughness={0.16}
            emissive="#8a6a3d"
            emissiveIntensity={0.22}
          />
        </mesh>
        <mesh position={[0.92, 0.5, 0.08]} scale={0.2}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#fff6e8"
            metalness={0.55}
            roughness={0.12}
            emissive="#c97b84"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

function RibbonAccent() {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.2;
  });

  return (
    <Float speed={1.05} rotationIntensity={0.15} floatIntensity={0.45}>
      <mesh ref={mesh} position={[-1.35, -0.5, -0.35]} rotation={[0.4, 0.7, -0.25]}>
        <torusGeometry args={[0.7, 0.05, 16, 64, Math.PI * 1.2]} />
        <meshStandardMaterial
          color="#c97b84"
          metalness={0.35}
          roughness={0.35}
          emissive="#c97b84"
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 2]} intensity={1.35} color="#fff2dd" />
      <pointLight position={[-3, 1.2, 2]} intensity={0.85} color="#c97b84" />
      <pointLight position={[2, -1, 3]} intensity={0.45} color="#d4af6a" />
      <WeddingRing />
      <RibbonAccent />
    </>
  );
}

/**
 * Decorative Three.js scene for the landing hero. Lazily mounted only on
 * desktop-class devices; returns null on mobile / reduced-motion.
 */
export default function Floating3DScene({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 900px) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setActive(desktop.matches && !reduce.matches);
    update();
    desktop.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  if (!active) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.2], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
