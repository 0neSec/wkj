import axios, { AxiosError, AxiosInstance } from 'axios';

export interface ProductCategory {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface CreateProductCategoryData {
    name: string;
}

export interface UpdateProductCategoryData extends CreateProductCategoryData {
    id: number;
}

class ProductCategoryService {
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

    async createProductCategory(data: CreateProductCategoryData): Promise<ProductCategory | undefined> {
        try {
            const response = await this.axiosInstance.post<{
                message: string;
                ProductCategory: ProductCategory;
            }>('/admin/product-category', data);
    
            console.log('Product Category created:', response.data);
            return response.data.ProductCategory;
        } catch (error) {
            this.handleError(error, 'Failed to create product category');
            return undefined;
        }
    }

    async getAllProductCategories(): Promise<ProductCategory[]> {
        try {
            const response = await this.axiosInstance.get<{
                ProductCategory: ProductCategory[];
            }>('/product-category');
            console.log(response.data.ProductCategory);

            return response.data.ProductCategory;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve product categories');
            return [];
        }
    }

    async getProductCategoryById(id: number): Promise<ProductCategory | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                ProductCategory: ProductCategory;
            }>(`/product-category/${id}`);
            
            return response.data.ProductCategory;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve product category details');
            return undefined;
        }
    }

    async updateProductCategory(data: UpdateProductCategoryData): Promise<ProductCategory | undefined> {
        try {
            const response = await this.axiosInstance.put<{
                message: string;
                ProductCategory: ProductCategory;
            }>(`/admin/product-category/${data.id}`, data);
    
            return response.data.ProductCategory;
        } catch (error) {
            this.handleError(error, 'Failed to update product category');
            return undefined;
        }
    }

    async deleteProductCategory(id: number): Promise<boolean> {
        try {
            await this.axiosInstance.delete(`/admin/product-category/${id}`);
            return true;
        } catch (error) {
            this.handleError(error, 'Failed to delete product category');
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

export const productCategoryService = new ProductCategoryService();