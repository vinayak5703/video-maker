import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

// This is the actual 3D Shape (A distorted floating blob)
const AnimatedShape = () => {
  const meshRef = useRef();

  useFrame(() => {
    // This makes it rotate automatically
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.005;
  });

  return (
    <Sphere args={[1, 100, 200]} scale={2.4} ref={meshRef}>
      <MeshDistortMaterial
        color="#4f46e5"  // Indigo color (Professional Tech color)
        attach="material"
        distort={0.5}    // Amount of distortion
        speed={2}        // Speed of movement
        roughness={0}
        metalness={1}    // Makes it look metallic/shiny
      />
    </Sphere>
  );
};

// This is the full Scene
const ThreeDBackground = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas>
        {/* Lights to make the 3D object visible */}
        <ambientLight intensity={1} />
        <directionalLight position={[3, 2, 1]} />
        
        {/* The 3D Object */}
        <AnimatedShape />
        
        {/* Allows you to rotate it with mouse (optional) */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default ThreeDBackground;