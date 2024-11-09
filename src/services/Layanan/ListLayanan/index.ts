import axios, { AxiosError, AxiosInstance } from 'axios';

export interface Service {
    id: number;
    name: string;
    description: string;
    imageURL: string;
    serviceCategoryId: number;
    serviceCategory?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

export interface CreateServiceData {
    name: string;
    description: string;
    serviceCategoryId: number;
    image?: File;
  }

export interface UpdateServiceData {
    id: number;
    name: string;
    description: string;
    serviceCategoryId: number;
    image?: File;
  }

class ServiceApiClient {
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

    async createService(data: CreateServiceData): Promise<Service | undefined> {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('serviceCategoryId', data.serviceCategoryId.toString());
            if (data.image) {
                formData.append('image', data.image);
            }

            const response = await this.axiosInstance.post<{
                message: string;
                Service: Service;
            }>('/admin/service', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.Service;
        } catch (error) {
            this.handleError(error, 'Failed to create service');
            return undefined;
        }
    }

    async updateService(data: UpdateServiceData): Promise<Service | undefined> {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('serviceCategoryId', data.serviceCategoryId.toString());
            if (data.image) {
                formData.append('image', data.image);
            }

            const response = await this.axiosInstance.post<{
                message: string;
                Service: Service;
            }>(`/admin/service/${data.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.Service;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: A service with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update service');
            return undefined;
        }
    }

    async getServices(): Promise<Service[]> {
        try {
            const response = await this.axiosInstance.get<{
                Service: Service[];
            }>('/service');
            return response.data.Service;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve services');
            return [];
        }
    }

    async getServiceById(id: number): Promise<Service | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                Service: Service;
            }>(`/service/${id}`);
            return response.data.Service;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve service');
            return undefined;
        }
    }

    async deleteService(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/service/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete service');
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

export const serviceApiClient = new ServiceApiClient();