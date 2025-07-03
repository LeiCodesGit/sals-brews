import express from "express";

import Product from "../models/products.js";
import failIfUnauthorizedAdmin from "../middlewares/failIfUnauthorizedAdmin.js";

const productRouter = express.Router();

// Get all available products
productRouter.get("/", async (req, res) => {

  try {
    const products = await Product.find({ isAvailable: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Add new product
productRouter.post("/", failIfUnauthorizedAdmin, async (req, res) => {

  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (error) {
    res.status(400).json({
  message: "Failed to add product",
  error: error.message,
  stack: error.stack
});
  }
});

// Delete product
productRouter.delete("/:id", failIfUnauthorizedAdmin, async (req, res) => {

  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

export default productRouter;