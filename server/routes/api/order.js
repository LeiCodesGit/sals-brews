import express from "express";
import Order from "../../models/order.js";
import Cart from "../../models/cart.js";
import User from "../../models/users.js";
import redirectIfNotLoggedIn from "../../middlewares/redirectIfNotLoggedIn.js";

const orderRouter = express.Router();

orderRouter.use(redirectIfNotLoggedIn);

orderRouter.post("/cart/checkout", async (req, res) => {
    const userId = req.session.user.id;
    try {
        const cart = await Cart.findOne({ user_id: userId }).populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.redirect("/users/cart"); // back to cart if empty
        }

        const user = await User.findById(userId);
        const total = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

        req.session.lastOrder = {
            user_id: userId,
            items: cart.items,
            total_price: total,
            delivery_address: user.address || "",
            payment_method: "Cash", // default
            cart_id: cart._id,
        };

        res.redirect("/users/orderinfo");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to process checkout");
    }
});

orderRouter.get("/orderinfo", (req, res) => {
    const user = req.session.user;
    const order = req.session.lastOrder;

    if (!user || !order) return res.redirect("/users/cart");
    res.render("users/orderpage", { user, order });
});

orderRouter.post("/order/confirm", async (req, res) => {
    const sessionOrder = req.session.lastOrder;
    if (!sessionOrder) return res.redirect("/users/cart");

    try {
        const updatedOrder = {
            ...sessionOrder,
            delivery_address: req.body.delivery_address,
            payment_method: req.body.payment_method,
        };

        const newOrder = new Order(updatedOrder);
        await newOrder.save();

        // Clear cart
        const cart = await Cart.findById(sessionOrder.cart_id);
        if (cart) {
            cart.items = [];
            cart.isCheckedOut = true;
            await cart.save();
        }

        delete req.session.lastOrder;
        res.redirect("/home");
    } catch (err) {
        console.error(err);
        res.status(500).render("users/orderpage", {
            user: req.session.user,
            order: sessionOrder,
            error: "Failed to confirm order",
        });
    }
});

export default orderRouter;
