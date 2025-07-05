import express from "express";
import mongoose from "mongoose";
import User from "../models/users.js";
import bcrypt from "bcrypt";

const userRouter = express.Router();

userRouter.get("/profile", async (req, res) => {
    const userSession = req.session.user;

    //session validation
    if (!userSession || !mongoose.Types.ObjectId.isValid(userSession.id)) {
        return res.status(401).send("Unauthorized or invalid user ID");  // Unauthorized if not logged in
    }

    try {
        const user = await User.findById(userSession.id).select("-password");
        if (!user) return res.status(404).send("User not found");

        const order = {
            orderId: "123456",
            date: "2025-07-03",
            status: "Ongoing",
            address: user.address,
            total: "₱300.00"
        };

        res.render("users/profile", { user, order });
    } catch (err) {
        console.error("Profile error:", err);
        res.status(500).send("Server error");
    }
});

userRouter.put('/profile', async (req,res)=>{
    const userId =req.session.user?.id;
    if(!userId){
        return res.status(401).send("Unauthorized");
    }
    const {firstName, lastName, email, contactNumber,age, address, password} = req.body;

    try{
        const updatedUser = {
            firstName,
            lastName,
            email,
            contactNumber,
            age,
            address,
            password: password? await bcrypt.hash(password, 10) : undefined
        };

        const user = await User.findByIdAndUpdate(userId, updatedUser,{new: true});

          if (!user) {
            return res.status(404).send("User not found");
        }

        // Send back updated user data (without password)
    res.status(200).json({
        message: "Profile updated successfully",
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            address: user.address,
            contactNumber: user.contactNumber,
            email: user.email
        }   
    });
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).send("Server error");
    }
});



export default userRouter;

