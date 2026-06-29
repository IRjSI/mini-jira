import TaskModel from "../models/task.model.js";

const createTask = async (taskData) => {
    return TaskModel.create(taskData);
};

const findTaskById = async (taskId) => {
    return TaskModel.findById(taskId);
};

const findTasksByColumn = async (columnId) => {
    return TaskModel.find({ column: columnId }).sort({ order: 1 });
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
