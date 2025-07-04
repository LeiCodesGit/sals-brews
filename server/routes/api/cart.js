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
        const cart = await Cart.findOne({ user_id: req.session.user.id }).populate("items.productId");
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch cart", error: err.message });
    }
});

// POST add item to cart
cartRouter.post("/", async (req, res) => {
    const { productId, quantity, selectedSize, selectedTemp, selectedAddons} = req.body;

    try {
        let cart = await Cart.findOne({ user_id: req.session.user.id });
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const sizePrice = product.sizes?.find(s => s.label === selectedSize)?.price || 0;
        const addonPrice = product.addons
        ?.filter(addon => selectedAddons?.includes(addon.name))
        .reduce((sum, a) => sum + a.price, 0) || 0;

        const basePrice = product.price;
        const totalPrice = (basePrice + sizePrice + addonPrice) * quantity;

        const newItem = { productId, quantity, selectedSize, selectedTemp, selectedAddons, totalPrice };

        if (!cart) {
            cart = new Cart({
            user_id: req.session.user.id,
            items: [newItem]
            });
        } else {
            cart.items.push(newItem);
        }

        await cart.save();
        res.status(200).json({ message: "Item added to cart", cart });

    } catch (err) {
        console.error("Error saving to cart:", err);
        res.status(500).json({ message: "Failed to add to cart", error: err.message });
    }
});




// PUT update quantity of an item
cartRouter.put("/", async (req, res) => {
    const { productId, quantity, selectedSize, selectedTemp, selectedAddons } = req.body;

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

cartRouter.get("/cart", redirectIfNotLoggedIn, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.session.user.id }).populate("items.productId");
        res.render("users/cart", { cart: cart || { items: [] } });
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to load cart");
    }
});

export default cartRouter;
