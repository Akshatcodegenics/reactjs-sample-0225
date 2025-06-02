
import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  assignee?: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        } as Task);
      });
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching tasks:', error);
      // Fallback to localStorage
      const savedTasks = localStorage.getItem('taskboard-tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'tasks'), {
        ...taskData,
        createdAt: new Date()
      });
      toast({
        title: "Success",
        description: "Task created successfully!"
      });
    } catch (error) {
      console.error('Error creating task:', error);
      // Fallback to localStorage
      const task: Task = {
        id: Date.now().toString(),
        ...taskData,
        createdAt: new Date()
      };
      const updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      localStorage.setItem('taskboard-tasks', JSON.stringify(updatedTasks));
      toast({
        title: "Success",
        description: "Task created successfully!"
      });
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), updates);
      toast({
        title: "Task Updated",
        description: "Task has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating task:', error);
      // Fallback to localStorage
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      setTasks(updatedTasks);
      localStorage.setItem('taskboard-tasks', JSON.stringify(updatedTasks));
      toast({
        title: "Task Updated",
        description: "Task has been updated successfully"
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      toast({
        title: "Task Deleted",
        description: "Task has been removed successfully"
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      // Fallback to localStorage
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem('taskboard-tasks', JSON.stringify(updatedTasks));
      toast({
        title: "Task Deleted",
        description: "Task has been removed successfully"
      });
    }
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask
  };
};
