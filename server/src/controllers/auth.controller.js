import cookieOptions from "../constants/cookies.js";
import authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);

    res.cookie(
        "refreshToken",
        result.refreshToken,
        cookieOptions,
    );

    res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully.",
            {
                user: result.user,
                accessToken: result.accessToken,
            }
        )
    );
});

const login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);

    res.cookie(
        "refreshToken",
        result.refreshToken,
        cookieOptions,
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Login successful.",
            {
                user: result.user,
                accessToken: result.accessToken,
            }
        )
    );
});

const me = asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user._id);

    res.status(200).json(
        new ApiResponse(
            200,
            "User fetched successfully.",
            user
        )
    );
});

const logout = asyncHandler(async (req ,res) => {
    await authService.logout(req.user._id);
    
    res.clearCookie("refreshToken", cookieOptions);

    res.status(200).json(
        new ApiResponse(
            200,
            "Logout successful",
            null
        )
    );
});

const refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json(
        new ApiResponse(
            200,
            "Access token refreshed successfully.",
            result
        )
    );
});

export default {
    register,
    login,
    me,
    logout,
    refresh,
};