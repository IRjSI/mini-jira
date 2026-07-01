import axios from "axios";
import { store } from "../app/store";

export const api = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const accessToken = store.getState().auth.accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
})