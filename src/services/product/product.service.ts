import axios, { AxiosError, AxiosInstance } from 'axios';

export interface ProductCategory {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number; // Changed from string to number to match Go model
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
    utilization?: string;
    composition?: string;
    image:  File | string;
    research_results: string;
    description: string;
    price: number;
    unit_type: string;
    product_category_id: number;
    product_category_name: string;
    product_category?: ProductCategory;
    created_at: string;
    updated_at: string;
}

export interface CreateProductData {
    id?: number;
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
    image?: File | string;
    utilization?: string;
    composition?: string;
    research_results?: string;
    description?: string;
    price?: number;
    unit_type?: string;
    product_category_id?: number;
}

export interface UpdateProductData extends CreateProductData {
    id: number; // Changed from string to number to match Go model
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
                if (key === 'utilization') {
                    if (value) {
                        formData.append(key, JSON.stringify({ values: value }));
                    }
                } else if (key === 'composition') {
                    if (value) {
                        formData.append(key, JSON.stringify({ values: value }));
                    }
                } else if (key === 'image') {
                    formData.append('image', value);
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
    
            console.log('Product created:', response);
            return response.data.Product;
        } catch (error) {
            this.handleError(error, 'Failed to create product');
            return undefined;
        }
    }

    async getProduct(id: number): Promise<Product | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                Product: Product;
            }>(`/product/${id}`);
            console.log(response.data);
            
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
                    formData.append('image', value);
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
            if (error instanceof AxiosError && error.response?.status === 409) {
                throw new Error("Conflict: A product with this data already exists.");
            }
            this.handleError(error, 'Failed to update product');
            return undefined;
        }
    }

    async deleteProduct(id: number): Promise<void> {
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
            console.log(response.data.Products);

            return response.data.Products;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve products');
            return [];
        }
    }

    async getProductsByName(name: string): Promise<Product[]> {
        try {
            const response = await this.axiosInstance.get<{
                products: Product[];
            }>('/product/get-name', {
                params: { name }
            });
            return response.data.products;
        } catch (error) {
            this.handleError(error, 'Failed to search products by name');
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
                product_category_name: categoryMap.get(product.product_category_id) || '',
            }));
        } catch (error) {
            this.handleError(error, 'Failed to retrieve products with categories');
            return [];
        }
    }

    async getProductById(id: number): Promise<Product | undefined> {
        try {
            const response = await this.axiosInstance.get<{
                Product: Product;
            }>(`/product/${id}`);
            const product = response.data.Product;
            
            return product;
        } catch (error) {
            this.handleError(error, 'Failed to retrieve product details');
            return undefined;
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