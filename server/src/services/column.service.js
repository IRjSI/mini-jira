import { canManageProject } from "../lib/authorizationHelper.js";
import boardRepository from "../repositories/board.repository.js";
import columnRepository from "../repositories/column.repository.js";
import organizationRepository from "../repositories/organization.repository.js";
import projectRepository from "../repositories/project.repository.js";
import ApiError from "../utils/ApiError.js";

const createColumn = async (userId, boardId, { name }) => {
    if (!name?.trim()) {
        throw new ApiError(400, "Column name is required.");
    }

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

    if (!canManageProject(organization, userId)) {
        throw new ApiError(403, "Unauthorized.");
    }

    const columns = await columnRepository.findColumnsByBoard(boardId);

    const order = columns.length;

    const column = await columnRepository.createColumn({
        name,
        order,
        board: boardId,
        createdBy: userId,
    });

    return column;
};

const findColumnById = async (userId, columnId) => {
    const column = await columnRepository.findColumnById(columnId);

    if (!column) {
        throw new ApiError(404, "Column not found.");
    }

    const board = await boardRepository.findBoardById(column.board);

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

    if (!canManageProject(organization, userId)) {
        throw new ApiError(403, "Unauthorized.");
    }

    return column;
};

const findColumnsByBoard = async (userId, boardId, page, limit) => {
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

    if (!canManageProject(organization, userId)) {
        throw new ApiError(403, "Unauthorized.");
    }

    const normalizedPage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const normalizedLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

    const columns = await columnRepository.findColumnsByBoard(boardId);

    return columns.slice((normalizedPage - 1) * normalizedLimit, normalizedPage * normalizedLimit);
};

const updateColumn = async (userId, columnId, updateData) => {
    const column = await columnRepository.findColumnById(columnId);

    if (!column) {
        throw new ApiError(404, "Column not found.");
    }

    const board = await boardRepository.findBoardById(column.board);

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

    if (!canManageProject(organization, userId)) {
        throw new ApiError(403, "Unauthorized.");
    }

    if (updateData.name !== undefined && !updateData.name?.trim()) {
        throw new ApiError(400, "Column name is required.");
    }

    const allowedUpdates = {};

    if (updateData.name !== undefined) {
        allowedUpdates.name = updateData.name;
    }

    const updated = await columnRepository.updateColumn(columnId, allowedUpdates);

    return updated;
};

const deleteColumn = async (userId, columnId) => {
    const column = await columnRepository.findColumnById(columnId);

    if (!column) {
        throw new ApiError(404, "Column not found.");
    }

    const board = await boardRepository.findBoardById(column.board);

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

    if (!canManageProject(organization, userId)) {
        throw new ApiError(403, "Unauthorized.");
    }

    const deleted = await columnRepository.deleteColumn(columnId);

    return deleted;
};

const columnService = {
    createColumn,
    findColumnById,
    findColumnsByBoard,
    updateColumn,
    deleteColumn,
};

export default columnService;