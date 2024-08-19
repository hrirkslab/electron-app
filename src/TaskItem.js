import React from 'react';

const TaskItem = ({ task }) => {
  return (
    <div className={`task-item ${task.status.toLowerCase()}`}>
      <h3>{task.description}</h3>
      <p>{task.date} - {task.endDate}</p>
      <p>{task.shift} - {task.status}</p>
      <p>Created by: {task.createdBy}</p>
      <p>Read by: {task.readBy.length > 0 ? task.readBy.join(', ') : 'No one yet'}</p>
    </div>
  );
};

export default TaskItem;
