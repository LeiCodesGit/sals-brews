import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    order_id: { type: String, required: true, unique: true },
    cart_id: { type: String, required: true },
    user_id: { type: String, required: true },
    order_date: { type: Date, default: Date.now },
    status: { type: String, required: true },
    total_price: { type: Number, required: true },
    payment_method: { type: String },
    delivery_address: { type: String }
});

export default model("Order", orderSchema);
