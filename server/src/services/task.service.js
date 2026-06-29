import { TASK_PRIORITIES } from "../constants/priorities.js";
import { canManageProject } from "../lib/authorizationHelper.js";
import boardRepository from "../repositories/board.repository.js";
import columnRepository from "../repositories/column.repository.js";
import organizationRepository from "../repositories/organization.repository.js";
import projectRepository from "../repositories/project.repository.js";
import taskRepository from "../repositories/task.repository.js";
import ApiError from "../utils/ApiError.js";

const createTask = async (userId, columnId, { title, description = "", priority = "medium" }) => {
    if (!title?.trim()) {
        throw new ApiError(400, "Task title is required.");
    }

    const allowedPriorities = TASK_PRIORITIES;

    if (!allowedPriorities.includes(priority)) {
        throw new ApiError(400, "Invalid priority.");
    }

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

    if (!canManageProject(project, organization, userId)) {
        throw new ApiError(403, "Unauthorized.");
    }

    const tasks = await taskRepository.findTasksByColumn(columnId);
    const order = tasks.length;

    const task = await taskRepository.createTask({
        title,
        description,
        priority,
        order,
        column: columnId,
        createdBy: userId,
    });

    return task;
};

const findTaskById = async (userId, taskId) => {
    const task = await taskRepository.findTaskById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found.");
    }

    const column = await columnRepository.findColumnById(task.column);

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

    if (!canManageProject(project, organization, userId)) {
        throw new ApiError(403, "Unauthorized.");
    }

    return task;
};

const findTasksByColumn = async (userId, columnId) => {
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

    if (!canManageProject(project, organization, userId)) {
        throw new ApiError(403, "Unauthorized.");
    }

    const tasks = await taskRepository.findTasksByColumn(columnId);

    return tasks;
};

const updateTask = async (userId, taskId, updateData) => {
    const task = await taskRepository.findTaskById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found.");
    }

    const column = await columnRepository.findColumnById(task.column);

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

    if (!canManageProject(project, organization, userId)) {
        throw new ApiError(403, "Unauthorized.");
    }

    if (updateData.title !== undefined && !updateData.title?.trim()) {
        throw new ApiError(400, "Task title is required.");
    }

    if (updateData.priority !== undefined) {
        if (!TASK_PRIORITIES.includes(updateData.priority)) {
            throw new ApiError(400, "Invalid priority.");
        }
    }

    const updatedTask = await taskRepository.updateTask(taskId, updateData);

    return updatedTask;
};

const deleteTask = async (userId, taskId) => {
    const task = await taskRepository.findTaskById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found.");
    }

    const column = await columnRepository.findColumnById(task.column);

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

    if (!canManageProject(project, organization, userId)) {
        throw new ApiError(403, "Unauthorized.");
    }

    const deletedTask = await taskRepository.deleteTask(taskId);

    return deletedTask;
};

const taskService = {
    createTask,
    findTaskById,
    findTasksByColumn,
    updateTask,
    deleteTask,
};

export default taskService;