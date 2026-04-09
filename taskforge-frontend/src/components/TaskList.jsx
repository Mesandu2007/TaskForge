import React from "react";
import TaskCard from "./TaskCard";
import "./TaskList.css";

export default function TaskList({ tasks, onToggle, onDelete, onEdit }) {
  return (
    <div className="task-grid">
      {tasks.map(task => (
        <TaskCard
          key={task._id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}

        />
      ))}
    </div>
  );
}