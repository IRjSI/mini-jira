import cookieOptions from "../constants/cookies.js";
import authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);

    res.cookie(
        "refreshToken",
        result.refreshToken,
        cookieOptions,
    );

    res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: {
            user: result.user,
            accessToken: result.accessToken,
        },
    });
});

const login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);

    res.cookie(
        "refreshToken",
        result.refreshToken,
        cookieOptions,
    );

    res.status(200).json({
        success: true,
        message: "Login successful.",
        data: {
            user: result.user,
            accessToken: result.accessToken,
        },
    });
});

const me = asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user._id);

    res.status(200).json({
        success: true,
        data: user,
    });
});

const logout = asyncHandler(async (req ,res) => {
    await authService.logout(req.user._id);
    
    res.clearCookie("refreshToken", cookieOptions);

    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
});

export default {
    register,
    login,
    me,
    logout,
};