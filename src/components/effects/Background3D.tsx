import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

const FloatingOrb = ({ position, color, scale }: { position: [number, number, number], color: string, scale: number }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[scale, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.1}
          distort={0.3}
          speed={2}
          roughness={0.4}
        />
      </Sphere>
    </Float>
  );
};

export const Background3D = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00ff00" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#00ff88" />
        
        <FloatingOrb position={[-4, 2, -5]} color="#00ff00" scale={1} />
        <FloatingOrb position={[4, -2, -3]} color="#00ff88" scale={0.7} />
        <FloatingOrb position={[0, 4, -8]} color="#00ff44" scale={1.2} />
        <FloatingOrb position={[-2, -3, -6]} color="#44ff00" scale={0.8} />
        <FloatingOrb position={[3, 1, -4]} color="#88ff00" scale={0.9} />
      </Canvas>
    </div>
  );
};