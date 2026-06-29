import { TASK_PRIORITIES } from "../constants/priorities.js";
import { canManageProject } from "../lib/authorizationHelper.js";
import boardRepository from "../repositories/board.repository.js";
import columnRepository from "../repositories/column.repository.js";
import organizationRepository from "../repositories/organization.repository.js";
import projectRepository from "../repositories/project.repository.js";
import taskRepository from "../repositories/task.repository.js";
import ApiError from "../utils/ApiError.js";

const getColumnContext = async (userId, columnId) => {
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

    return { column, board, project, organization };
};

const getTaskContext = async (userId, taskId) => {
    const task = await taskRepository.findTaskById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found.");
    }

    const columnContext = await getColumnContext(userId, task.column);

    return { task, ...columnContext };
};

const createTask = async (userId, columnId, { title, description = "", priority = "medium" }) => {
    if (!title?.trim()) {
        throw new ApiError(400, "Task title is required.");
    }

    if (!TASK_PRIORITIES.includes(priority)) {
        throw new ApiError(400, "Invalid priority.");
    }

    await getColumnContext(userId, columnId);

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
    const { task } = await getTaskContext(userId, taskId);

    return task;
};

const findTasksByColumn = async (userId, columnId, page, limit) => {
    await getColumnContext(userId, columnId);

    const normalizedPage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const normalizedLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

    const tasks = await taskRepository.findTasksByColumn(columnId);

    return tasks.slice((normalizedPage - 1) * normalizedLimit, normalizedPage * normalizedLimit);
};

const moveTask = async (userId, taskId, targetColumnId) => {
    const { task, column } = await getTaskContext(userId, taskId);

    const targetColumn = await columnRepository.findColumnById(targetColumnId);

    if (!targetColumn) {
        throw new ApiError(
            404,
            "Target column not found."
        );
    }

    const targetTasks = await taskRepository.findTasksByColumn(targetColumnId);

    await taskRepository.updateTask(
        taskId,
        {
            column: targetColumnId,
            order: targetTasks.length,
        }
    );

    return taskRepository.findTaskById(taskId);
};

const updateTask = async (userId, taskId, updateData) => {
    const { task } = await getTaskContext(userId, taskId);

    if (updateData.title !== undefined && !updateData.title?.trim()) {
        throw new ApiError(400, "Task title is required.");
    }

    if (updateData.priority !== undefined && !TASK_PRIORITIES.includes(updateData.priority)) {
        throw new ApiError(400, "Invalid priority.");
    }

    const allowedUpdates = {};

    if (updateData.title !== undefined) {
        allowedUpdates.title = updateData.title;
    }

    if (updateData.description !== undefined) {
        allowedUpdates.description = updateData.description;
    }

    if (updateData.priority !== undefined) {
        allowedUpdates.priority = updateData.priority;
    }

    const updatedTask = await taskRepository.updateTask(taskId, allowedUpdates);

    return updatedTask;
};

const deleteTask = async (userId, taskId) => {
    await getTaskContext(userId, taskId);

    const deletedTask = await taskRepository.deleteTask(taskId);

    return deletedTask;
};

const taskService = {
    createTask,
    findTaskById,
    findTasksByColumn,
    moveTask,
    updateTask,
    deleteTask,
};

export default taskService;