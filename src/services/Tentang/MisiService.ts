import axios, { AxiosError, AxiosInstance } from 'axios';

export interface MisiContent {
    id: number;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface CreateMisiData {
    description: string;
}

export interface UpdateMisiData {
    id: number;
    description?: string;
}

class MisiService {
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

    async createMisi(data: CreateMisiData): Promise<MisiContent | undefined> {
        try {
            const response = await this.axiosInstance.post<{
                message: string;
                MisiContent: MisiContent;
            }>('/admin/misi-content', data);
            return response.data.MisiContent;
        } catch (error) {
            this.handleError(error, 'Failed to create misi content');
            return undefined;
        }
    }

    async getMisiList(): Promise<MisiContent[]> {
        try {
            const response = await this.axiosInstance.get<{
                MisiContent: MisiContent[];
            }>('/misi-content');
            return response.data.MisiContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve misi content');
            return [];
        }
    }

    async getMisiById(id: number): Promise<MisiContent | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                MisiContent: MisiContent;
            }>(`/misi-content/${id}`);
            return response.data.MisiContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve misi content');
            return undefined;
        }
    }

    async updateMisi(data: UpdateMisiData): Promise<MisiContent | undefined> {
        try {
            const response = await this.axiosInstance.put<{
                message: string;
                MisiContent: MisiContent;
            }>(`/admin/misi-content/${data.id}`, data);
            
            return response.data.MisiContent;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: A misi with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update misi content');
            return undefined;
        }
    }

    async deleteMisi(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/misi-content/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete misi content');
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

export const misiService = new MisiService();