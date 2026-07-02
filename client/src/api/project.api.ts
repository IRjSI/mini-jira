import { api } from "./axios";

interface CreateProjectRequest {
    name: string;
    description?: string;
    organizationId: string;
}

interface UpdateProjectRequest {
    name?: string;
    description?: string;
}

export const createProject = async (data: CreateProjectRequest) => {
    const response = await api.post("/projects", data);

    return response.data;
};

export const getProjects = async () => {
    const response = await api.get("/projects");

    return response.data;
};

export const getProjectById = async (id: string) => {
    const response = await api.get(`/projects/${id}`);

    return response.data;
};

export const getProjectsByOrganization = async (organizationId: string) => {
    const response = await api.get(`/projects/organization/${organizationId}`);

    return response.data;
};

export const updateProject = async (id: string, data: UpdateProjectRequest) => {
    const response = await api.patch(`/projects/${id}`, data);

    return response.data;
};

export const deleteProject = async (id: string) => {
    const response = await api.delete(`/projects/${id}`);

    return response.data;
};
