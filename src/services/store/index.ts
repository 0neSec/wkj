import axios, { AxiosError, AxiosInstance } from 'axios';

export interface HerbalStore {
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

export interface CreateHerbalStoreData {
    name: string;
    description: string;
    address: string;
    link_maps: string;
    link_website: string;
    link_facebook: string;
    image?: File | null;
}

export interface UpdateHerbalStoreData {
    id: number;
    name?: string;
    description?: string;
    address?: string;
    link_maps?: string;
    link_website?: string;
    link_facebook?: string;
    image?: File | null;
}

class HerbalStoreService {
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

    async createHerbalStore(data: CreateHerbalStoreData): Promise<HerbalStore | undefined> {
        try {
          console.log("Creating store with data:", data);
          
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
            HerbalStore: HerbalStore;
          }>('/admin/herbal-store', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          return response.data.HerbalStore;
        } catch (error) {
          console.error("Full error in createHerbalStore:", error);
          this.handleError(error, 'Failed to create HerbalStore');
          return undefined;
        }
      }

    async getHerbalStores(): Promise<HerbalStore[]> {
        try {
            const response = await this.axiosInstance.get<{
                HerbalStore: HerbalStore[];
            }>('/herbal-store');
            console.log(response);
            return response.data.HerbalStore;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve HerbalStores');
            return [];
        }
    }

    async getHerbalStoreById(id: number): Promise<HerbalStore | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                HerbalStore: HerbalStore;
            }>(`/herbal-store/${id}`);
            return response.data.HerbalStore;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve HerbalStore by ID');
            return undefined;
        }
    }

    async updateHerbalStore(data: UpdateHerbalStoreData): Promise<HerbalStore | undefined> {
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
                HerbalStore: HerbalStore;
            }>(`/admin/herbal-store/${data.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.HerbalStore;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: HerbalStore with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update HerbalStore');
            return undefined;
        }
    }

    async deleteHerbalStore(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/herbal-store/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete HerbalStore');
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

export const herbalStoreService = new HerbalStoreService();
