import express from "express";
import bcrypt from "bcrypt";
import User from "../../models/users.js";
import failIfUnauthorizedAdmin from "../../middlewares/failIfUnauthorizedAdmin.js"; 
import redirectIfNotLoggedIn from "../../middlewares/redirectIfNotLoggedIn.js";

const adminRouter = express.Router();

// GET all users 
adminRouter.get("/users", redirectIfNotLoggedIn, failIfUnauthorizedAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

// POST add user 
adminRouter.post("/users", redirectIfNotLoggedIn, failIfUnauthorizedAdmin, async (req, res) => {
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
            address
        });

        await newUser.save();
        res.status(201).json({ message: "User added successfully" });

    } catch (err) {
        res.status(500).json({ message: "Error creating user", error: err.message });
    }
});

// PUT edit user 
adminRouter.put("/users/:id", redirectIfNotLoggedIn, failIfUnauthorizedAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const update = { ...req.body };

        if (update.password) {
            update.password = await bcrypt.hash(update.password, 10);
        } else {
            delete update.password;
        }

        const user = await User.findByIdAndUpdate(id, update, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User updated", user });
    } catch (err) {
        res.status(500).json({ message: "Error updating user", error: err.message });
    }
});

// DELETE user 
adminRouter.delete("/users/:id", redirectIfNotLoggedIn, failIfUnauthorizedAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const deleted = await User.findByIdAndDelete(userId);

        if (!deleted) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err.message });
    }
});

// Admin page views 
adminRouter.get("/adminusers", redirectIfNotLoggedIn, failIfUnauthorizedAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.render("admin/adminusers", { users });
    } catch (err) {
        console.error("Error rendering adminusers:", err);
        res.status(500).send("Error loading admin users");
    }
});

adminRouter.get("/adminmenu", redirectIfNotLoggedIn, failIfUnauthorizedAdmin, (req, res) => {
    res.render("admin/adminmenu");
});

adminRouter.get("/adminorders", redirectIfNotLoggedIn, failIfUnauthorizedAdmin, (req, res) => {
    res.render("admin/adminorders");
});

adminRouter.get("/adminfeedback", redirectIfNotLoggedIn, failIfUnauthorizedAdmin, (req, res) => {
    res.render("admin/adminfeedback");
});

export default adminRouter;
