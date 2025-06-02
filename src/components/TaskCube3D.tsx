
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

interface TaskCube3DProps {
  priority: 'low' | 'medium' | 'high';
  position: [number, number, number];
}

const TaskCube3D = ({ priority, position }: TaskCube3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    }
  });

  const getColor = () => {
    switch (priority) {
      case 'high': return '#ef4444'; // red-500
      case 'medium': return '#f59e0b'; // amber-500
      case 'low': return '#10b981'; // emerald-500
      default: return '#6b7280'; // gray-500
    }
  };

  const getScale = () => {
    switch (priority) {
      case 'high': return 1.2;
      case 'medium': return 1.0;
      case 'low': return 0.8;
      default: return 1.0;
    }
  };

  return (
    <Box 
      ref={meshRef} 
      position={position} 
      args={[0.6, 0.6, 0.6]}
      scale={getScale()}
    >
      <meshStandardMaterial 
        attach="material" 
        color={getColor()}
        metalness={0.3}
        roughness={0.4}
      />
    </Box>
  );
};

export default TaskCube3D;
