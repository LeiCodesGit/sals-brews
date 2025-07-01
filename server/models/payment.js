import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
    payment_id: { type: String, required: true, unique: true },
    order_id: { type: String, required: true },
    user_id: { type: String, required: true },
    issued_at: { type: Date, default: Date.now },
    payment_method: { type: String },
    amount: { type: Number, required: true }
});

export default model("Payment", paymentSchema);
