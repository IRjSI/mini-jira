import env from "../config/env.js";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt.js";
import userRepository from "../repositories/user.repository.js";
import asyncHandler from "../utils/asyncHandler.js";

const register = async ({ name, email, password }) => {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new Error("User already exists");
    }

    const user = await userRepository.createUser({
        name,
        email,
        password,
    });

    const { accessToken, refreshToken } = await generateTokenPair(user);

    const userResponse = user.toObject();
    delete userResponse.password;

    return {
        user: userResponse,
        accessToken,
        refreshToken,
    };
};

const login = async ({ email, password }) => {
    const user = await userRepository.findByEmailWithPassword(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new Error("Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateTokenPair(user);

    const userResponse = user.toObject();
    delete userResponse.password;

    return {
        user: userResponse,
        accessToken,
        refreshToken,
    };
};

const getCurrentUser = async (userId) => {
    const user = await userRepository.findById(userId);

    return user;
};

const logout = async (userId) => {
    await userRepository.updateRefreshToken(
        userId,
        ""
    );
};

const generateTokenPair = async (user) => {
    const accessToken = generateAccessToken(user._id);

    const refreshToken = generateRefreshToken(user._id);

    await userRepository.updateRefreshToken(
        user._id,
        refreshToken
    );

    return {
        accessToken,
        refreshToken,
    };
};

const authService = {
    register,
    login,
    getCurrentUser,
    logout,
}

export default authService;