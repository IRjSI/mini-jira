import express from "express";
import authRoutes from "./auth.routes.js";
import organizationRoutes from "./organization.routes.js";
import projectRoutes from "./project.routes.js";
import boardRoutes from "./board.routes.js";
import columnRoutes from "./column.routes.js";
import taskRoutes from "./task.routes.js";

const router = express.Router();

router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/organizations", organizationRoutes);
router.use("/api/v1/projects", projectRoutes);
router.use("/api/v1", boardRoutes);
router.use("/api/v1", columnRoutes);
router.use("/api/v1", taskRoutes);

router.get("/health", (_, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
    });
});

export default router;