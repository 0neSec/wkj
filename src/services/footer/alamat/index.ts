// services/footerContent1Service.ts
import axios, { AxiosError, AxiosInstance } from 'axios';

export interface FooterContent1 {
    id: number;
    title: string;
    description: string;
    image?: File | string;
    created_at: string;
    updated_at: string;
}

export interface CreateFooterContent1Data {
    title: string;
    description: string;
    image?: File | string;
}

export interface UpdateFooterContent1Data {
    id: number;
    title?: string;
    description?: string;
    image?: File | string;
}

class FooterContent1Service {
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

    async createFooterContent1(data: CreateFooterContent1Data): Promise<FooterContent1 | undefined> {
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            
            if (data.image instanceof File) {
                formData.append('image', data.image);
            }
    
            const response = await this.axiosInstance.post<{
                message: string;
                FooterContent1: FooterContent1;
            }>('/admin/footer/content-1/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.FooterContent1;
        } catch (error) {
            this.handleError(error, 'Failed to create footer content');
            return undefined;
        }
    }

    async getFooterContent1(): Promise<FooterContent1[]> {
        try {
            const response = await this.axiosInstance.get<{
                FooterContent1: FooterContent1[];
            }>('content/footer/content-1');
            return response.data.FooterContent1;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve footer content');
            return [];
        }
    }

    async updateFooterContent1(data: UpdateFooterContent1Data): Promise<FooterContent1 | undefined> {
        try {
            const formData = new FormData();
            
            if (data.title !== undefined) {
                formData.append('title', data.title);
            }
            
            if (data.description !== undefined) {
                formData.append('description', data.description);
            }
            
            if (data.image instanceof File) {
                formData.append('image', data.image);
            }
    
            const response = await this.axiosInstance.put<{
                message: string;
                FooterContent1: FooterContent1;
            }>(`/admin/footer/content-1/${data.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            return response.data.FooterContent1;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 409) {
                throw new Error("Conflict: A footer content with this data already exists.");
            }
            this.handleError(error, 'Failed to update footer content');
            return undefined;
        }
    }

    async deleteFooterContent1(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/footer/content-1/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete footer content');
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

export const footerContent1Service = new FooterContent1Service();