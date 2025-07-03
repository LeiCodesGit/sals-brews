import { Schema, model } from "mongoose";

const cartItemSchema = new Schema({
    cartItem_id: { type: String, required: true, unique: true },
    product_id: { type: String, required: true },
    cart_id: { type: String, required: true },
    Quantity: { type: Number, required: true }
});

export default model("CartItem", cartItemSchema);
