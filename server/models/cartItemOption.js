import { Schema, model } from "mongoose";

const cartItemOptionSchema = new Schema({
    cartitemOption_id: { type: String, required: true, unique: true },
    cartitem_id: { type: String, required: true },
    optionVal_id: { type: String, required: true }
});

export default model("CartItemOption", cartItemOptionSchema);
