
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

const STORAGE_KEY = 'taskboard-tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFirebase, setUseFirebase] = useState(true);

  // Load tasks from localStorage
  const loadLocalTasks = () => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Error loading local tasks:', error);
    }
  };

  // Save tasks to localStorage
  const saveLocalTasks = (tasksToSave: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Error saving local tasks:', error);
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeTasks = async () => {
      if (useFirebase) {
        try {
          const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
          
          unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasksData: Task[] = [];
            querySnapshot.forEach((doc) => {
              tasksData.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
              } as Task);
            });
            setTasks(tasksData);
            saveLocalTasks(tasksData);
            setLoading(false);
          }, (error) => {
            console.error('Firestore connection error:', error);
            setUseFirebase(false);
            loadLocalTasks();
            setLoading(false);
            toast({
              title: "Connection Issue",
              description: "Using local storage for tasks",
              variant: "default"
            });
          });
        } catch (error) {
          console.error('Error setting up Firestore listener:', error);
          setUseFirebase(false);
          loadLocalTasks();
          setLoading(false);
        }
      } else {
        loadLocalTasks();
        setLoading(false);
      }
    };

    initializeTasks();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [useFirebase]);

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date()
    };

    if (useFirebase) {
      try {
        await addDoc(collection(db, 'tasks'), {
          ...taskData,
          createdAt: new Date()
        });
        toast({
          title: "Success",
          description: "Task created successfully!"
        });
        return;
      } catch (error) {
        console.error('Error creating task in Firestore:', error);
        setUseFirebase(false);
      }
    }

    // Fallback to localStorage
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveLocalTasks(updatedTasks);
    toast({
      title: "Success",
      description: "Task created successfully!"
    });
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (useFirebase) {
      try {
        await updateDoc(doc(db, 'tasks', taskId), updates);
        toast({
          title: "Task Updated",
          description: "Task has been updated successfully"
        });
        return;
      } catch (error) {
        console.error('Error updating task in Firestore:', error);
        setUseFirebase(false);
      }
    }

    // Fallback to localStorage
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    saveLocalTasks(updatedTasks);
    toast({
      title: "Task Updated",
      description: "Task has been updated successfully"
    });
  };

  const deleteTask = async (taskId: string) => {
    if (useFirebase) {
      try {
        await deleteDoc(doc(db, 'tasks', taskId));
        toast({
          title: "Task Deleted",
          description: "Task has been removed successfully"
        });
        return;
      } catch (error) {
        console.error('Error deleting task from Firestore:', error);
        setUseFirebase(false);
      }
    }

    // Fallback to localStorage
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveLocalTasks(updatedTasks);
    toast({
      title: "Task Deleted",
      description: "Task has been removed successfully"
    });
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    isUsingFirebase: useFirebase
  };
};
