import React from 'react';

const Filters = ({ filterTasks }) => {
  return (
    <div className="filters">
      <button onClick={() => filterTasks('all')}>All</button>
      <button onClick={() => filterTasks('todo')}>Todo</button>
      <button onClick={() => filterTasks('info')}>Info</button>
      <button onClick={() => filterTasks('done')}>Done</button>
    </div>
  );
};

export default Filters;
