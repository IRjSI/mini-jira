import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    avatar: {
        type: String,
        default: ""
    },
    refreshToken: {
        type: String,
        default: ""
    }
}, { timestamps: true });

userSchema.pre("save", async function() {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return generateAccessToken(this._id);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;