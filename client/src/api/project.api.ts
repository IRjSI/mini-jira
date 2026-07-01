import { api } from "./axios";

export const getProjects = async () => {
    const response = await api.get("/projects");

    return response.data;
};

export const getProjectsByOrganization = async (organizationId: string) => {
    const response = await api.get(`/projects/organization/${organizationId}`);

    return response.data;
};
