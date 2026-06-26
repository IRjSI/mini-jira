import authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);

    res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: result,
    });
});

export default {
    register,
};