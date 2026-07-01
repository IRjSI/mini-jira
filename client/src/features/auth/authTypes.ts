export interface User {
    _id: string;
    name: string;
    email: string;
};

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
};