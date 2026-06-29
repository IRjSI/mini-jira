import ProjectModel from "../models/project.model.js";

const createProject = async (projectData) => {
    return ProjectModel.create(projectData);
};

const findAllProjects = async (filter = {}) => {
    return ProjectModel.find(filter).sort({ createdAt: -1 });
};

const findProjectsByCreator = async (filter) => {
    return ProjectModel.find(filter).sort({ createdAt: -1 });
};

const findProjectById = async (id) => {
    return ProjectModel.findById(id);
};

const findProjectsByOrganization = async (organizationId) => {
    return ProjectModel.find({ organization: organizationId }).sort({ createdAt: -1 });
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
