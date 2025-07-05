import express from "express";
import Order from "../../models/order.js";
import isAdmin from "../../middlewares/isAdmin.js";

const adminOrderRouter = express.Router();

adminOrderRouter.use(isAdmin); // protect all admin order routes

// GET all orders
adminOrderRouter.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find()
        .populate("user_id")
        .populate("items.productId");

        const formatted = orders.map(order => ({
        _id: order._id,
        user_email: order.user_id?.email || "Unknown",
        items: order.items.map(i => ({
            quantity: i.quantity,
            productName: i.productId?.product_name || "Unknown",
        })),
        total_price: order.total_price,
        status: order.status,
        order_date: order.order_date,
        }));

        res.json({ orders: formatted });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

// UPDATE order status
adminOrderRouter.put("/orders/:id", async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: "Failed to update order" });
    }
});

// DELETE order
adminOrderRouter.delete("/orders/:id", async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: "Failed to delete order" });
    }
});

adminOrderRouter.get("/adminorders", (req, res) => {
    res.render("admin/adminorders", { page: "orders" });
});

export default adminOrderRouter;
