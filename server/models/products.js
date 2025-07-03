import { Schema, model } from "mongoose";

const productSchema = new Schema({
    product_id: {
        type: String,
        required: true,
        unique: true
    },
    product_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isBestSeller: {
        type: Boolean,
        default: false
    }
});

// Create and export the model
const Product = model("Product", productSchema);
export default Product;
