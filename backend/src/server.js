import "./lib/env.js";
import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

// const app = express();

app.use(express.json({limit:"5mb"}));
app.use(cors({
    credentials: true,
    origin:process.env.FRONTEND_URL
}))
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
    connectDB();
    console.log("Backend is running on PORT :", PORT);
})