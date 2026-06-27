import { Router } from "express";
import boardController from "../controllers/board.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/projects/:projectId/boards", boardController.createBoard);
router.get("/projects/:projectId/boards", boardController.getBoardsByProject);
router.get("/boards/:boardId", boardController.getBoard);
router.patch("/boards/:boardId", boardController.updateBoard);
router.delete("/boards/:boardId", boardController.deleteBoard);

export default router;
