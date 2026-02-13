import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function protectRoute(req, res, next) {
    try {
        const token = req.cookies?.jwt;
        if (!token) return res.status(401).json({ message: "Not Authorized", success: false });
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(401).json({ message: "Not Authorized", success: false });
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or Expired token" });
    }
}