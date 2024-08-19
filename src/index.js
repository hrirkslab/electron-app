import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
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

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('');
  };

  if (!username) {
    return (
      <div className="App">
        <div className="max-w-sm mx-auto my-8">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            onClick={() => {
              if (username.trim()) {
                localStorage.setItem('username', username);
              }
            }}
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
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {username}</h1>
        <button onClick={handleLogout} className="mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Logout</button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          placeholder="Task Description"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="task-date" className="block text-gray-700 text-sm font-bold mb-2">Date</label>
        <input
          type="date"
          value={task.date}
          onChange={(e) => setTask({ ...task, date: e.target.value })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="task-status" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
        <select
          value={task.status}
          onChange={(e) => setTask({ ...task, status: e.target.value })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="Info">Info</option>
          <option value="Task">Task</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="task-shift" className="block text-gray-700 text-sm font-bold mb-2">Shift</label>
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
      </div>

      <div className="mb-4">
        <label htmlFor="task-relevancy" className="block text-gray-700 text-sm font-bold mb-2">Relevancy (days)</label>
        <input
          type="number"
          value={task.relevancy}
          onChange={(e) => setTask({ ...task, relevancy: e.target.value })}
          placeholder="Enter relevancy days"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <button onClick={handleAddTask} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Add Task
      </button>

      <ul className="space-y-4 mt-6">
        {tasks.map((task, index) => (
          <li key={task.id} className={`bg-white shadow-md rounded-lg p-4 flex justify-between items-start border-l-4 ${task.status === 'Info' ? 'border-yellow-500' : 'border-blue-500'} ${task.done ? 'opacity-50' : ''}`}>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${task.done ? 'line-through' : ''}`}>{task.description}</h3>
              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span>{task.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>{task.endDate}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span>{task.shift}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>{task.status}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => handleRemoveTask(task.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline">
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
