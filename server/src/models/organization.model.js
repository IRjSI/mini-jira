import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        default: "",
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            
            role: {
                type: String,
                enum:[
                    "admin",
                    "member",
                    "viewer"
                ],
                default: "member",
            },
        }
    ],
}, { timestamps: true });

export default mongoose.model("Organization", organizationSchema);