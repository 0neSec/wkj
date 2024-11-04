import axios, { AxiosError, AxiosInstance } from 'axios';

export interface HistoryContent {
    id: number;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface CreateHistoryData {
    description: string;
}

export interface UpdateHistoryData {
    id: number;
    description?: string;
}

class HistoryService {
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

    async createHistory(data: CreateHistoryData): Promise<HistoryContent | undefined> {
        try {
            const response = await this.axiosInstance.post<{
                message: string;
                historyContent: HistoryContent;
            }>('/admin/history-content', data);
            return response.data.historyContent;
        } catch (error) {
            this.handleError(error, 'Failed to create history content');
            return undefined;
        }
    }

    async getHistory(): Promise<HistoryContent[]> {
        try {
            const response = await this.axiosInstance.get<{
                historyContent: HistoryContent[];
            }>('/history-content');
            return response.data.historyContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve history content');
            return [];
        }
    }

    async getHistoryById(id: number): Promise<HistoryContent | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                historyContent: HistoryContent;
            }>(`/history-content/${id}`);
            return response.data.historyContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve history content');
            return undefined;
        }
    }

    async updateHistory(data: UpdateHistoryData): Promise<HistoryContent | undefined> {
        try {
            const response = await this.axiosInstance.put<{
                message: string;
                historyContent: HistoryContent;
            }>(`/admin/history-content/${data.id}`, data);
            return response.data.historyContent;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: A history record with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update history content');
            return undefined;
        }
    }

    async deleteHistory(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/history-content/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete history content');
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

export const historyService = new HistoryService();
