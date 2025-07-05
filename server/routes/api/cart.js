import express from "express";
import Cart from "../../models/cart.js";
import Product from "../../models/products.js";
import redirectIfNotLoggedIn from "../../middlewares/redirectIfNotLoggedIn.js";

const cartRouter = express.Router();

cartRouter.use(redirectIfNotLoggedIn);

// GET current user's cart (JSON)
cartRouter.get("/", async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.session.user.id }).populate("items.productId");
        res.json(cart || { items: [] });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch cart", error: err.message });
    }
});

// Render cart EJS view
cartRouter.get("/cart", async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.session.user.id }).populate("items.productId");
        res.render("users/cart", { cart: cart || { items: [] } });
    } catch (err) {
        res.status(500).send("Failed to load cart");
    }
});

// POST: Add item to cart
cartRouter.post("/", async (req, res) => {
    const { productId, quantity, selectedSize, selectedTemp, selectedAddons } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const sizePrice = product.sizes?.find(s => s.label === selectedSize)?.price || 0;
        const addonPrice = product.addons?.filter(a => selectedAddons?.includes(a.name))
            .reduce((sum, a) => sum + a.price, 0) || 0;
        const basePrice = product.price;
        const totalPrice = (basePrice + sizePrice + addonPrice) * quantity;

        let cart = await Cart.findOne({ user_id: req.session.user.id });
        const newItem = { productId, quantity, selectedSize, selectedTemp, selectedAddons, totalPrice };

        if (!cart) {
            cart = new Cart({ user_id: req.session.user.id, items: [newItem] });
        } else {
            cart.items.push(newItem);
        }

        await cart.save();
        res.status(200).json({ success: true, message: "Item added to cart", cart });

    } catch (err) {
        console.error("Add to cart failed:", err);
        res.status(500).json({ success: false, message: "Failed to add to cart" });
    }
});

export default cartRouter;