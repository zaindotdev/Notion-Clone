"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};
const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  socket: null,
});

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_CLIENT_URL, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });
    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err: any) => {
      console.error(err);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
