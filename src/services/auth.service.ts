import axios, { AxiosError, AxiosInstance } from 'axios';

// Environment configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

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
  expiresAt: number; // Added to handle token expiration
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

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
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

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Validate input
      if (!this.validateEmail(data.email)) {
        throw new Error('Invalid email format');
      }

      if (!this.validatePassword(data.password)) {
        throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
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
        throw error.response?.data || { error: 'Login failed. Please check your credentials.' };
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Attempt to notify the server about logout
      await this.axiosInstance.post('/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.clearAuthData();
      if (this.refreshTokenTimeout) {
        clearTimeout(this.refreshTokenTimeout);
      }
    }
  }

  private setAuthData(data: AuthResponse, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // Set expiration time to 1 day (24 hours)
    storage.setItem('token', data.token);
    storage.setItem('username', data.username);
    storage.setItem('role', data.role);
    storage.setItem('email', data.email);
    storage.setItem('expiresAt', expiresAt.toString());
    storage.setItem('storageType', rememberMe ? 'local' : 'session');

    // Set a timeout to clear localStorage after 1 day
    if (rememberMe) {
      setTimeout(() => {
        this.clearAuthData(); // Clear data after 1 day
      }, 24 * 60 * 60 * 1000); // 1 day in milliseconds
    }
  }


  private clearAuthData(): void {
    const storageType = localStorage.getItem('storageType');
    const storage = storageType === 'local' ? localStorage : sessionStorage;

    storage.removeItem('token');
    storage.removeItem('username');
    storage.removeItem('role');
    storage.removeItem('email');
    storage.removeItem('expiresAt'); // Clear expiresAt on logout
    storage.removeItem('storageType');

    // Clear from both storages to ensure complete logout
    localStorage.clear();
    sessionStorage.clear();
  }

  getAuthState(): AuthState {
    const storageType = localStorage.getItem('storageType');
    const storage = storageType === 'local' ? localStorage : sessionStorage;
  
    const expiresAt = parseInt(storage.getItem('expiresAt') || '0', 10);
    const isAuthenticated = !!storage.getItem('token') && Date.now() < expiresAt;
  
    return {
      isAuthenticated,
      username: isAuthenticated ? storage.getItem('username') : null,
      role: isAuthenticated ? storage.getItem('role') : null,
    };
  }

  isAuthenticated(): boolean {
    const { isAuthenticated } = this.getAuthState();
    return isAuthenticated;
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

      if (this.refreshTokenTimeout) {
        clearTimeout(this.refreshTokenTimeout);
      }

      if (expiresIn > TOKEN_REFRESH_THRESHOLD) {
        this.refreshTokenTimeout = setTimeout(
          () => this.refreshToken(),
          expiresIn - TOKEN_REFRESH_THRESHOLD
        );
      } else {
        this.refreshToken();
      }
    } catch (error) {
      console.error('Failed to setup token refresh:', error);
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      const response = await this.axiosInstance.post<AuthResponse>('/refresh-token');
      if (response.data.token) {
        this.setAuthData(response.data);
        this.setupTokenRefresh(response.data.token);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
    }
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getAuthState().isAuthenticated ?
          (localStorage.getItem('token') || sessionStorage.getItem('token')) :
          null;

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
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.logout();
            window.location.href = '/login?session_expired=true';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

export const authService = new AuthService();