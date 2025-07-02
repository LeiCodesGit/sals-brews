import express from "express";
import User from "../../models/users.js";

const authRouter = express.Router();

// Render login page
authRouter.get("/login", (req, res) => {
    res.render("auth/login");
});

// Render register page
authRouter.get("/register", (req, res) => {
    res.render("auth/register");
});

// Handle login POST request
authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
        }

        return res.status(200).json({ message: "Login successful", userId: user._id });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

export default authRouter;
