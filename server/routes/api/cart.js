import express from "express";
import Cart from "../../models/cart.js";
import Product from "../../models/products.js";
import redirectIfNotLoggedIn from "../../middlewares/redirectIfNotLoggedIn.js";

const cartRouter = express.Router();

// All routes below require user to be logged in
cartRouter.use(redirectIfNotLoggedIn);

// GET cart for the logged-in user
cartRouter.get("/", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.session.user.id }).populate("items.productId");
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch cart", error: err.message });
    }
});

// POST add item to cart
cartRouter.post("/", async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId: req.session.user.id });

        if (!cart) {
        cart = new Cart({
            userId: req.session.user.id,
            items: [{ productId, quantity }]
        });
        } else {
        const item = cart.items.find(i => i.productId.toString() === productId);
        if (item) {
            item.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }
        }

        await cart.save();
        res.status(200).json({ message: "Item added to cart", cart });
    } catch (err) {
        res.status(500).json({ message: "Failed to add to cart", error: err.message });
    }
});

// PUT update quantity of an item
cartRouter.put("/", async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId: req.session.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(i => i.productId.toString() === productId);
        if (!item) return res.status(404).json({ message: "Item not found in cart" });

        item.quantity = quantity;
        await cart.save();
        res.json({ message: "Quantity updated", cart });
    } catch (err) {
        res.status(500).json({ message: "Failed to update item", error: err.message });
    }
});

// DELETE item from cart
cartRouter.delete("/:productId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.session.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
        await cart.save();
        res.json({ message: "Item removed", cart });
    } catch (err) {
        res.status(500).json({ message: "Failed to remove item", error: err.message });
    }
});

// DELETE entire cart
cartRouter.delete("/", async (req, res) => {
    try {
        const result = await Cart.findOneAndDelete({ userId: req.session.user.id });
        if (!result) return res.status(404).json({ message: "Cart not found" });
        res.json({ message: "Cart cleared" });
    } catch (err) {
        res.status(500).json({ message: "Failed to clear cart", error: err.message });
    }
});

export default cartRouter;
