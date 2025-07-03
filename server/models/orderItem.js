import { Schema, model } from "mongoose";

const orderItemSchema = new Schema({
    orderitem_id: { type: String, required: true, unique: true },
    order_id: { type: String, required: true },
    product_id: { type: String, required: true },
    quantity: { type: Number, required: true },
    item_price: { type: Number, required: true },
    sub_total: { type: Number, required: true }
});

export default model("OrderItem", orderItemSchema);
