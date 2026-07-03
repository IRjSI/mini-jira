import { api } from "./axios";

export interface CreateOrganizationRequest {
    name: string;
    description: string;
}

export const createOrganization = async (data: CreateOrganizationRequest) => {
    const response = await api.post("/organizations", data);

    return response.data;
};

export const getOrganizationById = async (id: string) => {
    const response = await api.get(`/organizations/${id}`);

    return response.data;
};

export const getOrganizationsByOwner = async (limit?: number, offset?: number) => {
    const response = await api.get(`/organizations?limit=${limit}&offset=${offset}`);

    return response.data;
};

export const updateOrganization = async (id: string, data: CreateOrganizationRequest) => {
    const response = await api.patch(`/organizations/${id}`, data);

    return response.data;
};

export const deleteOrganization = async (id: string) => {
    const response = await api.delete(`/organizations/${id}`);

    return response.data;
};

export const bootstrap = async (id: string) => {
    const response = await api.post(`/organizations/${id}/bootstrap`);

    return response.data;
};