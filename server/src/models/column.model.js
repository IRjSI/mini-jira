import mongoose from "mongoose";

const columnSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

export default mongoose.model("Column", columnSchema);
