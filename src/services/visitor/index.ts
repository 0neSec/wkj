import axios, { AxiosError, AxiosInstance } from 'axios';

export interface Visitor {
    id: number;
    ip_address: string;
    user_agent: string;
    created_at: string;
}

export interface VisitorCountResponse {
    total_visits: number;
}

class VisitorService {
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

    /**
     * Retrieve all visitors
     * @returns Promise resolving to an array of Visitor objects
     */
    async getAllVisitors(): Promise<Visitor[]> {
        try {
            const response = await this.axiosInstance.get<{
                status: string;
                message: string;
                visitor: Visitor[];
            }>('/visitor');

            console.log('Visitors retrieved:', response.data.visitor);
            return response.data.visitor;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve visitors');
            return [];
        }
    }

    /**
     * Get the total number of visitors
     * @returns Promise resolving to the number of visitors
     */
    async getVisitorCount(): Promise<number> {
        try {
            const response = await this.axiosInstance.get<{
                status: string;
                message: string;
                total_visits: number;
            }>('/visitor/count');

            console.log('Total visits:', response.data.total_visits);
            return response.data.total_visits;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve visitor count');
            return 0;
        }
    }

    /**
     * Handle API errors with consistent error logging and throwing
     * @param error - The caught error
     * @param message - A custom error message
     */
    private handleError(error: unknown, message: string) {
        if (error instanceof AxiosError) {
            console.error(`${message}:`, error.response?.data);
            throw error.response?.data || { error: message };
        }
        console.error(message, error);
        throw { error: message };
    }
}

export const visitorService = new VisitorService();