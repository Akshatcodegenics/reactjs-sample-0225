
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import TaskCube3D from './TaskCube3D';

interface Task3DSceneProps {
  tasks: Array<{ priority: 'low' | 'medium' | 'high' }>;
}

const Task3DScene = ({ tasks }: Task3DSceneProps) => {
  // Create a fallback array if no tasks are provided
  const displayTasks = tasks && tasks.length > 0 ? tasks.slice(0, 9) : [
    { priority: 'medium' as const },
    { priority: 'high' as const },
    { priority: 'low' as const }
  ];

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Environment preset="sunset" />
          
          {displayTasks.map((task, index) => (
            <TaskCube3D
              key={index}
              priority={task.priority}
              position={[
                (index % 3 - 1) * 1.5,
                (Math.floor(index / 3) - 1) * 1.5,
                0
              ]}
            />
          ))}
          
          <OrbitControls 
            enableZoom={true} 
            autoRotate 
            autoRotateSpeed={1}
            enablePan={false}
            maxDistance={10}
            minDistance={3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Task3DScene;
