import { Router } from "express";
import organizationController from "../controllers/organization.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", organizationController.createOrganization);
router.get("/", organizationController.getOrganizations);
router.get("/:id", organizationController.getOrganization);
router.patch("/:id", organizationController.updateOrganization);
router.delete("/:id", organizationController.deleteOrganization);

export default router;
