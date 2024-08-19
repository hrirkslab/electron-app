import React, { useState } from 'react';

const TaskForm = ({ addTask }) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState('Frühdienst');
  const [status, setStatus] = useState('Info');
  const [relevancyDays, setRelevancyDays] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + relevancyDays);

    const newTask = {
      id: Date.now(),
      description,
      date,
      endDate: endDate.toISOString().split('T')[0],
      status,
      shift,
      timestamp: new Date().toLocaleString(),
      readBy: [],
      createdBy: localStorage.getItem('username'),
      done: false,
    };

    addTask(newTask);
    setDescription('');
    setRelevancyDays(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Similar form fields as in the original design */}
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <select value={shift} onChange={(e) => setShift(e.target.value)}>
        <option value="Frühdienst">Frühdienst</option>
        <option value="Spätdienst">Spätdienst</option>
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Info">Info</option>
        <option value="Task">Task</option>
      </select>
      <input
        type="number"
        value={relevancyDays}
        onChange={(e) => setRelevancyDays(e.target.value)}
        placeholder="Relevancy Days"
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
