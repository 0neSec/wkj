import axios, { AxiosError, AxiosInstance } from 'axios';

export interface ServiceCategoryContent {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface CreateServiceCategoryData {
    name: string;
}

export interface UpdateServiceCategoryData {
    id: number;
    name?: string;
}

class ServiceCategoryService {
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

    async createServiceCategory(data: CreateServiceCategoryData): Promise<ServiceCategoryContent | undefined> {
        try {
            const response = await this.axiosInstance.post<{
                message: string;
                ServiceCategory: ServiceCategoryContent;
            }>('/admin/service-category', data);
            return response.data.ServiceCategory;
        } catch (error) {
            this.handleError(error, 'Failed to create service category');
            return undefined;
        }
    }

    async getServiceCategories(): Promise<ServiceCategoryContent[]> {
        try {
            const response = await this.axiosInstance.get<{
                ServiceCategory: ServiceCategoryContent[];
            }>('/service-category');
            return response.data.ServiceCategory;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve service categories');
            return [];
        }
    }

    async getServiceCategoryById(id: number): Promise<ServiceCategoryContent | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                ServiceCategory: ServiceCategoryContent;
            }>(`/service-category/${id}`);
            return response.data.ServiceCategory;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve service category');
            return undefined;
        }
    }

    async updateServiceCategory(data: UpdateServiceCategoryData): Promise<ServiceCategoryContent | undefined> {
        try {
            const response = await this.axiosInstance.put<{
                message: string;
                ServiceCategory: ServiceCategoryContent;
            }>(`/admin/service-category/${data.id}`, data);
            
            return response.data.ServiceCategory;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: A service category with this name already exists.");
                }
            }
            this.handleError(error, 'Failed to update service category');
            return undefined;
        }
    }

    async deleteServiceCategory(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/service-category/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete service category');
        }
    }

    async searchServiceCategories(query: string): Promise<ServiceCategoryContent[]> {
        try {
            const response = await this.axiosInstance.get<{
                ServiceCategory: ServiceCategoryContent[];
            }>(`/service-category/search?query=${encodeURIComponent(query)}`);
            return response.data.ServiceCategory;
        } catch (error) {
            this.handleError(error, 'Failed to search service categories');
            return [];
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

export const serviceCategoryService = new ServiceCategoryService();