// Socket server setup: handles realtime connections
import { Server } from "socket.io";
import express from "express";
import http from "http";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app); // HTTP server required for socket.io
// Initialize socket server with CORS
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
});

io.use(socketAuthMiddleware); // Authenticate every socket connection
const userSocketMap = new Map();  // Map<userId, socketId> for tracking online users

// On successful socket connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.user.fullName);
    userSocketMap.set(socket.userId, socket.id); // Save user → socket mapping
    io.emit("onlineUsers", [...userSocketMap.keys()]); // Broadcast online users list
    // When user disconnects
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.user.fullName);
        userSocketMap.delete(socket.userId); // Remove user from map
        io.emit("onlineUsers", [...userSocketMap.keys()]); // Broadcast updated online users
    });
});

// Get receiver's socket id for private emits
export function getReceiverSocketId(userId) {
    return userSocketMap.get(userId);
}

// Export server utilities
export { io, app, server };