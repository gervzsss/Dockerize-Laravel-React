import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/axios';
import { useAuth } from './context/AuthContext';

// Todo type for reference:
// { id: number, text: string, completed: boolean }

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/todos');
      setTodos(response.data);
    } catch (err) {
      setError('Failed to fetch todos. Please try again.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setError(null);
      const response = await api.post('/todos', {
        text: input.trim(),
        completed: false,
      });
      setTodos([response.data, ...todos]);
      setInput('');
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error('Error adding todo:', err);
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      setError(null);
      const response = await api.put(`/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos((prev) => prev.map((t) => (t.id === id ? response.data : t)));
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    }
  };

  const removeTodo = async (id) => {
    try {
      setError(null);
      await api.delete(`/todos/${id}`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error('Error deleting todo:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">To-Do List</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Hello, {user?.name}!</span>
          <button
            onClick={handleLogout}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-md">
          {error}
        </div>
      )}

      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="px-3 py-2 border rounded shadow focus:outline-none"
          aria-label="Add new todo"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
          disabled={loading}
        >
          Add
        </button>
      </form>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <ul className="w-full max-w-md">
          {todos.length === 0 && (
            <li className="text-gray-500 text-center">No tasks yet!</li>
          )}
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-white rounded shadow mb-2 px-4 py-2"
            >
              <span
                className={
                  todo.completed
                    ? 'line-through text-gray-400'
                    : 'text-gray-800'
                }
                role="checkbox"
                aria-checked={todo.completed}
                tabIndex={0}
                onClick={() => toggleTodo(todo.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggleTodo(todo.id);
                }}
                style={{ cursor: 'pointer' }}
              >
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
                className="ml-4 text-red-500 hover:text-red-700"
                aria-label={`Delete ${todo.text}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
