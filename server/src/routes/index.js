import express from "express";
import authRoutes from "./auth.routes.js";

const router = express.Router();

router.use("/api/v1/auth", authRoutes);

router.get("/health", (_, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
    });
});

export default router;