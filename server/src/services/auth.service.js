import env from "../config/env.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../lib/jwt.js";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";

const register = async ({ name, email, password }) => {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new ApiError(409, "User already exists");
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
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
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

const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new ApiError(
            401,
            "Refresh token missing"
        );
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await userRepository.findById(decoded.userId);

    if (!user) {
        throw new ApiError(
            401,
            "Invalid refresh token"
        );
    }

    if (user.refreshToken !== refreshToken) {
        throw new ApiError(
            401,
            "Invalid refresh token"
        );
    }

    const accessToken = generateAccessToken(user._id);

    return {
        accessToken,
    };
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
    refreshAccessToken ,
}

export default authService;