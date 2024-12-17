import axios, { AxiosError, AxiosInstance } from 'axios';

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
    created_at: string;
    updated_at: string;
}

export interface CreateUserData {
    username: string;
    email: string;
    password: string;
    role: string;
}

export interface UpdateUserData extends CreateUserData {
    id: number;
}

class UserService {
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

    async createUser(data: CreateUserData): Promise<User | undefined> {
        try {
            const response = await this.axiosInstance.post<{
                message: string;
                user: User;
            }>('/admin/user', data);
    
            console.log('User created:', response.data);
            return response.data.user;
        } catch (error) {
            this.handleError(error, 'Failed to create user');
            return undefined;
        }
    }

    async getAllUsers(): Promise<User[]> {
        try {
            const response = await this.axiosInstance.get<{
                user: User[];
            }>('/admin/user');
            console.log(response.data.user);

            return response.data.user;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve users');
            return [];
        }
    }

    async getUserById(id: number): Promise<User | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                user: User;
            }>(`/user/${id}`);
            
            return response.data.user;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve user details');
            return undefined;
        }
    }

    async updateUser(data: UpdateUserData): Promise<User | undefined> {
        try {
            const response = await this.axiosInstance.put<{
                message: string;
                user: User;
            }>(`/admin/user/${data.id}`, data);
    
            return response.data.user;
        } catch (error) {
            this.handleError(error, 'Failed to update user');
            return undefined;
        }
    }

    async deleteUser(id: number): Promise<boolean> {
        try {
            await this.axiosInstance.delete(`/admin/user/${id}`);
            return true;
        } catch (error) {
            this.handleError(error, 'Failed to delete user');
            return false;
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

export const userService = new UserService();
