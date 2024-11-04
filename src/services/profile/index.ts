import axios, { AxiosError, AxiosInstance } from 'axios';

export interface ProfileContent {
    id: number;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface CreateProfileData {
    description: string;
}

export interface UpdateProfileData {
    id: number;
    description?: string;
}

class ProfileService {
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

    async createProfile(data: CreateProfileData): Promise<ProfileContent | undefined> {
        try {
            const response = await this.axiosInstance.post<{
                message: string;
                ProfileContent: ProfileContent;
            }>('/admin/profile-content', data);
            return response.data.ProfileContent;
        } catch (error) {
            this.handleError(error, 'Failed to create profile content');
            return undefined;
        }
    }

    async getProfile(): Promise<ProfileContent[]> {
        try {
            const response = await this.axiosInstance.get<{
                ProfileContent: ProfileContent[];
            }>('/profile-content');
            return response.data.ProfileContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve profile content');
            return [];
        }
    }

    async getProfileById(id: number): Promise<ProfileContent | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                ProfileContent: ProfileContent;
            }>(`/profile-content/${id}`);
            return response.data.ProfileContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve profile content');
            return undefined;
        }
    }

    async updateProfile(data: UpdateProfileData): Promise<ProfileContent | undefined> {
        try {
            const response = await this.axiosInstance.put<{
                message: string;
                ProfileContent: ProfileContent;
            }>(`/admin/profile-content/${data.id}`, data);
            
            return response.data.ProfileContent;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: A profile with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update profile content');
            return undefined;
        }
    }

    async deleteProfile(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/profile-content/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete profile content');
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

export const profileService = new ProfileService();