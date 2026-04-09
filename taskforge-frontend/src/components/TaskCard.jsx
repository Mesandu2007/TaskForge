import React, { useState } from "react";
import "./TaskCard.css";

export default function TaskCard({ task, onToggle, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="task-card">

      <h4>{task.title}</h4>

      <p>
        {expanded
          ? task.description
          : task.description?.slice(0, 50) + "..."}
      </p>

      {expanded && (
        <>
          <p>Status: {task.completed ? "Completed" : "Pending"}</p>
          <p>Due: {task.dueDate?.slice(0, 10)}</p>
          <p>Priority: {task.priority}</p>
        </>
      )}

      <div className="task-actions">
        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? "Hide" : "View"}
        </button>
        <button onClick={() => onEdit(task)}>
            Edit
        </button>




        <button onClick={() => onToggle(task)}>
          {task.completed ? "Undo" : "Complete"}
        </button>

        <button className="delete" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}