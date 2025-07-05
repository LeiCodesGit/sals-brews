import { Schema, model } from "mongoose";

const orderItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 },
    selectedSize: { type: String },
    selectedTemp: { type: String },
    selectedAddons: [{ type: String }],
    totalPrice: { type: Number, required: true },
});

const orderSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema], // Copied from Cart.items at checkout
    total_price: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Pending", "Preparing", "Out for Delivery", "Completed", "Cancelled"],
        default: "Pending"
    },
    payment_method: {
        type: String,
        enum: ["Cash", "Card", "GCash", "Other"],
        default: "Cash"
    },
    delivery_address: { type: String, required: true }, // Always required
    cart_id: { type: Schema.Types.ObjectId, ref: "Cart" }, // optional for traceability
    order_date: { type: Date, default: Date.now }
});

export default model("Order", orderSchema);
