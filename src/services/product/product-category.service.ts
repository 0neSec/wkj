import axios, { AxiosError, AxiosInstance } from 'axios';

// Common types
export interface ProductCategory {
  id: number;
  name: string;
}

// Data transfer types
export interface CreateCategoryData {
  name: string;
}

export interface UpdateCategoryData {
  id: string;
  name?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  image: File;
  product_category_id: string;
}

export interface UpdateProductData {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  image?: File;
  product_category_id?: string;
}

// Base service class with common functionality
abstract class BaseService {
  protected axiosInstance: AxiosInstance;
  
  constructor() {
    const storageType = localStorage.getItem('storageType');
    const storage = storageType === 'local' ? localStorage : sessionStorage;
    const token = storage.getItem('token');

    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  protected handleAxiosError(error: unknown, defaultMessage: string): never {
    if (error instanceof AxiosError) {
      throw error.response?.data || { error: defaultMessage };
    }
    throw error;
  }
}

// Product Category Service
class ProductCategoryService extends BaseService {
  async createCategory(data: CreateCategoryData): Promise<ProductCategory> {
    try {
      const response = await this.axiosInstance.post<ProductCategory>('/admin/product-category', data);
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to create category. Please try again.');
    }
  }

  async getCategory(id: string): Promise<ProductCategory> {
    try {
      const response = await this.axiosInstance.get<ProductCategory>(`/admin/product-category/${id}`);
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to retrieve category. Please try again.');
    }
  }

  async updateCategory(data: UpdateCategoryData): Promise<ProductCategory> {
    try {
      const response = await this.axiosInstance.put<ProductCategory>(`/admin/product-category/${data.id}`, data);
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to update category. Please try again.');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/admin/product-category/${id}`);
    } catch (error) {
      this.handleAxiosError(error, 'Failed to delete category. Please try again.');
    }
  }

  async getAllCategories(): Promise<ProductCategory[]> {
    try {
      const response = await this.axiosInstance.get<ProductCategory[]>('/product-category');
      return response.data; // Adjust based on actual API response
    } catch (error) {
      this.handleAxiosError(error, 'Failed to retrieve categories. Please try again.');
    }
  }
}

export const productCategoryService = new ProductCategoryService();