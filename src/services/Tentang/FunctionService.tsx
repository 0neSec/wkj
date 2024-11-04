import axios, { AxiosError, AxiosInstance } from 'axios';

export interface FunctionContent {
    id: number;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface CreateFunctionData {
    description: string;
}

export interface UpdateFunctionData {
    id: number;
    description?: string;
}

class FunctionService {
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

    async createFunction(data: CreateFunctionData): Promise<FunctionContent | undefined> {
        try {
            const response = await this.axiosInstance.post<{
                message: string;
                FunctionContent: FunctionContent;
            }>('/admin/function-content', data);
            return response.data.FunctionContent;
        } catch (error) {
            this.handleError(error, 'Failed to create function content');
            return undefined;
        }
    }

    async getFunctions(): Promise<FunctionContent[]> {
        try {
            const response = await this.axiosInstance.get<{
                FunctionContent: FunctionContent[];
            }>('/function-content');
            return response.data.FunctionContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve function content');
            return [];
        }
    }

    async getFunctionById(id: number): Promise<FunctionContent | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                FunctionContent: FunctionContent;
            }>(`/function-content/${id}`);
            return response.data.FunctionContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve function content');
            return undefined;
        }
    }

    async updateFunction(data: UpdateFunctionData): Promise<FunctionContent | undefined> {
        try {
            const response = await this.axiosInstance.put<{
                message: string;
                FunctionContent: FunctionContent;
            }>(`/admin/function-content/${data.id}`, data);
            
            return response.data.FunctionContent;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: A function with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update function content');
            return undefined;
        }
    }

    async deleteFunction(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/function-content/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete function content');
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

export const functionService = new FunctionService();