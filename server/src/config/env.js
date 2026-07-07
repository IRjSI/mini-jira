import dotenv from "dotenv";

dotenv.config();

const env = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "test-access-secret",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "test-refresh-secret",
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    REDIS_URL: process.env.REDIS_URL,
    NODE_ENV: process.env.NODE_ENV || "test",
};

export default env;