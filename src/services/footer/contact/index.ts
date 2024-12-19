import axios, { AxiosError, AxiosInstance } from 'axios';

export interface FooterContent3 {
    id: number;
    title: string;
    description1: string;
    description2: string;
    created_at: string;
    updated_at: string;
}

export interface CreateFooterContent3Data {
    title: string;
    description1: string;
    description2: string;
}

export interface UpdateFooterContent3Data {
    id: number;
    title?: string;
    description1?: string;
    description2?: string;
}

class FooterContent3Service {
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

    async createFooterContent3(data: CreateFooterContent3Data): Promise<FooterContent3 | undefined> {
        try {
            const response = await this.axiosInstance.post<{
                message: string;
                FooterContent3: FooterContent3;
            }>('/admin/footer/content-3/', data);
            return response.data.FooterContent3;
        } catch (error) {
            this.handleError(error, 'Failed to create footer content 3');
            return undefined;
        }
    }

    async getFooterContent3(): Promise<FooterContent3[]> {
        try {
            const response = await this.axiosInstance.get<{
                FooterContent3: FooterContent3[];
            }>('/footer/content-3');
            return response.data.FooterContent3;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve footer content 3');
            return [];
        }
    }

    async updateFooterContent3(data: UpdateFooterContent3Data): Promise<FooterContent3 | undefined> {
        try {
            const response = await this.axiosInstance.put<{
                message: string;
                FooterContent3: FooterContent3;
            }>(`/admin/footer/content-3/${data.id}`, data);
            
            return response.data.FooterContent3;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: A footer content 3 with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update footer content 3');
            return undefined;
        }
    }

    async deleteFooterContent3(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/footer/content-3/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete footer content 3');
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

export const footerContent3Service = new FooterContent3Service();