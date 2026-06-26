import env from "../config/env.js";
import { generateAccessToken } from "../lib/jwt.js";
import userRepository from "../repositories/user.repository.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const register = async ({ name, email, password }) => {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await userRepository.createUser({
        name,
        email,
        password: hashedPassword,
    });

    const token = generateAccessToken(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    return {
        user: userResponse,
        token,
    };
};

const authService = {
    register,
}

export default authService;