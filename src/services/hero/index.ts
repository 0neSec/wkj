import axios, { AxiosError, AxiosInstance } from 'axios';

export interface HeroContent {
    id: number;
    title: string;
    description: string;
    image?: File | null;
    created_at: string;
    updated_at: string;
}

export interface CreateHeroContentData {
    title: string;
    description: string;
    image?: File | null;
}

export interface UpdateHeroContentData {
    id: number;
    title?: string;
    description?: string;
    image?: File | null;
}

class HeroContentService {
    private axiosInstance: AxiosInstance;

    constructor() {
        const storageType = localStorage.getItem('storageType');
        const storage = storageType === 'local' ? localStorage : sessionStorage;
        const token = storage.getItem('token');

        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_API_URL,  // Ensure this points to your Go backend
            timeout: 10000,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    async createHeroContent(data: CreateHeroContentData): Promise<HeroContent | undefined> {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            if (data.image) {
                formData.append("image", data.image);
            }

            const response = await this.axiosInstance.post<{
                message: string;
                HeroContent: HeroContent;
            }>('/admin/hero-content/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  // Required for file uploads
                },
            });
            return response.data.HeroContent;
        } catch (error) {
            this.handleError(error, 'Failed to create HeroContent');
            return undefined;
        }
    }

    async getHeroContent(): Promise<HeroContent[]> {
        try {
            const response = await this.axiosInstance.get<{
                HeroContent: HeroContent[];
            }>('/hero-content');
            return response.data.HeroContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve HeroContent');
            return [];
        }
    }

    async getHeroContentById(id: number): Promise<HeroContent | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                HeroContent: HeroContent;
            }>(`/hero-content/${id}`);
            return response.data.HeroContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve HeroContent by ID');
            return undefined;
        }
    }

    async updateHeroContent(data: UpdateHeroContentData): Promise<HeroContent | undefined> {
        try {
            const formData = new FormData();
            if (data.title) formData.append("title", data.title);
            if (data.description) formData.append("description", data.description);
            if (data.image) formData.append("image", data.image);

            const response = await this.axiosInstance.put<{
                message: string;
                HeroContent: HeroContent;
            }>(`/admin/hero-content/${data.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.HeroContent;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: HeroContent with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update HeroContent');
            return undefined;
        }
    }

    async deleteHeroContent(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/hero-content/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete HeroContent');
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

export const heroContentService = new HeroContentService();
