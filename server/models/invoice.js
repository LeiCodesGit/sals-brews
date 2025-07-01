import { Schema, model } from "mongoose";

const invoiceSchema = new Schema({
    invoice_id: { type: String, required: true, unique: true },
    order_id: { type: String, required: true },
    user_id: { type: String, required: true },
    issued_at: { type: Date, default: Date.now },
    payment_method: { type: String },
    total: { type: Number, required: true }
});

export default model("Invoice", invoiceSchema);
