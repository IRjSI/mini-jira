import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        default: "",
    },

    column: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Column",
        required: true,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    order: {
        type: Number,
        default: 0,
    },

    priority: {
        type: String,
        enum: [
            "low",
            "medium",
            "high",
        ],
        default: "medium",
    },
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);