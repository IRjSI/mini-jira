import axios from "axios";
import { store } from "../app/store";

export const api = axios.create({
    baseURL: "https://mini-jira-no5t.onrender.com/api/v1",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const accessToken = store.getState().auth.accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
})