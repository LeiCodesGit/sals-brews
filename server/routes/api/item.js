import express from "express";
import Product from "../../models/products.js";

const itemRouter = express.Router();

itemRouter.get("/:id", async (req, res) => {
    try {
        const item = await Product.findById(req.params.id); // uses MongoDB _id
        if (!item) return res.status(404).send("Item not found");

        res.render("users/itempage", { item });
    } catch (err) {
        console.error("Error loading item:", err);
        res.status(500).send("Server error");
    }
});

export default itemRouter;
