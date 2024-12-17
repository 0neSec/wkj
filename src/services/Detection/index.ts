import axios, { AxiosError, AxiosInstance } from 'axios';

export type ModelType = 'leaf' | 'fruit' | 'rhizome';

export interface DetectionResult {
    label: string;
    confidence: number;
    model: ModelType;
}

export interface DetectionRequest {
    file: File;
    model: ModelType;
}

class DetectionService {
    private axiosInstance: AxiosInstance;
    private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

    constructor() {
        const storageType = localStorage.getItem('storageType');
        const storage = storageType === 'local' ? localStorage : sessionStorage;
        const token = storage.getItem('token');
        
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_API_AI_URL,
            timeout: 15000, // Increased timeout for image upload
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    validateFile(file: File): void {
        if (!this.ALLOWED_TYPES.includes(file.type)) {
            throw new Error('Format file tidak didukung. Silakan unggah file JPG atau PNG.');
        }

        if (file.size > this.MAX_FILE_SIZE) {
            throw new Error('Ukuran file terlalu besar. Maksimum 5MB.');
        }
    }

    async createDetection(data: DetectionRequest): Promise<DetectionResult> {
        try {
            this.validateFile(data.file);

            const formData = new FormData();
            formData.append('file', data.file);
            formData.append('model', data.model);

            const response = await this.axiosInstance.post<{
                label: string;
                confidence: number;
                model: ModelType;
            }>('/api/predict', formData);

            console.log("detection",response);
            return {
                label: response.data.label,
                confidence: response.data.confidence,
                model: response.data.model
            };
            
        } catch (error) {
            this.handleError(error, 'Gagal memproses deteksi');
            throw error;
        }
    }

    getModelTypes(): ModelType[] {
        return ['leaf', 'fruit', 'rhizome'];
    }

    private handleError(error: unknown, message: string) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 413) {
                throw new Error("Ukuran file terlalu besar. Silakan unggah file yang lebih kecil.");
            }
            if (error.response?.status === 415) {
                throw new Error("Format file tidak didukung. Silakan unggah file gambar.");
            }
            if (error.response?.status === 401) {
                throw new Error("Sesi telah berakhir. Silakan login kembali.");
            }
            console.error(`${message}:`, error.response?.data);
            throw error.response?.data || { error: message };
        }
        console.error(message, error);
        throw new Error(message);
    }
}

export const detectionService = new DetectionService();