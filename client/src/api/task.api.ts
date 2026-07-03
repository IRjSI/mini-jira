import { api } from "./axios";

export interface CreateTaskRequest {
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
}

export const createTask = async (columnId: string, data: CreateTaskRequest) => {
    const response = await api.post(`/tasks/columns/${columnId}`, data);
    return response.data;
};

export const getTasksByColumn = async (columnId: string, limit: number = 100) => {
    const response = await api.get(`/tasks/columns/${columnId}?limit=${limit}`);
    return response.data;
};

export const getTaskById = async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
};

export const moveTask = async (taskId: string, columnId: string) => {
    const response = await api.patch(`/tasks/${taskId}/move`, { columnId });
    return response.data;
};

export const updateTask = async (taskId: string, data: UpdateTaskRequest) => {
    const response = await api.patch(`/tasks/${taskId}`, data);
    return response.data;
};

export const deleteTask = async (taskId: string) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
};
