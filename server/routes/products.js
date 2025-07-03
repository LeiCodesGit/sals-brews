import express from "express";
import Product from "../models/products.js"; 
import failIfUnauthorizedAdmin from "../middlewares/failIfUnauthorizedAdmin.js";

<<<<<<< HEAD
const productRouter = express.Router();

// Get all available products for user home/menu pages
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
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
});

export default productRouter;
=======
const router = express.Router();

// Get all available products for user home/menu pages
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Add new product
router.post("/", failIfUnauthorizedAdmin, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (error) {
    res.status(400).json({ message: "Failed to add product", error });
  }
});

// Update product by ID
router.put("/:id", failIfUnauthorizedAdmin, async (req, res) => {
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
router.delete("/:id", failIfUnauthorizedAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

export default router;
>>>>>>> f61a4df34a05b5eba5a1b00384f5ef04a148a00c
