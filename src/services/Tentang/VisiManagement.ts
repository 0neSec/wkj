import axios, { AxiosError, AxiosInstance } from 'axios';

export interface VisiContent {
    id: number;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface CreateVisiData {
    description: string;
}

export interface UpdateVisiData {
    id: number;
    description?: string;
}

class VisiService {
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

    async createVisi(data: CreateVisiData): Promise<VisiContent | undefined> {
        try {
            const response = await this.axiosInstance.post<{
                message: string;
                VisiContent: VisiContent;
            }>('/admin/visi-content', data);
            return response.data.VisiContent;
        } catch (error) {
            this.handleError(error, 'Failed to create visi content');
            return undefined;
        }
    }

    async getVisiList(): Promise<VisiContent[]> {
        try {
            const response = await this.axiosInstance.get<{
                VisiContent: VisiContent[];
            }>('/visi-content');
            return response.data.VisiContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve visi content');
            return [];
        }
    }

    async getVisiById(id: number): Promise<VisiContent | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                VisiContent: VisiContent;
            }>(`/visi-content/${id}`);
            return response.data.VisiContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve visi content');
            return undefined;
        }
    }

    async updateVisi(data: UpdateVisiData): Promise<VisiContent | undefined> {
        try {
            const response = await this.axiosInstance.put<{
                message: string;
                VisiContent: VisiContent;
            }>(`/admin/visi-content/${data.id}`, data);
            
            return response.data.VisiContent;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: A visi with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update visi content');
            return undefined;
        }
    }

    async deleteVisi(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/visi-content/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete visi content');
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

export const visiService = new VisiService();