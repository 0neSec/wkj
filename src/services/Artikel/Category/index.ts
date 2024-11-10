import axios, { AxiosError, AxiosInstance } from 'axios';

export interface ArticleCategory {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface CreateArticleCategoryData {
    name: string;
}

export interface UpdateArticleCategoryData {
    id: number;
    name?: string;
}

class ArticleCategoryService {
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

    async createArticleCategory(data: CreateArticleCategoryData): Promise<ArticleCategory | undefined> {
        try {
            const response = await this.axiosInstance.post<{
                message: string;
                ArticleCategory: ArticleCategory;
            }>('/admin/article-category', data);
            return response.data.ArticleCategory;
        } catch (error) {
            this.handleError(error, 'Failed to create article category');
            return undefined;
        }
    }

    async getArticleCategories(): Promise<ArticleCategory[]> {
        try {
            const response = await this.axiosInstance.get<{
                ArticleCategory: ArticleCategory[];
            }>('/article-category');
            return response.data.ArticleCategory;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve article categories');
            return [];
        }
    }

    async getArticleCategoryById(id: number): Promise<ArticleCategory | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                ArticleCategory: ArticleCategory;
            }>(`/article-category/${id}`);
            return response.data.ArticleCategory;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve article category');
            return undefined;
        }
    }

    async updateArticleCategory(data: UpdateArticleCategoryData): Promise<ArticleCategory | undefined> {
        try {
            const response = await this.axiosInstance.put<{
                message: string;
                ArticleCategory: ArticleCategory;
            }>(`/admin/article-category/${data.id}`, data);
            
            return response.data.ArticleCategory;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: An article category with this name already exists.");
                }
            }
            this.handleError(error, 'Failed to update article category');
            return undefined;
        }
    }

    async deleteArticleCategory(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/article-category/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete article category');
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

export const articleCategoryService = new ArticleCategoryService();