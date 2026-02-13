import express from "express";
import { login,signup,me,logout,updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProjection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProjection); // Middleware to rate limit

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);

router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, data: req.user })
});
router.get("/test", (req, res) => { // Test for Working of Arcjet for rate limiting,etc.
    res.status(200).json({message:"Test Route"})
})

export default router;