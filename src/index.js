import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm'
import TaskList from './TaskList';
import Filters from './Filters';
import './App.css'; // Assuming custom CSS for styling

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('username') || '');

  useEffect(() => {
    if (localStorage.getItem('tasks')) {
      setTasks(JSON.parse(localStorage.getItem('tasks')));
    }
  }, []);

  const addTask = (task) => {
    setTasks([...tasks, task]);
    localStorage.setItem('tasks', JSON.stringify([...tasks, task]));
  };

  const filterTasks = (filter) => {
    setFilter(filter);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'todo') return task.status === 'Task' && !task.done;
    if (filter === 'info') return task.status === 'Info';
    if (filter === 'done') return task.done;
    return true;
  });

  const handleLogin = (username) => {
    setCurrentUser(username);
    localStorage.setItem('username', username);
  };

  const handleLogout = () => {
    setCurrentUser('');
    localStorage.removeItem('username');
  };

  return (
    <div className="app-container">
      {!currentUser ? (
        <Login handleLogin={handleLogin} />
      ) : (
        <div>
          <header>
            <h1>Welcome, {currentUser}</h1>
            <button onClick={handleLogout}>Logout</button>
          </header>
          <TaskForm addTask={addTask} />
          <Filters filterTasks={filterTasks} />
          <TaskList tasks={filteredTasks} />
        </div>
      )}
    </div>
  );
};

export default App;
