
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import TaskCube3D from './TaskCube3D';

interface Task3DSceneProps {
  tasks: Array<{ priority: 'low' | 'medium' | 'high' }>;
}

const Task3DScene = ({ tasks }: Task3DSceneProps) => {
  return (
    <div className="h-64 w-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Environment preset="sunset" />
        
        {tasks.slice(0, 9).map((task, index) => (
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
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default Task3DScene;
