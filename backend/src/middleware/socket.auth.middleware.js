/*
    SOCKET AUTH MIDDLEWARE
    -----------------------
    Purpose:
    Authenticate socket connection using JWT stored in cookies.
    Runs BEFORE connection is accepted.
*/

import jwt from "jsonwebtoken";
import cookie from "cookie"; // safer cookie parsing
import User from "../models/User.js";

export async function socketAuthMiddleware(socket, next) {
    try {
        /*
        Parse cookies safely
        socket.handshake.headers.cookie looks like:
        "jwt=abc123; theme=dark"
    */
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        const token = cookies.jwt; // Extract JWT token
        if (!token) { // Reject if token missing
            console.log("Socket rejected: No token");
            return next(new Error("Unauthorized - No Token"));
        }

        /*
        Verify JWT token
        If token is:
        - invalid
        - expired
        jwt.verify throws error automatically
    */
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        /*
        Fetch user from DB
        Remove password for security
    */
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            console.log("Socket rejected: User not found");
            return next(new Error("User not found"));
        }

        /*
        Attach user info to socket
        This allows access anywhere:
        socket.user
        socket.userId   */
        socket.user = user;
        socket.userId = user._id.toString();

        console.log(`Socket authenticated → ${user.fullName}`);

        // Allow connection
        next();
    } catch (err) {
        /*
        Any error here = authentication failed

        Possible causes:
        - expired token
        - invalid signature
        - malformed token
        - database failure
    */
        console.log("Socket auth error:", err.message);
        next(new Error("Unauthorized"));
    }
}
