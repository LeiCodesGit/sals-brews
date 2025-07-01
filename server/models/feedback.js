import { Schema, model } from "mongoose";

const feedbackSchema = new Schema({
    feedback_id: { type: String, required: true, unique: true },
    order_id: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    created_at: { type: Date, default: Date.now }
});

export default model("Feedback", feedbackSchema);
