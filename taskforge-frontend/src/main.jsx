import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import { SocketProvider } from './context/SocketContext';

// 🔑 get userId from JWT
const token = localStorage.getItem("token");
let userId = null;

if (token) {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    userId = decoded.id;
  } catch (err) {
    console.error("Invalid token");
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider userId={userId}>
      <App />
    </SocketProvider>
  </StrictMode>,
);