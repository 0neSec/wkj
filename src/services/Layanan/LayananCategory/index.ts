import axios, { AxiosError, AxiosInstance } from 'axios';

// Types
export interface ServiceCategory {
    id: string;
    name: string;
}

export interface CreateServiceCategoryData {
    name: string;
}

export interface UpdateServiceCategoryData {
    id: string;
    name: string;
}

class LayananCategoryService {
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

    async createServiceCategory(data: CreateServiceCategoryData): Promise<ServiceCategory | undefined> {
        try {
            const response = await this.axiosInstance.post<ServiceCategory>('/admin/service-category', { name: data.name });
            console.log(response.data);
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to create service category');
            return undefined;
        }
    }

    async getServiceCategory(id: string): Promise<ServiceCategory | undefined> {
        try {
            const response = await this.axiosInstance.get<{ serviceCategory: ServiceCategory }>(`/service-category/${id}`);
            return response.data.serviceCategory;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve service category');
            return undefined;
        }
    }

    async updateServiceCategory(data: UpdateServiceCategoryData): Promise<ServiceCategory | undefined> {
        try {
            const response = await this.axiosInstance.put<ServiceCategory>(`/admin/service-category/${data.id}`, { name: data.name });
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to update service category');
            return undefined;
        }
    }

    async deleteServiceCategory(id: string): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/service-category/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete service category');
        }
    }

async getAllServiceCategories(): Promise<ServiceCategory[]> {
  try {
    const response = await this.axiosInstance.get('/service-category');
    console.log('Response data:', response.data); // Log the entire response data

    return response.data; // Assuming this is where the data should be
  } catch (error) {
    console.error('Error in getAllServiceCategories:', error);
    this.handleError(error, 'Failed to retrieve service categories');
    return [];
  }
}


    // Centralized error handling
    private handleError(error: unknown, message: string) {
        if (error instanceof AxiosError) {
            console.error(`${message}:`, error.response?.data);
            throw error.response?.data || { error: message };
        }
        console.error(message, error);
        throw { error: message };
    }
}

export const layananCategoryService = new LayananCategoryService();
