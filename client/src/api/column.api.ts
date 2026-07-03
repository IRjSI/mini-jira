import { api } from "./axios";

export interface CreateColumnRequest {
    name: string;
}

export interface UpdateColumnRequest {
    name?: string;
}

export const createColumn = async (boardId: string, data: CreateColumnRequest) => {
    const response = await api.post(`/boards/${boardId}/columns`, data);
    return response.data;
};

export const getColumnsByBoard = async (boardId: string, limit: number = 100) => {
    const response = await api.get(`/boards/${boardId}/columns?limit=${limit}`);
    return response.data;
};

export const getColumnById = async (columnId: string) => {
    const response = await api.get(`/columns/${columnId}`);
    return response.data;
};

export const updateColumn = async (columnId: string, data: UpdateColumnRequest) => {
    const response = await api.patch(`/columns/${columnId}`, data);
    return response.data;
};

export const deleteColumn = async (columnId: string) => {
    const response = await api.delete(`/columns/${columnId}`);
    return response.data;
};
