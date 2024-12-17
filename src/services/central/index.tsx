import axios, { AxiosError, AxiosInstance } from 'axios';

export interface JamuCenter {
    id: number;
    name: string;
    description: string;
    image?: File | null;
    address: string;
    link_maps: string;
    link_website: string;
    link_facebook: string;
    created_at: string;  // Assuming ISO date format
    updated_at: string;  // Assuming ISO date format
}

export interface CreateJamuCenterData {
    name: string;
    description: string;
    address: string;
    link_maps: string;
    link_website: string;
    link_facebook: string;
    image?: File | null;
}

export interface UpdateJamuCenterData {
    id: number;
    name?: string;
    description?: string;
    address?: string;
    link_maps?: string;
    link_website?: string;
    link_facebook?: string;
    image?: File | null;
}

class JamuCenterService {
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

    async createJamuCenter(data: CreateJamuCenterData): Promise<JamuCenter | undefined> {
        try {
            console.log("Creating Jamu Center with data:", data);
            
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("address", data.address);
            formData.append("link_maps", data.link_maps);
            formData.append("link_website", data.link_website);
            formData.append("link_facebook", data.link_facebook);
            
            if (data.image) {
                console.log("Image file:", data.image);
                formData.append("image", data.image);
            } else {
                console.warn("No image provided");
            }
        
            const response = await this.axiosInstance.post<{
                message: string;
                JamuCenter: JamuCenter;
            }>('/admin/jamu-center', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.JamuCenter;
        } catch (error) {
            console.error("Full error in createJamuCenter:", error);
            this.handleError(error, 'Failed to create JamuCenter');
            return undefined;
        }
    }

    async getJamuCenters(): Promise<JamuCenter[]> {
        try {
            const response = await this.axiosInstance.get<{
                JamuCenter: JamuCenter[];
            }>('/jamu-center');
            console.log(response);
            return response.data.JamuCenter;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve JamuCenters');
            return [];
        }
    }

    async getJamuCenterById(id: number): Promise<JamuCenter | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                JamuCenter: JamuCenter;
            }>(`/jamu-center/${id}`);
            return response.data.JamuCenter;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve JamuCenter by ID');
            return undefined;
        }
    }

    async updateJamuCenter(data: UpdateJamuCenterData): Promise<JamuCenter | undefined> {
        try {
            const formData = new FormData();
            if (data.name) formData.append("name", data.name);
            if (data.description) formData.append("description", data.description);
            if (data.address) formData.append("address", data.address);
            if (data.link_maps) formData.append("link_maps", data.link_maps);
            if (data.link_website) formData.append("link_website", data.link_website);
            if (data.link_facebook) formData.append("link_facebook", data.link_facebook);
            if (data.image) formData.append("image", data.image);

            const response = await this.axiosInstance.put<{
                message: string;
                JamuCenter: JamuCenter;
            }>(`/admin/jamu-center/${data.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.JamuCenter;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: JamuCenter with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update JamuCenter');
            return undefined;
        }
    }

    async deleteJamuCenter(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/jamu-center/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete JamuCenter');
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

export const jamuCenterService = new JamuCenterService();