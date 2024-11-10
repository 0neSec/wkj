import axios, { AxiosError, AxiosInstance } from 'axios';

export interface ArticleCategory {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Article {
    id: number;
    name: string;
    description: string;
    image_url: string;
    article_category_id: number;
    article_category: ArticleCategory;
    created_at: string;
    updated_at: string;
}

export interface CreateArticleData {
    name: string;
    description: string;
    image_url?: File;
    article_category_id: number;
}

export interface UpdateArticleData {
    id: number;
    name?: string;
    description?: string;
    image_url?: File;
    article_category_id?: number;
}

class ArticleService {
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

    async createArticle(data: CreateArticleData): Promise<Article | undefined> {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('article_category_id', data.article_category_id.toString());
            
            if (data.image_url) {
                formData.append('image_url', data.image_url);
            }

            const response = await this.axiosInstance.post<{
                message: string;
                article: Article;
            }>('/admin/article', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            return response.data.article;
        } catch (error) {
            this.handleError(error, 'Failed to create article');
            return undefined;
        }
    }

    async getArticles(): Promise<Article[]> {
        try {
            const response = await this.axiosInstance.get<{
                article: Article[];
            }>('/article');
            console.log(response.data.article);
            
            return response.data.article;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve articles');
            return [];
        }
    }

    async getArticleById(id: number): Promise<Article | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                article: Article;
            }>(`/article/${id}`);
            return response.data.article;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve article');
            return undefined;
        }
    }

    async updateArticle(data: UpdateArticleData): Promise<Article | undefined> {
        try {
            const formData = new FormData();
            
            if (data.name) formData.append('name', data.name);
            if (data.description) formData.append('description', data.description);
            if (data.article_category_id) {
                formData.append('article_category_id', data.article_category_id.toString());
            }
            if (data.image_url) {
                formData.append('image_url', data.image_url);
            }

            const response = await this.axiosInstance.put<{
                message: string;
                article: Article;
            }>(`/admin/article/${data.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            return response.data.article;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: An article with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update article');
            return undefined;
        }
    }

    async deleteArticle(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/article/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete article');
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

export const articleService = new ArticleService();