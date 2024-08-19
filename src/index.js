import React, { useState, useEffect } from 'react';
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
        <div id="login-section">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <button
            onClick={() => {
              if (username.trim()) {
                localStorage.setItem('username', username);
              }
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div id="task-section">
        <h1>Welcome, {username}</h1>
        <button onClick={handleLogout}>Logout</button>
        <input
          type="text"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          placeholder="Task Description"
        />
        <input
          type="date"
          value={task.date}
          onChange={(e) => setTask({ ...task, date: e.target.value })}
        />
        <select
          value={task.status}
          onChange={(e) => setTask({ ...task, status: e.target.value })}
        >
          <option value="Info">Info</option>
          <option value="Task">Task</option>
        </select>
        <select
          value={task.shift}
          onChange={(e) => setTask({ ...task, shift: e.target.value })}
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
          placeholder="Relevancy Days"
        />
        <button onClick={handleAddTask}>Add Task</button>

        <ul>
          {tasks.map((task, index) => (
            <li key={task.id}>
              <div>{task.description}</div>
              <div>{task.date}</div>
              <div>{task.endDate}</div>
              <div>{task.status}</div>
              <div>{task.shift}</div>
              <button onClick={() => handleRemoveTask(task.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
