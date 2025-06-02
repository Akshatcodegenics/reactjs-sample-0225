
import { render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Board from '@/pages/Board';

// Mock the toast hook
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  toast: mockToast,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('TaskBoard', () => {
  beforeEach(() => {
    localStorage.clear();
    mockToast.mockClear();
  });

  test('renders task board with columns', () => {
    render(<Board />, { wrapper: createWrapper() });
    
    expect(screen.getByText('Task Board')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('opens create task dialog when add task button is clicked', async () => {
    render(<Board />, { wrapper: createWrapper() });
    
    const addButton = screen.getByText('Add Task');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });
  });

  test('creates a new task', async () => {
    render(<Board />, { wrapper: createWrapper() });
    
    // Open dialog
    const addButton = screen.getByText('Add Task');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });
    
    // Fill form
    const titleInput = screen.getByPlaceholderText('Task title');
    const descriptionInput = screen.getByPlaceholderText('Task description');
    
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    
    // Submit
    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
  });

  test('displays task count in columns', () => {
    // Pre-populate localStorage with tasks
    const tasks = [
      { id: '1', title: 'Task 1', description: 'Desc 1', status: 'todo', priority: 'high', createdAt: new Date() },
      { id: '2', title: 'Task 2', description: 'Desc 2', status: 'in-progress', priority: 'medium', createdAt: new Date() }
    ];
    localStorage.setItem('taskboard-tasks', JSON.stringify(tasks));
    
    render(<Board />, { wrapper: createWrapper() });
    
    expect(screen.getByText('1')).toBeInTheDocument(); // Todo count
    expect(screen.getByText('1')).toBeInTheDocument(); // In Progress count
  });
});
