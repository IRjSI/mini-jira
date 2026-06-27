import organizationRepository from "../repositories/organization.repository.js";
import projectRepository from "../repositories/project.repository.js";
import ApiError from "../utils/ApiError.js";

const createProject = async (userId, { name, description = "", organizationId }) => {
    if (!name?.trim()) {
        throw new ApiError(400, "Project name is required.");
    }

    if (!organizationId) {
        throw new ApiError(400, "Organization ID is required.");
    }

    const organization = await organizationRepository.findOrganizationById(organizationId);

    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    if (organization.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized.");
    }

    const project = await projectRepository.createProject({
        name,
        description,
        organization: organizationId,
        createdBy: userId,
    });

    return project;
};

const getProjects = async (userId) => {
    const projects = await projectRepository.findProjectsByCreator(userId);

    return projects;
};

const getProject = async (userId, userId, projectId) => {
    const project = await projectRepository.findProjectById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found.");
    }

    const organization = await organizationRepository.findOrganizationById(
        project.organization
    );

    if (
        organization.owner.toString() !== userId.toString() &&
        !organization.members.some((member) => member.toString() === userId.toString()) &&
        project.createdBy.toString() !== userId.toString()
    ) {
        throw new ApiError(403, "Unauthorized.");
    }

    return project;
};

const getProjectsByOrganization = async (userId, organizationId) => {
    const organization = await organizationRepository.findOrganizationById(organizationId);

    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    const isAuthorized =
        organization.owner.toString() === userId.toString() ||
        organization.members.some((member) => member.toString() === userId.toString());

    if (!isAuthorized) {
        throw new ApiError(403, "Unauthorized.");
    }

    const projects = await projectRepository.findProjectsByOrganization(organizationId);

    return projects;
};

const updateProject = async (userId, projectId, updateData) => {
    const project = await projectRepository.findProjectById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found.");
    }

    const organization = await organizationRepository.findOrganizationById(
        project.organization
    );

    const isAuthorized =
        project.createdBy.toString() === userId.toString() ||
        organization.owner.toString() === userId.toString();

    if (!isAuthorized) {
        throw new ApiError(403, "Unauthorized.");
    }

    const updatedProject = await projectRepository.updateProject(
        projectId,
        updateData
    );

    return updatedProject;
};

const deleteProject = async (userId, projectId) => {
    const project = await projectRepository.findProjectById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found.");
    }

    const organization = await organizationRepository.findOrganizationById(
        project.organization
    );

    const isAuthorized =
        project.createdBy.toString() === userId.toString() ||
        organization.owner.toString() === userId.toString();

    if (!isAuthorized) {
        throw new ApiError(403, "Unauthorized.");
    }

    const deletedProject = await projectRepository.deleteProject(projectId);

    return deletedProject;
};

const projectService = {
    createProject,
    getProjects,
    getProject,
    getProjectsByOrganization,
    updateProject,
    deleteProject,
};

export default projectService;
