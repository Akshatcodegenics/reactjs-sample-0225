
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X, Edit, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  assignee?: string;
}

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem('taskboard-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem('taskboard-tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const createTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      createdAt: new Date()
    };

    const updatedTasks = [...tasks, task];
    saveTasks(updatedTasks);

    setNewTask({ title: '', description: '', priority: 'medium' });
    setIsCreateDialogOpen(false);

    toast({
      title: "Success",
      description: "Task created successfully!"
    });
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    saveTasks(updatedTasks);

    toast({
      title: "Task Updated",
      description: `Task moved to ${newStatus.replace('-', ' ')}`
    });
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);

    toast({
      title: "Task Deleted",
      description: "Task has been removed successfully"
    });
  };

  const updateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    saveTasks(updatedTasks);
    setEditingTask(null);

    toast({
      title: "Task Updated",
      description: "Task has been updated successfully"
    });
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const columns = [
    { id: 'todo', title: 'To Do', tasks: getTasksByStatus('todo') },
    { id: 'in-progress', title: 'In Progress', tasks: getTasksByStatus('in-progress') },
    { id: 'completed', title: 'Completed', tasks: getTasksByStatus('completed') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Dashboard</Link>
              <Link to="/board" className="text-blue-600 font-medium">Board</Link>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">Profile</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Project Tasks</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <Textarea
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <Select value={newTask.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask({ ...newTask, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={createTask} className="w-full">Create Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900 flex items-center justify-between">
                  {column.title}
                  <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                    {column.tasks.length}
                  </span>
                </h3>
              </div>
              <div className="p-4 space-y-3 min-h-[500px]">
                {column.tasks.map((task) => (
                  <Card key={task.id} className={`border-l-4 ${getPriorityColor(task.priority)} hover:shadow-md transition-shadow cursor-pointer`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingTask(task)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-gray-600 mb-3">{task.description}</p>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <Select value={task.status} onValueChange={(value: Task['status']) => updateTaskStatus(task.id, value)}>
                          <SelectTrigger className="w-24 h-6 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Edit Task Dialog */}
        {editingTask && (
          <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
                <Textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                />
                <Select value={editingTask.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setEditingTask({ ...editingTask, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => updateTask(editingTask)} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
};

export default TaskBoard;
