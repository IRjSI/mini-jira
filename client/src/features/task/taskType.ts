export interface Task {
    _id: string;
    name: string;
    column: string;
    priority: string;
    createdBy: string;
    createdAt?: string;
    updatedAt?: string;
}
