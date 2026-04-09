import React from "react";
import "./Analytics.css";

import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Analytics({ tasks }) {

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  // 🥧 Priority Data
  const priorityData = [
    { name: "Low", value: tasks.filter(t => t.priority === "low").length },
    { name: "Medium", value: tasks.filter(t => t.priority === "medium").length },
    { name: "High", value: tasks.filter(t => t.priority === "high").length },
  ];

  // 📊 Status Data
  const statusData = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <div className="analytics">


      {/* 🔢 Stats */}
      <div className="stats-grid">
        <div className="card">Total: {total}</div>
        <div className="card">Completed: {completed}</div>
        <div className="card">Pending: {pending}</div>
        <div className="card">
          Done: {total ? Math.round((completed / total) * 100) : 0}%
        </div>
      </div>

      {/* 📊 Charts */}
      <div className="charts">

        {/* 🥧 Pie Chart */}
        <div className="chart-box">
          <h3>Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={priorityData}
                dataKey="value"
                outerRadius={80}
                label
              >
                {priorityData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 Bar Chart */}
        <div className="chart-box">
          <h3>Task Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}