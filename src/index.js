import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import SupabaseService from './SupaBaseService';
import './App.css';

function App() {
  const [task, setTask] = useState({
    description: '',
    date: new Date().toISOString().split('T')[0], // Default to today's date
    status: 'Task',
    shift: 'FD',
    relevancy: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [inputUsername, setInputUsername] = useState(''); // Separate state for username input
  const [filter, setFilter] = useState('all');

  // db connection
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;


  const supabaseService = new SupabaseService(supabaseUrl, supabaseAnonKey);

  const dataToSave = {
    name: 'John Doe',
    email: 'johndoe@example.com',
  };

  supabaseService.saveData('test_data', dataToSave)
    .then(data => console.log('Data saved:', data))
    .catch(error => console.error('Error saving data:', error));
  // eof db conn

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  const handleAddTask = () => {
    if (task.description.trim()) {
      const newTask = {
        ...task,
        id: Date.now(),
        endDate: calculateEndDate(task.date, task.relevancy),
        createdBy: username,
        done: false,
        readBy: [],
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTask({
        description: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Task',
        shift: 'FD',
        relevancy: 0,
      });
    }
  };

  const handleRemoveTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const calculateEndDate = (date, relevancy) => {
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + relevancy);
    return endDate.toISOString().split('T')[0];
  };

  const handleMarkAsRead = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, readBy: [...task.readBy, username] } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleMarkAsDone = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, done: true } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleEditTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    setTask(taskToEdit);
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleRemoveDoneTasks = () => {
    const updatedTasks = tasks.filter(task => !task.done);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'todo') return task.status === 'Task' && !task.done;
    if (filter === 'info') return task.status === 'Info';
    if (filter === 'done') return task.done;
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('');
  };

  const handleLogin = () => {
    if (inputUsername.trim()) {
      localStorage.setItem('username', inputUsername);
      setUsername(inputUsername);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (!username) {
    return (
      <div className="App">
        <h1 className="text-4xl font-bold text-center mb-8">Übergabebuch Management</h1>
        <div className="max-w-sm mx-auto my-8">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <input
            type="text"
            id="username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            onClick={handleLogin}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Übergabebuch Management</h1>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Welcome, {username}</h2>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Logout</button>
      </div>

      {/* Task input form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          placeholder="Task Description"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <input
          type="date"
          value={task.date}
          onChange={(e) => setTask({ ...task, date: e.target.value })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <select
          value={task.status}
          onChange={(e) => setTask({ ...task, status: e.target.value })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="Info">Info</option>
          <option value="Task">Task</option>
        </select>
        <select
          value={task.shift}
          onChange={(e) => setTask({ ...task, shift: e.target.value })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="FD">Frühdienst</option>
          <option value="SD">Spätdienst</option>
          <option value="ND">Nachtdienst</option>
          <option value="ALLE">ALLE</option>
        </select>
        <input
          type="number"
          value={task.relevancy}
          onChange={(e) => setTask({ ...task, relevancy: e.target.value })}
          placeholder="Relevancy (days)"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button onClick={handleAddTask} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Add Task
        </button>
      </div>

      {/* Filter buttons */}
      <div className="flex space-x-2 mb-4">
        <button onClick={() => setFilter('all')} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">All</button>
        <button onClick={() => setFilter('todo')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Todo</button>
        <button onClick={() => setFilter('info')} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Info</button>
        <button onClick={() => setFilter('done')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Done</button>
        <button onClick={handleRemoveDoneTasks} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Remove Done</button>
      </div>

      {/* Task list */}
      <ul className="space-y-4">
        {filteredTasks.map((task) => (
          <li key={task.id} className={`bg-white shadow-md rounded-lg p-4 flex flex-col border-l-4 ${task.status === 'Info' ? 'border-yellow-500' : 'border-blue-500'} ${task.done ? 'opacity-50' : ''}`}>
            <h3 className={`text-lg font-semibold mb-2 ${task.done ? 'line-through' : ''}`}>{task.description}</h3>
            <div className="text-sm text-gray-500 space-y-1">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-calendar-alt text-gray-400"></i>
                  <span>{task.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-calendar-check text-gray-400"></i>
                  <span>{task.endDate}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-clock text-gray-400"></i>
                  <span>{task.shift}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className={`fas ${task.status === 'Info' ? 'fa-info-circle' : 'fa-tasks'} text-gray-400`}></i>
                  <span>{task.status}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-user text-gray-400"></i>
                  <span>{task.createdBy}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-eye text-gray-400"></i>
                  <span>{task.readBy.length > 0 ? task.readBy.join(", ") : "No one yet"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2">  {/* Modified line */}
              {!task.readBy.includes(username) && (
                <button onClick={() => handleMarkAsRead(task.id)} className="text-blue-500 hover:text-blue-700">
                  <i className="fas fa-eye"></i>
                </button>
              )}
              {task.status === 'Task' && !task.done && (
                <button onClick={() => handleMarkAsDone(task.id)} className="text-green-500 hover:text-green-700">
                  <i className="fas fa-check"></i>
                </button>
              )}
              <button onClick={() => handleEditTask(task.id)} className="text-yellow-500 hover:text-yellow-700">
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={() => handleRemoveTask(task.id)} className="text-red-500 hover:text-red-700">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Export and Delete All buttons */}
      <div className="mt-8 flex justify-between">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Export
        </button>
        <button onClick={() => setTasks([])} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Delete All
        </button>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);