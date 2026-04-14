import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, userId }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // ✅ create only once
    if (!socketRef.current) {
      const s = io("http://localhost:3000");

      socketRef.current = s;

    
      s.on("connect", () => {
        console.log("✅ Connected:", s.id);

        // 🔥 register AFTER connection
        s.emit("register", userId);
      });

      // 🔔 listen for reminders
      s.on("reminder", (data) => {
        console.log("🔔 Reminder received:", data);
        alert(data.message); // test
      });

      // optional debug
      s.on("disconnect", () => {
        console.log("❌ Disconnected");
      });
    }

    // ❌ DO NOT disconnect here
  }, [userId]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};