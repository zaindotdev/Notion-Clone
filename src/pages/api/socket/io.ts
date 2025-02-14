import { Server as NetServer, Socket } from "net";
import { Server as httpServer } from "http";
import { type NextApiResponse, NextApiRequest } from "next";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    console.log("Initializing new Socket.IO server...");
    const http: httpServer = res.socket.server as any;
    const io = new SocketIOServer(http, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      cors: {
        credentials: true,
        origin: "*",
      },
      pingTimeout: 60000,
    });

    io.on("connection", (socket) => {
      console.log("A user connected", socket.id);

      socket.on("join-room", (roomId) => {
        console.log("A user joined", roomId);
        socket.join(roomId);
      });

      socket.on("send-changes", (data, fileId) => {
        console.log("Receiving changes:", data);
        socket.to(fileId).emit("receive-changes", data);
      });

      socket.on("cursor-movement", (cursorId, fileId, range) => {
        socket.to(fileId).emit("cursor-movement", cursorId, range);
      });

      socket.on("disconnect", (reason) => {
        console.log("User disconnected", reason);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.io server already initialized");
  }

  res.end();
}
