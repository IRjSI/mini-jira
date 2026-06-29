import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import columnController from "../controllers/column.controller.js";

const router = Router();

router.use(authenticate);

router.post("/boards/:boardId/columns", columnController.createColumn);
router.get("/boards/:boardId/columns", columnController.findColumnsByBoard);
router.get("/columns/:columnId", columnController.findColumnById);
router.patch("/columns/:columnId", columnController.updateColumn);
router.delete("/columns/:columnId", columnController.deleteColumn);

export default router;