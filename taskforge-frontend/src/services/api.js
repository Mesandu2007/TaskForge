import axios from "axios";

const API_URL = "http://localhost:3000"; // backend URL

const api = axios.create({
  baseURL: API_URL,
});

// Auth token setup
export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

// Auth routes
export const login = (email, password) => api.post("/auth/login", { email, password });
export const register = (email, password, name) => api.post("/auth/register", { email, password, name });
export const forgotPassword = (email) => api.post("/auth/forgot-password", { email });
export const resetPassword = (token, password) => api.post(`/auth/reset-password/${token}`, { password });

// Task routes
export const getTasks = () => api.get("/tasks").then(res => res.data);
export const addTask = (taskData) => api.post("/tasks", taskData).then(res => res.data);
export const updateTask = (id, updateData) => api.put(`/tasks/${id}`, updateData).then(res => res.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then(res => res.data);

export default api;