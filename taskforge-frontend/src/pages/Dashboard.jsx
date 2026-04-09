// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import * as api from "../services/api";
import ProfileMenu from "../components/ProfileMenu";
import TaskList from "../components/TaskList";
import Analytics from "../components/Analytics";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("new");

  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });

  // 🔹 Fetch tasks
  const fetchTasks = async () => {
    try {
      const data = await api.getTasks();
      const taskList = Array.isArray(data) ? data : [];
      setTasks(taskList);
      setFiltered(taskList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔹 Socket.IO: Real-time reminders
  useEffect(() => {
    const userId = localStorage.getItem("userId"); // save userId on login
    if (!userId) return;

    const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:3000"); // Use environment variable
    socket.emit("register", userId);

    socket.on("reminder", (data) => {
      toast.info(
        `Reminder: ${data.message} (Due: ${new Date(data.dueDate).toLocaleString()})`
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 🔍 Filter + Sort
  useEffect(() => {
    let temp = [...tasks];

    if (search) temp = temp.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    if (priority !== "all") temp = temp.filter(t => t.priority === priority);
    if (status !== "all") temp = temp.filter(t => status === "completed" ? t.completed : !t.completed);

    if (sort === "new") temp.reverse();
    else if (sort === "due") temp.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    setFiltered(temp);
  }, [search, priority, status, sort, tasks]);

  // ➕ Add or Update Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) await api.updateTask(editingTask._id, newTask);
      else await api.addTask(newTask);

      setNewTask({ title: "", description: "", dueDate: "", priority: "medium" });
      setEditingTask(null);
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Toggle Complete
  const toggleComplete = async (task) => {
    await api.updateTask(task._id, { completed: !task.completed });
    fetchTasks();
  };

  // ❌ Delete
  const deleteTask = async (id) => {
    await api.deleteTask(id);
    fetchTasks();
  };

  // ✏️ Edit
  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate?.slice(0, 10),
      priority: task.priority,
    });
  };

  return (
    <div className="dashboard">
      {/* 👤 Profile */}
      <ProfileMenu onLogout={onLogout} />

      <h1 className="title">TaskForge Dashboard</h1>

      {/* Analytics */}
      <Analytics tasks={tasks} />

      {/* 🔍 Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select onChange={(e) => setPriority(e.target.value)} value={priority}>
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select onChange={(e) => setStatus(e.target.value)} value={status}>
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
        <select onChange={(e) => setSort(e.target.value)} value={sort}>
          <option value="new">Newest</option>
          <option value="due">Due Date</option>
        </select>
        <button
          onClick={() => {
            setEditingTask(null);
            setNewTask({ title: "", description: "", dueDate: "", priority: "medium" });
            setShowModal(true);
          }}
        >
          + Add Task
        </button>
      </div>

      {/* 📋 Task List */}
      <TaskList tasks={filtered} onToggle={toggleComplete} onDelete={deleteTask} onEdit={handleEdit} />

      {/* 🪟 Add/Edit Task Modal */}
      {showModal && (
        <div className="modal">
          <form className="modal-content" onSubmit={handleAddTask}>
            <h2>{editingTask ? "Edit Task" : "Add Task"}</h2>

            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <div className="modal-buttons">
              <button type="submit">{editingTask ? "Update" : "Add"}</button>
              <button type="button" onClick={() => { setShowModal(false); setEditingTask(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* 🔔 Toast notifications */}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}