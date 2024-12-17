import axios, { AxiosError, AxiosInstance } from 'axios';

export interface FooterContent4 {
    id?: number;
    title: string;
    day_1: string;
    time_start_1: string;
    time_end_1: string;
    day_2: string;
    time_start_2: string;
    time_end_2: string;
    day_3: string;
    time_start_3: string;
    time_end_3: string;
    created_at: string;
    updated_at: string;
}

export interface CreateFooterContent4Data {
    title: string;
    day_1: string;
    time_start_1: string;
    time_end_1: string;
    day_2: string;
    time_start_2: string;
    time_end_2: string;
    day_3: string;
    time_start_3: string;
    time_end_3: string;
  }
  
  
export interface UpdateFooterContent4Data {
    id: number;
    title?: string;
    day_1?: string;
    time_start_1?: string;
    time_end_1?: string;
    day_2?: string;
    time_start_2?: string;
    time_end_2?: string;
    day_3?: string;
    time_start_3?: string;
    time_end_3?: string;
}

class FooterContent4Service {
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
                'Content-Type': 'application/json',
            },
        });
    }

    async createFooterContent4(data: CreateFooterContent4Data): Promise<FooterContent4 | undefined> {
        try {
            const response = await this.axiosInstance.post<{
                message: string;
                FooterContent4: FooterContent4;
            }>('/admin/footer/content-4/', data);
            return response.data.FooterContent4;
        } catch (error) {
            this.handleError(error, 'Failed to create FooterContent4');
            return undefined;
        }
    }

    async getFooterContent4(): Promise<FooterContent4[]> {
        try {
          const response = await this.axiosInstance.get<{
            FooterContent4: FooterContent4[];
          }>('/footer/content-4');
          console.log(response.data.FooterContent4);
          
          return response.data.FooterContent4; // Return the array directly
        } catch (error) {
          this.handleError(error, 'Failed to retrieve FooterContent4');
          return [];
        }
      }

    async updateFooterContent4(data: UpdateFooterContent4Data): Promise<FooterContent4 | undefined> {
        try {
            const response = await this.axiosInstance.put<{
                message: string;
                FooterContent4: FooterContent4;
            }>(`/admin/footer/content-4/${data.id}`, data);
            return response.data.FooterContent4;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error('Conflict: A FooterContent4 with this data already exists.');
                }
            }
            this.handleError(error, 'Failed to update FooterContent4');
            return undefined;
        }
    }

    async deleteFooterContent4(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/admin/footer/content-4/${id}`);
        } catch (error) {
            this.handleError(error, 'Failed to delete FooterContent4');
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

export const footercontent4Service = new FooterContent4Service();
