import { Router } from "express";
import projectController from "../controllers/project.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", projectController.createProject);
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProject);
router.get("/organization/:organizationId", projectController.getProjectsByOrganization);
router.patch("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

export default router;
