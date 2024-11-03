import axios, { AxiosError, AxiosInstance } from 'axios';
import { ServiceCategory } from '../LayananCategory';

// Types
export interface Service {
    id: string;
    name: string;
    description?: string;
    imageUrl: string;
    serviceCategoryId: string;
    serviceCategory?: ServiceCategory;
}

export interface CreateServiceData {
    name: string;
    description?: string;
    image: File;
    serviceCategoryId: string;
}

export interface UpdateServiceData {
    id: string;
    name?: string;
    description?: string;
    image?: File;
    serviceCategoryId?: string;
}

class LayananService {
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
            if (data.description) {
                formData.append('description', data.description);
            }
            formData.append('image', data.image);
            formData.append('serviceCategoryId', data.serviceCategoryId);

            const response = await this.axiosInstance.post<{ Service: Service }>(
                '/admin/service',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.Service;
        } catch (error) {
            this.handleError(error, 'Failed to create service');
            return undefined;
        }
    }

    async getService(id: string): Promise<Service | undefined> {
        try {
            const response = await this.axiosInstance.get<{ Service: Service }>(`/service/${id}`);
            return response.data.Service;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve service');
            return undefined;
        }
    }

    async updateService(data: UpdateServiceData): Promise<Service | undefined> {
        try {
            const formData = new FormData();
            if (data.name) {
                formData.append('name', data.name);
            }
            if (data.description) {
                formData.append('description', data.description);
            }
            if (data.image) {
                formData.append('image', data.image);
            }
            if (data.serviceCategoryId) {
                formData.append('serviceCategoryId', data.serviceCategoryId);
            }

            const response = await this.axiosInstance.put<{ Service: Service }>(
                `/admin/service/${data.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.Service;
        } catch (error) {
            this.handleError(error, 'Failed to update service');
            return undefined;
        }
    }

    async deleteService(id: string): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/service/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete service');
        }
    }

    async getAllServices(): Promise<Service[]> {
        try {
            const response = await this.axiosInstance.get<{ Service: Service[] }>('/service');
            return response.data.Service;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve services');
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

export const layananService = new LayananService();