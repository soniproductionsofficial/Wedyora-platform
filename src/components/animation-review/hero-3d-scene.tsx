"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { Group, Mesh } from "three";

function OrbitingRings({ accent }: { accent: string }) {
  const group = useRef<Group>(null);
  const ringA = useRef<Mesh>(null);
  const ringB = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) group.current.rotation.y += delta * 0.35;
    if (ringA.current) {
      ringA.current.rotation.x = 0.6 + Math.sin(t * 0.7) * 0.25;
      ringA.current.rotation.z = Math.cos(t * 0.4) * 0.2;
    }
    if (ringB.current) {
      ringB.current.rotation.x = -0.4 + Math.cos(t * 0.55) * 0.2;
      ringB.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Float speed={1.6} rotationIntensity={0.45} floatIntensity={1.1}>
      <group ref={group} position={[1.1, 0.15, 0]}>
        <mesh ref={ringA}>
          <torusGeometry args={[1.35, 0.12, 40, 96]} />
          <meshStandardMaterial
            color={accent}
            metalness={0.95}
            roughness={0.12}
            emissive={accent}
            emissiveIntensity={0.35}
          />
        </mesh>
        <mesh ref={ringB} scale={0.72} position={[0.15, -0.1, 0.2]}>
          <torusGeometry args={[1.2, 0.08, 32, 80]} />
          <meshStandardMaterial
            color="#fff1dc"
            metalness={0.8}
            roughness={0.18}
            emissive="#c97b84"
            emissiveIntensity={0.22}
          />
        </mesh>
        <mesh position={[0.9, 0.75, 0.35]} scale={0.28}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#fff8ee"
            metalness={0.65}
            roughness={0.1}
            emissive="#e2711d"
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh position={[-0.85, -0.55, 0.4]} scale={0.16}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={accent}
            metalness={0.9}
            roughness={0.15}
            emissive={accent}
            emissiveIntensity={0.45}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Scene({ accent }: { accent: string }) {
  return (
    <>
      <color attach="background" args={["#00000000"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 3]} intensity={1.6} color="#fff2dd" />
      <pointLight position={[-3, 1.5, 2]} intensity={1.1} color="#c97b84" />
      <pointLight position={[2.5, -1, 3]} intensity={0.7} color={accent} />
      <OrbitingRings accent={accent} />
    </>
  );
}

/**
 * Bigger, brighter 3D canvas for the review hero.
 * Enabled on tablet+ (and fine pointers); skipped for reduced-motion.
 */
export default function Hero3DScene({
  className = "",
  accent = "#d4af6a",
}: {
  className?: string;
  accent?: string;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 640px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setActive(wide.matches && !reduce.matches);
    update();
    wide.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  if (!active) {
    // CSS fallback so mobile still "feels" dimensional
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
        <div className="absolute right-[8%] top-1/4 h-40 w-40 animate-pulse rounded-full bg-brand-gold/25 blur-2xl" />
        <div className="float-soft absolute right-[18%] top-[38%] h-24 w-24 rounded-full border border-brand-gold/40 bg-brand-gold/10" />
      </div>
    );
  }

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene accent={accent} />
      </Canvas>
    </div>
  );
}
