import axios, { AxiosError, AxiosInstance } from 'axios';

export interface FooterContent6 {
    id?: number;
    title: string;
    link_ig: string;
    link_email: string;
    created_at: string;
    updated_at: string;
}

export interface CreateFooterContent6Data {
    title: string;
    link_ig: string;
    link_email: string;
}

export interface UpdateFooterContent6Data {
    id?: number;
    title: string;
    link_ig: string;
    link_email: string;
}

class FooterContent6Service {
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
                'Content-Type': 'application/json',
            },
        });
    }

    async createFooterContent6(data: CreateFooterContent6Data): Promise<FooterContent6 | undefined> {
        try {
            const response = await this.axiosInstance.post<{
                message: string;
                FooterContent6: FooterContent6;
            }>('/admin/footer/content-6/', data);
            return response.data.FooterContent6;
        } catch (error) {
            this.handleError(error, 'Failed to create FooterContent6');
            return undefined;
        }
    }

    async getFooterContent6(): Promise<FooterContent6[]> {
        try {
            const response = await this.axiosInstance.get<{
                FooterContent6: FooterContent6[];
            }>('/footer/content-6');
            console.log(response.data.FooterContent6);

            return response.data.FooterContent6; // Return the array directly
        } catch (error) {
            this.handleError(error, 'Failed to retrieve FooterContent6');
            return [];
        }
    }

    async updateFooterContent6(data: UpdateFooterContent6Data): Promise<FooterContent6 | undefined> {
        try {
            const response = await this.axiosInstance.put<{
                message: string;
                FooterContent6: FooterContent6;
            }>(`/admin/footer/content-6/${data.id}`, data);
            return response.data.FooterContent6;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error('Conflict: A FooterContent6 with this data already exists.');
                }
            }
            this.handleError(error, 'Failed to update FooterContent6');
            return undefined;
        }
    }

    async deleteFooterContent6(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/footer/content-6/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete FooterContent6');
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

export const footercontent6Service = new FooterContent6Service();
