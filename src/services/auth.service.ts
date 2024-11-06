import axios, { AxiosError, AxiosInstance } from 'axios';

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before token expires

// Types
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  expiresAt: number;
}

export interface DecodedToken {
  exp: number;
  user_id: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  role: string | null;
}

class AuthService {
  private axiosInstance: AxiosInstance;
  private refreshTokenTimeout?: NodeJS.Timeout;
  private readonly TOKEN_KEY = 'token';
  private readonly USERNAME_KEY = 'username';
  private readonly ROLE_KEY = 'role';
  private readonly EMAIL_KEY = 'email';
  private readonly EXPIRES_AT_KEY = 'expiresAt';
  private readonly STORAGE_TYPE_KEY = 'storageType';

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.initializeAuth();
  }

  private initializeAuth(): void {
    // Check token validity on service initialization
    const token = this.getToken();
    if (token) {
      try {
        const decoded = this.decodeToken(token);
        const expiresIn = decoded.exp * 1000 - Date.now();
        
        if (expiresIn <= 0) {
          // Token has expired, clear auth data
          this.clearAuthData();
        } else {
          // Valid token, setup refresh
          this.setupTokenRefresh(token);
        }
      } catch (error) {
        // Invalid token format, clear auth data
        console.error('Invalid token found:', error);
        this.clearAuthData();
      }
    }
  }

  // Validate email format
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  private validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  private getToken(): string | null {
    const storageType = localStorage.getItem(this.STORAGE_TYPE_KEY);
    const storage = storageType === 'local' ? localStorage : sessionStorage;
    return storage.getItem(this.TOKEN_KEY);
  }

  private getStorage(): Storage {
    const storageType = localStorage.getItem(this.STORAGE_TYPE_KEY);
    return storageType === 'local' ? localStorage : sessionStorage;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Validate input
      if (!this.validateEmail(data.email)) {
        throw new Error('Invalid email format');
      }

      if (!this.validatePassword(data.password)) {
        throw new Error(
          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        );
      }

      const response = await this.axiosInstance.post<AuthResponse>('/register', data);

      if (response.data.token) {
        this.setAuthData(response.data);
        this.setupTokenRefresh(response.data.token);
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data || { error: 'Registration failed. Please try again.' };
      }
      throw error;
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      if (!this.validateEmail(data.email)) {
        throw new Error('Invalid email format');
      }

      const response = await this.axiosInstance.post<AuthResponse>('/login', data);

      if (response.data.token) {
        this.setAuthData(response.data, data.rememberMe);
        this.setupTokenRefresh(response.data.token);
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // 1. Simpan URL redirect sebelum logout
      const redirectUrl = '/login';
      
      // 2. Hapus data auth dari storage terlebih dahulu
      this.clearAuthData();
      
      // 3. Clear timeout refresh token jika ada
      if (this.refreshTokenTimeout) {
        clearTimeout(this.refreshTokenTimeout);
      }

      // 4. Reset axios instance headers
      delete this.axiosInstance.defaults.headers.common['Authorization'];

      // 5. Coba beritahu server tentang logout
      try {
        await this.axiosInstance.post('/logout');
      } catch (error) {
        console.warn('Logout request failed:', error);
        // Tetap lanjutkan proses logout meskipun request gagal
      }

      // 6. Force reload halaman untuk membersihkan state React
      window.location.href = redirectUrl;
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Jika terjadi error, tetap coba clear storage
      this.clearAuthData();
      window.location.href = '/login?error=true';
    }
  }

  private setAuthData(data: AuthResponse, rememberMe: boolean = false): void {
    try {
      const storage = rememberMe ? localStorage : sessionStorage;
      const expiresAt = new Date(data.expiresAt).getTime();

      // Clear any existing data first
      this.clearAuthData();

      // Set new auth data
      storage.setItem(this.TOKEN_KEY, data.token);
      storage.setItem(this.USERNAME_KEY, data.username);
      storage.setItem(this.ROLE_KEY, data.role);
      storage.setItem(this.EMAIL_KEY, data.email);
      storage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
      storage.setItem(this.STORAGE_TYPE_KEY, rememberMe ? 'local' : 'session');

      // Update axios headers
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      // Set expiration timeout
      if (rememberMe) {
        const timeUntilExpiry = expiresAt - Date.now();
        setTimeout(() => {
          this.clearAuthData();
          window.location.href = '/login?session_expired=true';
        }, timeUntilExpiry);
      }
    } catch (error) {
      console.error('Error setting auth data:', error);
      throw new Error('Failed to set authentication data');
    }
  }

  private clearAuthData(): void {
    try {
      // 1. Remove axios authorization header
      delete this.axiosInstance.defaults.headers.common['Authorization'];
      
      // 2. Clear both storage types to be safe
      const itemsToRemove = [
        this.TOKEN_KEY,
        this.USERNAME_KEY,
        this.ROLE_KEY,
        this.EMAIL_KEY,
        this.EXPIRES_AT_KEY,
        this.STORAGE_TYPE_KEY
      ];

      // Clear specific items from both storages
      [localStorage, sessionStorage].forEach(storage => {
        itemsToRemove.forEach(item => {
          try {
            storage.removeItem(item);
          } catch (e) {
            console.warn(`Failed to remove ${item} from storage:`, e);
          }
        });
      });

      // 3. Full clear of both storages as backup
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.error('Failed to clear storage:', e);
      }

    } catch (error) {
      console.error('Error clearing auth data:', error);
      // Last resort: brute force clear
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.error('Critical: Failed to clear storage:', e);
      }
    }
  }

  getAuthState(): AuthState {
    try {
      const storage = this.getStorage();
      const token = storage.getItem(this.TOKEN_KEY);
      const expiresAt = parseInt(storage.getItem(this.EXPIRES_AT_KEY) || '0', 10);
      
      const isAuthenticated = Boolean(token && Date.now() < expiresAt);

      return {
        isAuthenticated,
        username: isAuthenticated ? storage.getItem(this.USERNAME_KEY) : null,
        role: isAuthenticated ? storage.getItem(this.ROLE_KEY) : null,
      };
    } catch (error) {
      console.error('Error getting auth state:', error);
      return {
        isAuthenticated: false,
        username: null,
        role: null,
      };
    }
  }

  isAuthenticated(): boolean {
    return this.getAuthState().isAuthenticated;
  }

  getCurrentUsername(): string | null {
    return this.getAuthState().username;
  }

  private decodeToken(token: string): DecodedToken {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Invalid token format');
    }
  }

  private setupTokenRefresh(token: string): void {
    try {
      const decoded = this.decodeToken(token);
      const expiresIn = decoded.exp * 1000 - Date.now();

      // Clear any existing refresh timeout
      if (this.refreshTokenTimeout) {
        clearTimeout(this.refreshTokenTimeout);
      }

      if (expiresIn > TOKEN_REFRESH_THRESHOLD) {
        // Set up refresh before token expires
        this.refreshTokenTimeout = setTimeout(
          () => this.refreshToken(),
          expiresIn - TOKEN_REFRESH_THRESHOLD
        );
      } else if (expiresIn > 0) {
        // Token is about to expire, refresh immediately
        this.refreshToken();
      } else {
        // Token has expired
        this.clearAuthData();
        window.location.href = '/login?session_expired=true';
      }
    } catch (error) {
      console.error('Failed to setup token refresh:', error);
      this.clearAuthData();
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      const response = await this.axiosInstance.post<AuthResponse>('/refresh-token');
      
      if (response.data.token) {
        // Preserve the current storage type when refreshing
        const storageType = localStorage.getItem(this.STORAGE_TYPE_KEY);
        const rememberMe = storageType === 'local';
        
        this.setAuthData(response.data, rememberMe);
        this.setupTokenRefresh(response.data.token);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuthData();
      window.location.href = '/login?session_expired=true';
    }
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            // Retry the original request with new token
            const token = this.getToken();
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.clearAuthData();
            window.location.href = '/login?session_expired=true';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

// Create and export a singleton instance
export const authService = new AuthService();