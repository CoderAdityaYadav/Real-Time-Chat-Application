import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isLogginOut: false,
    socket: null,
    onlineUsers: [],

    async checkAuth() {
        try {
            const res = await axiosInstance.get("/api/auth/me");
            set({ authUser: res.data.data });
            get().connectSocket(); // Connect to Socket
        } catch (error) {
            console.log("Error in AuthCheck:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    async signup(data) {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/api/auth/signup", data);
            set({ authUser: res.data.data });
            toast.success("Account created Successfully!");
            get().connectSocket(); // Connect to Socket
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    async login(data) {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/api/auth/login", data);
            set({ authUser: res.data.data });
            toast.success("Logged In Successfully");
            get().connectSocket(); // Connect to Socket
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    async updateProfile(data) {
        try {
            const res = await axiosInstance.put(
                "/api/auth/update-profile",
                data,
            );
            set({ authUser: res.data.data });
            toast.success("Profile Update Successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    async logout() {
        set({ isLogginOut: true });
        try {
            await axiosInstance.post("/api/auth/logout");
            set({ authUser: null });
            toast.success("Logged Out Successfully");
            get().disconnectSocket(); // Disconnect to Socket
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLogginOut: false });
        }
    },

    connectSocket() {
        // Calling When Loggin In or Signing Up
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(import.meta.env.VITE_BACKEND_URL, {
            withCredentials: true,
        });

        socket.connect();
        set({ socket: socket });

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });
        socket.on("connect_error", (err) => {
            console.log("Socket connection failed:", err.message);
        });
        socket.on("onlineUsers", (ids) => {
            console.log("Received online users:", ids);
            set({ onlineUsers: ids });
        });
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds }); // Listen for online Users event
        });
    },

    disconnectSocket() {
        // CAlling When Logging Out
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
