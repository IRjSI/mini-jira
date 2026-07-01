import mongoose from "mongoose";
import boardRepository from "../repositories/board.repository.js";
import columnRepository from "../repositories/column.repository.js";
import organizationRepository from "../repositories/organization.repository.js";
import projectRepository from "../repositories/project.repository.js";
import taskRepository from "../repositories/task.repository.js";
import ApiError from "../utils/ApiError.js";

const createOrganization = async (userId, { name, description = "" }) => {
    if (!name?.trim()) {
        throw new ApiError(400, "Organization name is required.");
    }

    const org = await organizationRepository.createOrganization({
        name,
        description,
        owner: userId,
        members: [userId],
    });

    return org;
};

const getOrganizations = async (page, limit) => {
    const normalizedPage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const normalizedLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

    const organizations = await organizationRepository.findAllOrganizations();

    return organizations.slice((normalizedPage - 1) * normalizedLimit, normalizedPage * normalizedLimit);
};

const getOrganization = async (organizationId) => {
    const organization = await organizationRepository.findOrganizationById(
        organizationId
    );

    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    return organization;
};

const updateOrganization = async (organizationId, updateData) => {
    const organization = await organizationRepository.updateOrganization(
        organizationId,
        updateData
    );

    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    return organization;
};

const deleteOrganization = async (organizationId) => {
    const organization = await organizationRepository.deleteOrganization(organizationId);

    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    return organization;
};

const bootstrapOrganization = async (userId, organizationId) => {

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const organization = await organizationRepository.findOrganizationById(organizationId);

        if (!organization) {
            throw new ApiError(404, "Organization not found.");
        }

        if (organization.owner.toString() !== userId.toString()) {
            throw new ApiError(403, "Unauthorized.");
        }

        const project = await projectRepository.createProject({
            name: "Default Project",
            description: "Default bootstrapped project.",
            organization: organizationId,
            createdBy: userId,
        });

        const board = await boardRepository.createBoard({
            name: "Default Board",
            description: "A starter board for your first project.",
            project: project._id,
            createdBy: userId,
        });

        const columns = await Promise.all([
            columnRepository.createColumn({
                name: "To Do",
                order: 0,
                board: board._id,
                createdBy: userId,
            }),
            columnRepository.createColumn({
                name: "In Progress",
                order: 1,
                board: board._id,
                createdBy: userId,
            }),
            columnRepository.createColumn({
                name: "Done",
                order: 2,
                board: board._id,
                createdBy: userId,
            }),
        ]);

        const task = await taskRepository.createTask({
            title: "Welcome to your first task",
            description: "This task is part of your default project bootstrap.",
            priority: "medium",
            order: 0,
            column: columns[0]._id,
            createdBy: userId,
        });

        return {
            organization,
            project,
            board,
            columns,
            task,
        };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}

const organizationService = {
    createOrganization,
    getOrganizations,
    getOrganization,
    updateOrganization,
    deleteOrganization,
    bootstrapOrganization,
};

export default organizationService;