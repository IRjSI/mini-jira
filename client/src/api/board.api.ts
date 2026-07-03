import { api } from "./axios";

export interface CreateBoardRequest {
    name: string;
    description?: string;
}

export interface UpdateBoardRequest {
    name?: string;
    description?: string;
}

export const createBoard = async (projectId: string, data: CreateBoardRequest) => {
    const response = await api.post(`/projects/${projectId}/boards`, data);
    return response.data;
};

export const getBoardsByProject = async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/boards`);
    return response.data;
};

export const getBoardById = async (boardId: string) => {
    const response = await api.get(`/boards/${boardId}`);
    return response.data;
};

export const updateBoard = async (boardId: string, data: UpdateBoardRequest) => {
    const response = await api.patch(`/boards/${boardId}`, data);
    return response.data;
};

export const deleteBoard = async (boardId: string) => {
    const response = await api.delete(`/boards/${boardId}`);
    return response.data;
};
