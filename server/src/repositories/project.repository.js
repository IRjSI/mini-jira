import ProjectModel from "../models/project.model.js";

const createProject = async (projectData) => {
    return ProjectModel.create(projectData);
};

const findAllProjects = async (page = 1, limit = 10) => {
    const normalizedPage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const normalizedLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

    return ProjectModel
        .find()
        .skip((normalizedPage - 1) * normalizedLimit)
        .limit(normalizedLimit)
        .sort({ createdAt: -1 });
};

const findProjectsByCreator = async (creatorId, page = 1, limit = 10) => {
    const normalizedPage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const normalizedLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

    return ProjectModel
        .find({ createdBy: creatorId })
        .skip((normalizedPage - 1) * normalizedLimit)
        .limit(normalizedLimit)
        .sort({ createdAt: -1 });
};

const findProjectById = async (id) => {
    return ProjectModel.findById(id);
};

const findProjectsByOrganization = async (organizationId, page = 1, limit = 10) => {
    const normalizedPage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const normalizedLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

    return ProjectModel
        .find({ organization: organizationId })
        .skip((normalizedPage - 1) * normalizedLimit)
        .limit(normalizedLimit)
        .sort({ createdAt: -1 });
};

const updateProject = async (id, updateData) => {
    return ProjectModel.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
        }
    );
};

const deleteProject = async (id) => {
    return ProjectModel.findByIdAndDelete(id);
};

const projectRepository = {
    createProject,
    findAllProjects,
    findProjectsByCreator,
    findProjectById,
    findProjectsByOrganization,
    updateProject,
    deleteProject,
};

export default projectRepository;
