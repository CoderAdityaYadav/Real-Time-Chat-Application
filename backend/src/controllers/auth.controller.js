import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";

function generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
}

function sendToken(res, token) {
    return res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields are required." });
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Incorrect Email or Password" });;
        const isPassCorrect = await bcrypt.compare(password, user.password);
        if (!isPassCorrect) return res.status(400).json({ message: "Incorrect Email or Password" });
        const token = generateToken(user._id);
        sendToken(res, token);
        return res.status(200).json({
            success: true,
            message: "Successfully Logged In",
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic
            }
        });
    } catch (error) {
    console.log("Error in Login Controller", error.message);
        res.status(500).json("Error in Login Controller", error.message);
}
}

export async function signup(req, res) {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) return res.status(400).json({ success: false, message: "All fields are required" });
        if (password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({ success: false, message: "Invalid Email Format" });
        const oldUser = await User.findOne({ email });
        if (oldUser) return res.status(400).json({ success: false, message: "User already exists.Change email" });
        const newUser = await User.create({
            fullName, email, password
        });
        if (!newUser) return res.status(500).json({ success: false, message: "User was not created.Try again later" });
        const token = generateToken(newUser._id);
        sendToken(res, token);
        res.status(200).json({
            success: true, message: "Successfully Signed Up", data: {id:newUser._id,
            fullName:newUser.fullName,email:newUser.email,profilePic:newUser.profilePic
            }
        });
        // Send Welcome Email
        try {
            await sendWelcomeEmail(newUser.email, newUser.fullName, process.env.FRONTEND_URL);
        } catch (error) {
            console.error("Failed to send welcome Email:", error);
        }
    } catch (error) { 
        console.log("Error in signup Controller", error.message);
        res.status(500).json("Error in signup Controller", error.message);
    }
}

export function logout(req, res) {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully", success: true });
}

export function me(req, res) {
    return res.status(200).json({ success: true, message: "", data: req.user });
}

export async function updateProfile(req, res) {
    try {
        const { profilePic } = req.body;
        if (!profilePic) return res.status(400).json({ message: "Profile Pic is required" });
        const userId = req.user._id; 
        
        const secure_url = await uploadToCloudinary(profilePic, "profile_pics");
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: secure_url }, { new: true }).select("-password");
        res.status(200).json({ message: "Profile Pic updated Successfully", data: updatedUser });
    } catch (error) {
        console.log("Error in UpdateProfile Controller", error.message);
        res.status(500).json("Error in UpdateProfile Controller", error.message);
    }
}