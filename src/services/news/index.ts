import axios, { AxiosError, AxiosInstance } from 'axios';

export interface NewsContent {
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface CreateNewsData {
    title: string;
    description: string;
}

export interface UpdateNewsData {
    id: number;
    title?: string;
    description?: string;
}

class NewsService {
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

    async createNews(data: CreateNewsData): Promise<NewsContent | undefined> {
        try {
            const response = await this.axiosInstance.post<{
                message: string;
                NewsContent: NewsContent;
            }>('/admin/news-content', data);
            return response.data.NewsContent;
        } catch (error) {
            this.handleError(error, 'Failed to create news content');
            return undefined;
        }
    }

    async getNews(): Promise<NewsContent[]> {
        try {
            const response = await this.axiosInstance.get<{
                NewsContent: NewsContent[];
            }>('/news-content');
            return response.data.NewsContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve news content');
            return [];
        }
    }

    async getNewsById(id: number): Promise<NewsContent | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                NewsContent: NewsContent;
            }>(`/news-content/${id}`);
            return response.data.NewsContent;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve news content');
            return undefined;
        }
    }

    async updateNews(data: UpdateNewsData): Promise<NewsContent | undefined> {
        try {
            const response = await this.axiosInstance.put<{
                message: string;
                NewsContent: NewsContent;
            }>(`/admin/news-content/${data.id}`, data);
            
            return response.data.NewsContent;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: A news item with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update news content');
            return undefined;
        }
    }

    async deleteNews(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/news-content/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete news content');
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

export const newsService = new NewsService();