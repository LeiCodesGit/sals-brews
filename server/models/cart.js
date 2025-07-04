import { Schema, model } from "mongoose";

const cartItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 },
    selectedSize: { type: String },
    selectedTemp: { type: String },
    selectedAddons: [{ type: String }],
    totalPrice: { type: Number },
});

const cartSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
    created_at: { type: Date, default: Date.now },
    isCheckedOut: { type: Boolean, default: false }
});

export default model("Cart", cartSchema);
