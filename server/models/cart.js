import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    cart_id: { 
        type: String, 
        required: true, 
        unique: true 
    },

    user_id: { 
        type: String, 
        required: true 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },

    isCheckedOut: { 
        type: Boolean, 
        default: false 
    }
});

export default model("Cart", cartSchema);
