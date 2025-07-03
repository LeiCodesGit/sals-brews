import { Schema, model } from "mongoose";

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_image: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    sizes: [{
        label: String,
        price: Number
    }],
    temperature_options: [String],
    addons: [{
        name: String,
        price: Number
    }],
    isAvailable: { type: Boolean, default: true },
    isBestSeller: { type: Boolean, default: false }
});

const Product = model("Product", productSchema);
export default Product;
