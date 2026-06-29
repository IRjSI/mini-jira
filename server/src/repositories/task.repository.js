import TaskModel from "../models/task.model.js";

const createTask = async (taskData) => {
    return TaskModel.create(taskData);
};

const findTaskById = async (taskId) => {
    return TaskModel.findById(taskId);
};

const findTasksByColumn = async (columnId, page = 1, limit = 10) => {
    const normalizedPage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const normalizedLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

    return TaskModel
        .find({ column: columnId })
        .skip((normalizedPage - 1) * normalizedLimit)
        .limit(normalizedLimit)
        .sort({ order: 1 });
};

const moveTask = async (taskId, updateData) => {
    return TaskModel.findByIdAndUpdate(
        taskId,
        updateData,
        {
            new: true,
        }
    );
};

const updateTask = async (taskId, updateData) => {
    return TaskModel.findByIdAndUpdate(
        taskId,
        updateData,
        {
            new: true,
        }
    );
};

const deleteTask = async (taskId) => {
    return TaskModel.findByIdAndDelete(taskId);
};

const taskRepository = {
    createTask,
    findTaskById,
    findTasksByColumn,
    moveTask,
    updateTask,
    deleteTask,
};

export default taskRepository;
