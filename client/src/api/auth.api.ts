import { api } from "./axios";

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

export const registerUser = async (data: RegisterData) => {
    const response = await api.post("/auth/register", data);

    return response.data;
};

export const loginUser = async (data: LoginData) => {
    const response = await api.post("/auth/login", data);

    return response.data;
};

export const getCurrentUser = async (token: string) => {
    const response = await api.get("/auth/me", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.data;
};

export const refreshAccessToken = async () => {
    const response = await api.post("/auth/refresh");

    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post("/auth/logout");

    return response.data;
};