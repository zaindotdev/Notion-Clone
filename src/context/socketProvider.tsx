"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  socket: null,
});

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null); // 🔥 Keep a persistent instance
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (socketRef.current) return; // 🔄 Prevent multiple instances

    const socketInstance = io(process.env.NEXT_PUBLIC_CLIENT_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      autoConnect: true, // 🚀 Ensure auto-reconnect
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000, // Try reconnecting every 2s
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected to socket:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.warn("❌ Disconnected from socket:", reason);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("⚠️ Socket connection error:", err);
    });

    socketRef.current = socketInstance;

    return () => {
      console.log("🛑 Cleaning up socket connection");
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
