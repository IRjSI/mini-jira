import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import projectService from "../services/project.service.js";

const createProject = asyncHandler(async (req, res) => {
    const project = await projectService.createProject(
        req.user._id,
        req.body
    );

    res.status(201).json(
        new ApiResponse(
            201,
            "Project created successfully.",
            project
        )
    );
});

const getProjects = asyncHandler(async (req, res) => {
    const projects = await projectService.getProjects(req.user._id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Projects fetched successfully.",
            projects
        )
    );
});

const getProject = asyncHandler(async (req, res) => {
    const project = await projectService.getProject(req.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Project fetched successfully.",
            project
        )
    );
});

const getProjectsByOrganization = asyncHandler(async (req, res) => {
    const projects = await projectService.getProjectsByOrganization(req.params.organizationId);

    res.status(200).json(
        new ApiResponse(
            200,
            "Projects fetched successfully.",
            projects
        )
    );
});

const updateProject = asyncHandler(async (req, res) => {
    const project = await projectService.updateProject(
        req.params.id,
        req.body
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Project updated successfully.",
            project
        )
    );
});

const deleteProject = asyncHandler(async (req, res) => {
    await projectService.deleteProject(req.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Project deleted successfully.",
            null
        )
    );
});

export default {
    createProject,
    getProjects,
    getProject,
    getProjectsByOrganization,
    updateProject,
    deleteProject,
};
