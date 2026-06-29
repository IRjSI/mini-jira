import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import taskService from "../services/task.service.js";

const createTask = asyncHandler(async (req, res) => {
    const task = await taskService.createTask(
        req.user._id,
        req.params.columnId,
        req.body
    );

    res.status(201).json(
        new ApiResponse(201, "Task created successfully.", task)
    );
});

const findTaskById = asyncHandler(async (req, res) => {
    const task = await taskService.findTaskById(req.user._id, req.params.taskId);

    res.status(200).json(
        new ApiResponse(200, "Task fetched successfully.", task)
    );
});

const findTasksByColumn = asyncHandler(async (req, res) => {
    const tasks = await taskService.findTasksByColumn(req.user._id, req.params.columnId);

    res.status(200).json(
        new ApiResponse(200, "Tasks fetched successfully.", tasks)
    );
});

const updateTask = asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.user._id, req.params.taskId, req.body);

    res.status(200).json(
        new ApiResponse(200, "Task updated successfully.", task)
    );
});

const deleteTask = asyncHandler(async (req, res) => {
    await taskService.deleteTask(req.user._id, req.params.taskId);

    res.status(200).json(
        new ApiResponse(200, "Task deleted successfully.", null)
    );
});

export default {
    createTask,
    findTaskById,
    findTasksByColumn,
    updateTask,
    deleteTask,
};