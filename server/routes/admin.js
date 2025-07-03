import express from "express";
import User from "../models/users.js"; 
const router = express.Router();

// Render Admin Users Page 
router.get("/users", async (req, res) => {
  try {
    const users = await User.find(); 
    res.render("admin/adminusers", {
      page: "users",
      users, 
    });
  } catch (err) {
    console.error("Error loading users:", err);
    res.status(500).send("Server error");
  }
});

// Render Admin Menu Page
router.get("/menu", (req, res) => {
  res.render("admin/adminmenu", { page: "menu" });
});

// Render Admin Orders Page
router.get("/orders", (req, res) => {
  res.render("admin/adminorders", { page: "orders" });
});

// Render Admin Feedback Page
router.get("/feedback", (req, res) => {
  res.render("admin/adminfeedback", { page: "feedback" });
});

export default router;
