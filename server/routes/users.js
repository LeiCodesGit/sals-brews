import express from "express";
const userRouter = express.Router();
import User from "../models/users.js";

userRouter.post("/users", async (req,res) => {
    const user = req.body;

    //create users to the database
    const result = await User.create(user);
    return res.status(201).json(result);
});
    
userRouter.get("/users/:id", async () => {
    const id = req.params.id;
    const errorMessage = null;

    try {
        const user = await User.findById(id);
        if (user) {
            return res.params.id;
        }

        errorMessage = "User not found";
    }
    catch (error) {
        errorMessage = "User not found or invalid id";
    }

    res.status(404).json({error: errorMessage});
});
export default userRouter;
