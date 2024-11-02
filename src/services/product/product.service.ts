import axios, { AxiosError, AxiosInstance } from 'axios';
import { ProductCategory } from './product-category.service';


// Types
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    product_category_id: string;
    category_name?: string; // Added field for category name
}

export interface CreateProductData {
    name: string;
    description: string;
    price: number;
    image: File;
    product_category_id: string;
    category_name?: string; // Added field for category name
}

export interface UpdateProductData {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    image?: File;
    product_category_id?: string;
}

class ProductService {
    private axiosInstance: AxiosInstance;

    constructor() {
        const storageType = localStorage.getItem('storageType');
        const storage = storageType === 'local' ? localStorage : sessionStorage;
        const token = storage.getItem('token');
        console.log('token : ',token);
        
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            timeout: 10000,
            headers: {
                Authorization: `Bearer ${token}`, // Corrected syntax for Bearer token
            },
        });
    }

    async createProduct(data: CreateProductData): Promise<Product | undefined> {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('price', data.price.toString());
            formData.append('image', data.image);
            formData.append('product_category_id', data.product_category_id);

            const categoryName = await this.getCategoryName(data.product_category_id);
            formData.append('category_name', categoryName); // Append category name
            
            const response = await this.axiosInstance.post<Product>('/admin/product', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to create product');
            return undefined; // Ensure return type consistency
        }
    }

    async getProduct(id: string): Promise<Product | undefined> {
        try {
            const response = await this.axiosInstance.get<Product>(`/admin/product/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve product');
            return undefined; // Ensure return type consistency
        }
    }

    async updateProduct(data: UpdateProductData): Promise<Product | undefined> {
        try {
            const formData = new FormData();
            formData.append('name', data.name || '');
            formData.append('description', data.description || '');
            formData.append('price', data.price?.toString() || '');
            formData.append('product_category_id', data.product_category_id || '');

            const categoryName = await this.getCategoryName(data.product_category_id || '');
            formData.append('category_name', categoryName); // Append category name

            if (data.image) {
                formData.append('image', data.image);
            }

            const response = await this.axiosInstance.put<Product>(`/admin/product/${data.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to update product');
            return undefined; // Ensure return type consistency
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
            const response = await this.axiosInstance.get<{ Product: Product[] }>('/product');
            return response.data.Product;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve products');
            return []; // Ensure return type consistency
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

            const productsWithCategories = products.map(product => ({
                ...product,
                category_name: categoryMap.get(product.product_category_id) || '',
            }));
            console.log('log',productsResponse);
            

            return productsWithCategories;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve products with categories');
            return []; // Ensure return type consistency
        }
    }

    // Helper function to get category name from ID
    private async getCategoryName(categoryId: string): Promise<string> {
        try {
            const response = await this.axiosInstance.get<{ ProductCategory: ProductCategory[] }>('/product-category');
            const categories = response.data.ProductCategory;
            const category = categories.find(cat => cat.id === categoryId);
            return category ? category.name : ''; // Return category name or empty string if not found
        } catch (error) {
            throw new Error('Failed to fetch categories');
        }
    }

    // Centralized error handling
    private handleError(error: unknown, message: string) {
        if (error instanceof AxiosError) {
            console.error(`${message}:`, error.response?.data);
            throw error.response?.data || { error: message };
        }
        console.error(message, error);
        throw { error: message };
    }
    async getProductById(id: string): Promise<Product | undefined> {
        try {
            const response = await this.axiosInstance.get<{ Product: Product }>(`/product/${id}`);
            const product = response.data.Product;
            
            // Get category name if product exists
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
}

export const productService = new ProductService();
