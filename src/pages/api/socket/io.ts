import { Server as NetServer, Socket } from "net";
import { Server as httpServer } from "http";
import { type NextApiResponse, NextApiRequest } from "next";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io?: SocketIOServer; // <-- Make it optional to check initialization
    };
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    console.log("⚠️ Socket.io server already initialized");
    res.end();
    return;
  }

  console.log("✅ Initializing new Socket.IO server...");
  const http: httpServer = res.socket.server as any;
  const io = new SocketIOServer(http, {
    path: "/api/socket/io",
    addTrailingSlash: false,
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 A user connected:", socket.id);

    socket.on("join-room", (roomId) => {
      console.log("🟩 User joined room:", roomId);
      socket.join(roomId);
    });

    socket.on("send-changes", (data, fileId) => {
      console.log("📨 Receiving changes from client:", data);
      if (!fileId) {
        console.error("❌ No fileId provided, ignoring event");
        return;
      }
      io.emit("receive-changes", data);
    });

    socket.on("cursor-movement", (cursorId, fileId, range) => {
      socket.to(fileId).emit("cursor-movement", cursorId, range);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ User disconnected:", reason);
    });
  });

  res.socket.server.io = io;
  res.end();
}
