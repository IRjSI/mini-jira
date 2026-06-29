import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import taskController from "../controllers/task.controller.js";

const router = Router();

router.use(authenticate);

router.post("/tasks/columns/:columnId", taskController.createTask);
router.get("/tasks/columns/:columnId", taskController.findTasksByColumn);
router.get("/tasks/:taskId", taskController.findTaskById);
router.patch("/tasks/:taskId/move", taskController.moveTask);
router.patch("/tasks/:taskId", taskController.updateTask);
router.delete("/tasks/:taskId", taskController.deleteTask);

export default router;