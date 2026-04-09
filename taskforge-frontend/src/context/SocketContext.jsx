// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const s = io("http://localhost:3000"); 
    setSocket(s);

    // register user for reminders
    s.emit("register", userId);

    return () => {
      s.disconnect();
    };
  }, [userId]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};