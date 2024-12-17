import axios, { AxiosError, AxiosInstance } from 'axios';

export interface FooterContent2 {
    id: number;
    title: string;
    link_maps: string;
    created_at: string;
    updated_at: string;
}

export interface CreateFooterContent2Data {
    title: string;
    link_maps: string;
}

export interface UpdateFooterContent2Data {
    id: number;
    title?: string;
    link_maps?: string;
}

class FooterContent2Service {
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
                'Content-Type': 'application/json'
            },
        });
    }

    async createFooterContent2(data: CreateFooterContent2Data): Promise<FooterContent2 | undefined> {
        try {
            const response = await this.axiosInstance.post<{
                message: string;
                FooterContent2: FooterContent2;
            }>('/admin/footer/content-2/', data);
            return response.data.FooterContent2;
        } catch (error) {
            this.handleError(error, 'Failed to create footer content 2');
            return undefined;
        }
    }

    async getFooterContent2(): Promise<FooterContent2[]> {
        try {
            const response = await this.axiosInstance.get<{
                FooterContent2: FooterContent2[];
            }>('/content/footer/content-2');
            return response.data.FooterContent2;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve footer content 2');
            return [];
        }
    }

    async updateFooterContent2(data: UpdateFooterContent2Data): Promise<FooterContent2 | undefined> {
        try {
            const response = await this.axiosInstance.put<{
                message: string;
                FooterContent2: FooterContent2;
            }>(`/admin/footer/content-2/${data.id}`, data);
            
            return response.data.FooterContent2;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: A footer content 2 with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update footer content 2');
            return undefined;
        }
    }

    async deleteFooterContent2(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/footer/content-2/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete footer content 2');
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

export const footerContent2Service = new FooterContent2Service();