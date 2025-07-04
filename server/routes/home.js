import express from "express";
import Product from "../models/products.js";

const homeRouter = express.Router();

// Home page
homeRouter.get("/", async (req, res) => {
try {
    const products = await Product.find({ isAvailable: true });
    res.render("home", { products });
} catch (err) {
    console.error("Failed to load products for home:", err);
    res.render("home", { products: [] });
}
});

// Item page (Buy Now)
homeRouter.get("/itempage/:id", async (req, res) => {
try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).send("Product not found");

    res.render("users/itempage", { item }); // Use full path if views/users/itempage.ejs
} catch (err) {
    console.error("Error loading item:", err);
    res.status(500).send("Server error");
}
});

export default homeRouter; 
