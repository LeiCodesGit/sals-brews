import express from "express";

import Product from "../models/products.js";
import failIfUnauthorizedAdmin from "../middlewares/failIfUnauthorizedAdmin.js";

const productRouter = express.Router();

<<<<<<< HEAD
// Get all available products for user home/menu pages
productRouter.get("/", async (req, res) => {
=======
// Get all available products
productRouter.get("/", async (req, res) => {

>>>>>>> 6e2c63a73426c1004803a55ea4426f903b1f389f
  try {
    const products = await Product.find({ isAvailable: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Add new product
productRouter.post("/", failIfUnauthorizedAdmin, async (req, res) => {
<<<<<<< HEAD
=======

>>>>>>> 6e2c63a73426c1004803a55ea4426f903b1f389f
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (error) {
<<<<<<< HEAD
    res.status(400).json({ message: "Failed to add product", error });
  }
});

// Update product by ID
productRouter.put("/:id", failIfUnauthorizedAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated", product: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});

// Delete product by ID
productRouter.delete("/:id", failIfUnauthorizedAdmin, async (req, res) => {
=======
    res.status(400).json({
  message: "Failed to add product",
  error: error.message,
  stack: error.stack
});
  }
});

// Delete product
productRouter.delete("/:id", failIfUnauthorizedAdmin, async (req, res) => {

>>>>>>> 6e2c63a73426c1004803a55ea4426f903b1f389f
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

<<<<<<< HEAD
export default productRouter;
=======
export default productRouter;
>>>>>>> 6e2c63a73426c1004803a55ea4426f903b1f389f
