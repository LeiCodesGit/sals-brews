import { Schema, model } from "mongoose";

const orderItemOptionSchema = new Schema({
    orderitemOption_id: { type: String, required: true, unique: true },
    orderitem_id: { type: String, required: true },
    optionVal_id: { type: String, required: true }
});

export default model("OrderItemOption", orderItemOptionSchema);
