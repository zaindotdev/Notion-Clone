import { Server as NetServer, Socket } from "net";
import { Server as httpServer } from "http";
import { type NextApiResponse, NextApiRequest } from "next";
import { Server as SocketIOServer } from "socket.io";
import { EVENTS } from "@/lib/constants";

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

    socket.on(EVENTS.JOIN_ROOM, (roomId) => {
      console.log("🟩 User joined room:", roomId);
      socket.join(roomId);
    });

    socket.on(EVENTS.SEND_CHANGES, (data, fileId) => {
      console.log("📨 Receiving changes from client:", data);
      if (!fileId) {
        console.error("❌ No fileId provided, ignoring event");
        return;
      }
      io.in(fileId).emit(EVENTS.RECEIVE_CHANGES, data);
    });

    socket.on(EVENTS.CURSOR_MOVEMENT, (cursorId, fileId, range) => {
      io.in(fileId).emit(EVENTS.REVEIVE_CURSOR_MOVEMENT, cursorId, range);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ User disconnected:", reason);
    });
  });

  res.socket.server.io = io;
  res.end();
}
