import express from "express";
import bcrypt from "bcrypt";
import User from "../../models/users.js";

const adminRouter = express.Router();

// GET all users
adminRouter.get("/usersAccounts", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

// POST add user
adminRouter.post("/users", async (req, res) => {
    try {
        const {
        userType,
        firstName,
        lastName,
        email,
        contactNumber,
        password,
        age,
        address
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
        userType,
        firstName,
        lastName,
        email,
        contactNumber,
        password: hashedPassword,
        age,
        address,
        });

        await newUser.save();
        res.status(201).json({ message: "User added successfully" });

    } catch (err) {
        res.status(500).json({ message: "Error creating user", error: err.message });
    }
});

// DELETE user
adminRouter.delete("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const deleted = await User.findByIdAndDelete(userId);

        if (!deleted) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });

    } catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err.message });
    }
});

// Render EJS views
adminRouter.get("/adminusers", (req, res) => {
    res.render("admin/adminusers");
});

adminRouter.get("/adminmenu", (req, res) => {
    res.render("admin/adminmenu");
});

adminRouter.get("/adminorders", (req, res) => {
    res.render("admin/adminorders");
});

adminRouter.get("/adminfeedback", (req, res) => {
    res.render("admin/adminfeedback");
});

export default adminRouter;
