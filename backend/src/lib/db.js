import mongoose from "mongoose"

export async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        const host = conn.connection.host;
        console.log(`Database connected: ${host}`);
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}