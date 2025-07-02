import express from "express";
const userRouter = express.Router();
import User from "../models/users.js";

// Create a new user
userRouter.post("/", async (req, res) => {
    try {
        const user = await User.create(req.body);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Get user by ID
userRouter.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id);
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        return res.status(400).json({ error: "Invalid ID format" });
    }
});

export default userRouter;
