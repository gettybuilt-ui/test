import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text3D, Center, MeshDistortMaterial, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

function AnimatedSphere({ position, color, speed, distort }: {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
}) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.2;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.1;
  });

  return (
    <mesh ref={mesh} position={position}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial
        color={color}
        roughness={0.1}
        metalness={0.8}
        distort={distort}
        speed={2}
      />
    </mesh>
  );
}

function FloatingRing({ position, color, rotationSpeed }: {
  position: [number, number, number];
  color: string;
  rotationSpeed: number;
}) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    mesh.current.rotation.x = state.clock.elapsedTime * rotationSpeed;
    mesh.current.rotation.y = state.clock.elapsedTime * rotationSpeed * 0.5;
  });

  return (
    <mesh ref={mesh} position={position}>
      <torusGeometry args={[1.2, 0.15, 16, 100]} />
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

function ParticleField() {
  const count = 500;
  const mesh = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  useFrame((state) => {
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <points ref={mesh} geometry={geom}>
      <pointsMaterial size={0.05} color="#8b5cf6" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function GlowingPlane() {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    mesh.current.rotation.x = -Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
  });

  return (
    <mesh ref={mesh} position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50, 50, 50]} />
      <meshStandardMaterial
        color="#1a0533"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#030014']} />
      <fog attach="fog" args={['#030014', 8, 30]} />

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-10, -10, -5]} intensity={0.8} color="#06b6d4" />
      <pointLight position={[0, 5, -10]} intensity={0.6} color="#ec4899" />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <AnimatedSphere position={[-3, 1, -2]} color="#8b5cf6" speed={1.2} distort={0.4} />
      </Float>

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
        <AnimatedSphere position={[3.5, -0.5, -3]} color="#06b6d4" speed={0.8} distort={0.3} />
      </Float>

      <Float speed={1} rotationIntensity={0.4} floatIntensity={1.2}>
        <AnimatedSphere position={[0, 2.5, -5]} color="#ec4899" speed={1.5} distort={0.5} />
      </Float>

      <FloatingRing position={[-2, -1, -4]} color="#8b5cf6" rotationSpeed={0.5} />
      <FloatingRing position={[4, 2, -6]} color="#06b6d4" rotationSpeed={0.3} />
      <FloatingRing position={[1, -2, -3]} color="#ec4899" rotationSpeed={0.7} />

      <ParticleField />
      <Stars radius={50} depth={50} count={1000} factor={4} fade speed={1} />
      <GlowingPlane />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <Scene />
      </Canvas>

      <div className="overlay">
        <nav className="nav">
          <div className="logo">NEXUS</div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <main className="hero">
          <h1 className="hero-title">
            Build the
            <span className="gradient-text"> Future</span>
          </h1>
          <p className="hero-subtitle">
            Immersive 3D experiences powered by cutting-edge technology.
            Explore new dimensions of the web.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </main>

        <section className="features" id="about">
          <div className="feature-card">
            <div className="feature-icon">&#9670;</div>
            <h3>3D Graphics</h3>
            <p>Real-time rendering with WebGL and Three.js</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">&#9733;</div>
            <h3>Interactive</h3>
            <p>Drag, rotate, and explore the 3D scene</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">&#9788;</div>
            <h3>Performant</h3>
            <p>Optimized for smooth 60fps animations</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
