import axios, { AxiosError, AxiosInstance } from 'axios';

export interface TaskContent {
    id: number;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface CreateTaskData {
    description: string;
}

export interface UpdateTaskData {
    id: number;
    description?: string;
}

class TaskService {
    private axiosInstance: AxiosInstance;

    constructor() {
        const storageType = localStorage.getItem('storageType');
        const storage = storageType === 'local' ? localStorage : sessionStorage;
        const token = storage.getItem('token');
        
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            timeout: 10000,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    async createTask(data: CreateTaskData): Promise<TaskContent | undefined> {
        try {
            const response = await this.axiosInstance.post<{
                message: string;
                TaskContent: TaskContent;
            }>('/admin/task-content', data);
            return response.data.TaskContent;
        } catch (error) {
            this.handleError(error, 'Failed to create task content');
            return undefined;
        }
    }

    async getTasks(): Promise<TaskContent[]> {
        try {
            const response = await this.axiosInstance.get<{
                TaskContent: TaskContent[];
            }>('/task-content');
            return response.data.TaskContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve task content');
            return [];
        }
    }

    async getTaskById(id: number): Promise<TaskContent | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                TaskContent: TaskContent;
            }>(`/task-content/${id}`);
            return response.data.TaskContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve task content');
            return undefined;
        }
    }

    async updateTask(data: UpdateTaskData): Promise<TaskContent | undefined> {
        try {
            const response = await this.axiosInstance.put<{
                message: string;
                TaskContent: TaskContent;
            }>(`/admin/task-content/${data.id}`, data);
            
            return response.data.TaskContent;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: A task with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update task content');
            return undefined;
        }
    }

    async deleteTask(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/task-content/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete task content');
        }
    }

    private handleError(error: unknown, message: string) {
        if (error instanceof AxiosError) {
            console.error(`${message}:`, error.response?.data);
            throw error.response?.data || { error: message };
        }
        console.error(message, error);
        throw { error: message };
    }
}

export const taskService = new TaskService();