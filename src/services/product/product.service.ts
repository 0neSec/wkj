import axios, { AxiosError, AxiosInstance } from 'axios';
import { ProductCategory } from './product-category.service';

// Updated Types to match Golang structure
export interface Product {
    id: string;
    name: string;
    latin_name: string;
    synonym: string;
    familia: string;
    part_used: string;
    method_of_reproduction: string;
    harvest_age: string;
    morphology: string;
    area_name: string;
    efficacy: string;
    utilization: string[];
    composition: string[];
    image_url: string;
    research_results: string;
    description: string;
    price: number;
    unit_type: string;
    product_category_id: string;
    product_category?: ProductCategory;
    category_name?: string;
    created_at: string;
    product_category_name: string;
    updated_at: string;
}

export interface CreateProductData {
    name: string;
    latin_name: string;
    synonym: string;
    familia: string;
    part_used: string;
    method_of_reproduction: string;
    harvest_age: string;
    morphology: string;
    area_name: string;
    efficacy: string;
    utilization?: string[];
    composition?: string[];
    image: File;
    research_results: string;
    description: string;
    price: number;
    unit_type: string;
    product_category_id: string;
}

export interface UpdateProductData {
    id: string;
    name?: string;
    latin_name?: string;
    synonym?: string;
    familia?: string;
    part_used?: string;
    method_of_reproduction?: string;
    harvest_age?: string;
    morphology?: string;
    area_name?: string;
    efficacy?: string;
    utilization?: string[];
    composition?: string[];
    image?: File;
    research_results?: string;
    description?: string;
    price?: number;
    unit_type?: string;
    product_category_id?: string;
}

class ProductService {
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

    async createProduct(data: CreateProductData): Promise<Product | undefined> {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'utilization' || key === 'composition') {
                    if (value) {
                        formData.append(key, JSON.stringify({ values: value }));
                    }
                } else if (key === 'image') {
                    formData.append('image_url', value);
                } else if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            const response = await this.axiosInstance.post<{
                message: string;
                Product: Product;
            }>('/admin/product', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.Product;
        } catch (error) {
            this.handleError(error, 'Failed to create product');
            return undefined;
        }
    }

    async getProduct(id: string): Promise<Product | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                Product: Product;
            }>(`/product/${id}`);
            return response.data.Product;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve product');
            return undefined;
        }
    }

    async updateProduct(data: UpdateProductData): Promise<Product | undefined> {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'utilization' || key === 'composition') {
                    if (value) {
                        formData.append(key, JSON.stringify({ values: value }));
                    }
                } else if (key === 'image') {
                    formData.append('image_url', value);
                } else if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });
    
            const response = await this.axiosInstance.put<{
                message: string;
                Product: Product;
            }>(`/admin/product/${data.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            return response.data.Product;
    
        } catch (error) {
            // Check if error is AxiosError with 409 (conflict)
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Conflict: A product with this data already exists.");
                }
            }
            this.handleError(error, 'Failed to update product');
            return undefined;
        }
    }
    

    async deleteProduct(id: string): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/product/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete product');
        }
    }

    async getAllProducts(): Promise<Product[]> {
        try {
            const response = await this.axiosInstance.get<{
                Products: Product[];
            }>('/product');
            return response.data.Products;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve products');
            return [];
        }
    }

    async getAllProductsWithCategories(): Promise<Product[]> {
        try {
            const [productsResponse, categoriesResponse] = await Promise.all([
                this.getAllProducts(),
                this.axiosInstance.get<{ ProductCategory: ProductCategory[] }>('/product-category'),
            ]);

            const products = productsResponse;
            const categories = categoriesResponse.data.ProductCategory;
            const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));

            return products.map(product => ({
                ...product,
                category_name: categoryMap.get(product.product_category_id) || '',
            }));
        } catch (error) {
            this.handleError(error, 'Failed to retrieve products with categories');
            return [];
        }
    }

    async getProductById(id: string): Promise<Product | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                Product: Product;
            }>(`/product/${id}`);
            const product = response.data.Product;
            
            if (product && product.product_category_id) {
                const categoryName = await this.getCategoryName(product.product_category_id);
                return {
                    ...product,
                    category_name: categoryName
                };
            }
            
            return product;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve product details');
            return undefined;
        }
    }

    private async getCategoryName(categoryId: string): Promise<string> {
        try {
            const response = await this.axiosInstance.get<{
                ProductCategory: ProductCategory[];
            }>('/product-category');
            const categories = response.data.ProductCategory;
            const category = categories.find(cat => cat.id === categoryId);
            return category ? category.name : '';
        } catch (error) {
            throw new Error('Failed to fetch categories');
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

export const productService = new ProductService();