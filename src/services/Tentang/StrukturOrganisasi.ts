import axios, { AxiosError, AxiosInstance } from 'axios';

export interface OrganizationStructureContent {
    id: number;
    image_url: string;
    created_at: string;
    updated_at: string;
}

export interface CreateOrganizationStructureData {
    image_url?: File;
}

export interface UpdateOrganizationStructureData {
    id: number;
    image_url?: File;
}

class OrganizationStructureService {
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
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    async createOrganizationStructure(data: CreateOrganizationStructureData): Promise<OrganizationStructureContent | undefined> {
        try {
            const formData = new FormData();
            if (data.image_url) {
                formData.append('image_url', data.image_url);
            }

            const response = await this.axiosInstance.post<{
                message: string;
                OrganizationStructureContent: OrganizationStructureContent;
            }>('/admin/os-content', formData);

            return response.data.OrganizationStructureContent;
        } catch (error) {
            this.handleError(error, 'Failed to create organization structure content');
            return undefined;
        }
    }

    async getOrganizationStructures(): Promise<OrganizationStructureContent[]> {
        try {
            const response = await this.axiosInstance.get<{
                OrganizationStructureContent: OrganizationStructureContent[];
            }>('/os-content');
            console.log(response.data.OrganizationStructureContent);
            
            return response.data.OrganizationStructureContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve organization structure content');
            return [];
        }
    }

    async getOrganizationStructureById(id: number): Promise<OrganizationStructureContent | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                OrganizationStructureContent: OrganizationStructureContent;
            }>(`/os-content/${id}`);
            return response.data.OrganizationStructureContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve organization structure content');
            return undefined;
        }
    }

    async updateOrganizationStructure(data: UpdateOrganizationStructureData): Promise<OrganizationStructureContent | undefined> {
        try {
            const formData = new FormData();
            if (data.image_url) {
                formData.append('image_url', data.image_url);
            }

            const response = await this.axiosInstance.put<{
                message: string;
                OrganizationStructureContent: OrganizationStructureContent;
            }>(`/admin/os-content/${data.id}`, formData);
            console.log(response.data.OrganizationStructureContent);
            
            
            return response.data.OrganizationStructureContent;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: An organization structure with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update organization structure content');
            return undefined;
        }
    }

    async deleteOrganizationStructure(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/os-content/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete organization structure content');
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

export const organizationStructureService = new OrganizationStructureService();