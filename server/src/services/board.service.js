import projectRepository from "../repositories/project.repository.js";
import organizationRepository from "../repositories/organization.repository.js";
import boardRepository from "../repositories/board.repository.js";
import ApiError from "../utils/ApiError.js";
import { isAuthorizedForProject } from "../lib/authorizationHelper.js";

const createBoard = async (userId, projectId, { name, description = "" }) => {
    if (!name?.trim()) {
        throw new ApiError(400, "Board name is required.");
    }

    const project = await projectRepository.findProjectById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found.");
    }

    const organization = await organizationRepository.findOrganizationById(project.organization);

    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    if (!isAuthorizedForProject(project, organization, userId)) {
        throw new ApiError(403, "Unauthorized.");
    }

    const board = await boardRepository.createBoard({
        name,
        description,
        project: projectId,
        createdBy: userId,
    });

    return board;
};

const findBoard = async (userId, boardId) => {
    const board = await boardRepository.findBoardById(boardId);

    if (!board) {
        throw new ApiError(404, "Board not found.");
    }

    const project = await projectRepository.findProjectById(board.project);

    if (!project) {
        throw new ApiError(404, "Project not found.");
    }

    const organization = await organizationRepository.findOrganizationById(project.organization);

    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    if (!isAuthorizedForProject(project, organization, userId)) {
        throw new ApiError(403, "Unauthorized.");
    }

    return board;
};

const findBoardsByProject = async (userId, projectId) => {
    const project = await projectRepository.findProjectById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found.");
    }

    const organization = await organizationRepository.findOrganizationById(project.organization);

    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    if (!isAuthorizedForProject(project, organization, userId)) {
        throw new ApiError(403, "Unauthorized.");
    }

    const boards = await boardRepository.findBoardsByProject(projectId);

    return boards;
};

const updateBoard = async (userId, boardId, updateData) => {
    const board = await boardRepository.findBoardById(boardId);

    if (!board) {
        throw new ApiError(404, "Board not found.");
    }

    const project = await projectRepository.findProjectById(board.project);

    if (!project) {
        throw new ApiError(404, "Project not found.");
    }

    const organization = await organizationRepository.findOrganizationById(project.organization);

    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    if (!isAuthorizedForProject(project, organization, userId)) {
        throw new ApiError(403, "Unauthorized.");
    }

    if (updateData.name !== undefined && !updateData.name?.trim()) {
        throw new ApiError(400, "Board name is required.");
    }

    const allowedUpdates = {};

    if (updateData.name !== undefined)
        allowedUpdates.name = updateData.name;

    if (updateData.description !== undefined)
        allowedUpdates.description = updateData.description;

    const updatedBoard = await boardRepository.updateBoard(boardId, allowedUpdates);

    return updatedBoard;
};

const deleteBoard = async (userId, boardId) => {
    const board = await boardRepository.findBoardById(boardId);

    if (!board) {
        throw new ApiError(404, "Board not found.");
    }

    const project = await projectRepository.findProjectById(board.project);

    if (!project) {
        throw new ApiError(404, "Project not found.");
    }

    const organization = await organizationRepository.findOrganizationById(project.organization);

    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    if (!isAuthorizedForProject(project, organization, userId)) {
        throw new ApiError(403, "Unauthorized.");
    }

    const deletedBoard = await boardRepository.deleteBoard(boardId);

    return deletedBoard;
};

const boardService = {
    createBoard,
    findBoard,
    findBoardsByProject,
    updateBoard,
    deleteBoard,
};

export default boardService;
