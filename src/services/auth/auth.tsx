import axios, { AxiosInstance } from 'axios';

export interface User {
    id?: number;
    username: string;
    email: string;
    password: string;
    role?: string;
    created_at?: string;
    updated_at?: string;
}
export interface RegisterData {
    username: string;
    email: string;
    password: string;
  }
  

export interface RegisterResponse {
    message: string;
    user: User;
}

export interface LoginResponse {
    username: string;
    email: string;
    role: string;
    token: string;
}

class AuthService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async register(userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'role'>): Promise<RegisterResponse> {
        try {
            const response = await this.axiosInstance.post<RegisterResponse>('/register', userData);
            return response.data;
        } catch (error) {
            // Extract error message from the API response if available
            if (axios.isAxiosError(error) && error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Registration failed. Please try again.');
        }
    }

    async login(credentials: Pick<User, 'email' | 'password'>): Promise<LoginResponse> {
        try {
            const response = await this.axiosInstance.post<LoginResponse>('/login', credentials);
            
            // Store the token and user info
            const storageType = localStorage.getItem('storageType') === 'local' ? localStorage : sessionStorage;
            storageType.setItem('token', response.data.token);
            storageType.setItem('user', JSON.stringify({
                username: response.data.username,
                email: response.data.email,
                role: response.data.role
            }));

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Login failed. Please check your credentials.');
        }
    }

    logout(): void {
        const storageType = localStorage.getItem('storageType') === 'local' ? localStorage : sessionStorage;
        storageType.removeItem('token');
        storageType.removeItem('user');
    }

    isAuthenticated(): boolean {
        const storageType = localStorage.getItem('storageType') === 'local' ? localStorage : sessionStorage;
        return !!storageType.getItem('token');
    }

    getCurrentUser(): { username: string; email: string; role: string } | null {
        const storageType = localStorage.getItem('storageType') === 'local' ? localStorage : sessionStorage;
        const userStr = storageType.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
}

export const authService = new AuthService();