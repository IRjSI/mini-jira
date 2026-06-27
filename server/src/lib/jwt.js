import jwt from "jsonwebtoken";
import env from "../config/env.js";

const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        env.JWT_ACCESS_SECRET,
        {
            expiresIn: env.JWT_ACCESS_EXPIRES_IN,
        }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        env.JWT_REFRESH_SECRET,
        {
            expiresIn: env.JWT_REFRESH_EXPIRES_IN,
        }
    );
};

export {
    generateAccessToken,
    generateRefreshToken,
};