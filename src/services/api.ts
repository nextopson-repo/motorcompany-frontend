import type { Vehicle, User } from '../types';
import { API_CONFIG, API_ENDPOINTS, DEFAULT_HEADERS } from '../config/api';

// API Response Types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Backend temp cars shapes
interface TempCarImageRaw { id?: string; imageKey?: string }
interface TempCarAddressRaw { locality?: string; city?: string; state?: string }
interface TempCarUserRaw { fullName?: string }
interface TempCarRaw {
  id: string;
  title?: string;
  carName?: string;
  carImages?: TempCarImageRaw[];
  images?: string[];
  brand?: string;
  model?: string;
  manufacturingYear?: number;
  registrationYear?: number;
  carPrice?: number;
  kmDriven?: number;
  fuelType?: string;
  transmission?: string;
  address?: TempCarAddressRaw;
  user?: TempCarUserRaw;
}

interface TempCarsResponseRaw {
  cars: TempCarRaw[];
  pagination: { total?: number; page?: number; limit?: number; totalPages?: number };
  message?: string;
}

// HTTP Client
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = DEFAULT_HEADERS;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        ...options,
      };

      // Build headers and inject auth token (sessionToken preferred, fallback to authToken)
      const headers: Record<string, string> = {
        ...this.defaultHeaders,
        ...(options.headers as Record<string, string> | undefined),
      };

      const sessionToken = localStorage.getItem('sessionToken') || localStorage.getItem('authToken');
      if (sessionToken) {
        headers.Authorization = `Bearer ${sessionToken}`;
      }

      config.headers = headers;

      const response = await fetch(url, config);
      const data = await response.json() as { data?: T; message?: string };

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data as T,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_CONFIG.BASE_URL);

// Vehicle API Service
export class VehicleApiService {
  static async getAllVehicles(params?: {
    page?: number;
    limit?: number;
    search?: string;
    brand?: string;
    fuelType?: string;
    transmission?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<PaginatedResponse<Vehicle>>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `${API_ENDPOINTS.GET_CARS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    // We expect backend to return { cars: [...], pagination: {...} }
    const res = await apiClient.get<TempCarsResponseRaw>(endpoint);
    if (!res.success || !res.data) return (res as unknown) as ApiResponse<PaginatedResponse<Vehicle>>;

    const cars = Array.isArray(res.data.cars) ? res.data.cars : [];
    const pagination = res.data.pagination || {};

    // Map backend car to frontend Vehicle type minimally
    const mapped: Vehicle[] = cars.map((c) => ({
      ...c, // spread all backend fields
      id: c.id,
      title: c.title || c.carName || '',
      image:
        c.carImages?.[0]?.imageKey ||
        c.images?.[0] ||
        '',
      owner: c.user?.fullName || '',
    }));

    return {
      success: true,
      data: {
        data: mapped,
        total: pagination.total ?? mapped.length,
        page: pagination.page ?? 1,
        limit: pagination.limit ?? mapped.length,
        totalPages: pagination.totalPages ?? 1,
      },
      message: res.message,
    };
  }

  static async getVehicleById(id: string): Promise<ApiResponse<Vehicle>> {
    return apiClient.get<Vehicle>(`/vehicles/${id}`);
  }

  static async createVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<ApiResponse<Vehicle>> {
    return apiClient.post<Vehicle>('/vehicles', vehicle);
  }

  // static async updateVehicle(id: string, vehicle: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> {
  //   return apiClient.put<Vehicle>(`/vehicles/${id}`, vehicle);
  // }

  static async deleteVehicle(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/temp/cars/${id}`);
  }

  static async uploadVehicleImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);

        try {
          const sessionToken = localStorage.getItem('sessionToken');
          const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPLOAD_IMAGE}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
            body: formData,
          });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return {
        success: true,
        data: { url: data.data.url },
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  // Upload car to temp system
  static async uploadCar(formData: FormData): Promise<ApiResponse<{ car: unknown }>> {
        try {
          const sessionToken = localStorage.getItem('sessionToken');
          const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPLOAD_CAR}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
            body: formData,
          });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Car upload failed');
      }

      return {
        success: true,
        data: { car: data },
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Car upload failed',
      };
    }
  }

}

// User API Service
export class UserApiService {
  static async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
  }): Promise<ApiResponse<PaginatedResponse<User>>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/temp/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    // Backend likely returns { users: [...], pagination: {...} }
    const res = await apiClient.get<{ users?: User[]; pagination?: { total?: number; page?: number; limit?: number; totalPages?: number }; message?: string }>(endpoint);
    if (!res.success || !res.data) return (res as unknown) as ApiResponse<PaginatedResponse<User>>;

    const users = Array.isArray(res.data.users) ? res.data.users : [];
    const pagination = res.data.pagination || {};

    return {
      success: true,
      data: {
        data: users,
        total: pagination.total ?? users.length,
        page: pagination.page ?? 1,
        limit: pagination.limit ?? users.length,
        totalPages: pagination.totalPages ?? 1,
      },
      message: res.message,
    };
  }

  static async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/users/${id}`);
  }

  static async createUser(user: Omit<User, 'id' | 'created'>): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/users', user);
  }

  static async updateUser(id: string, user: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`/users/${id}`, user);
  }

  static async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`temp/users/${id}`);
  }
}

// Auth API Service
export class AuthApiService {
      // Signup user
      static async signup(userData: {
        fullName: string;
        mobileNumber: string;
        userType: 'Owner' | 'Dealer' | 'EndUser';
      }): Promise<ApiResponse<{ user: User }>> {
        return apiClient.post<{ user: User }>(API_ENDPOINTS.SIGNUP_SEND_OTP, userData);
      }

      // Login user
      static async login(mobileNumber: string): Promise<ApiResponse<{ 
        user: User; 
        sessionToken: string; 
        loginTime: string; 
      }>> {
        return apiClient.post<{ 
          user: User; 
          sessionToken: string; 
          loginTime: string; 
        }>(API_ENDPOINTS.LOGIN_SEND_OTP, { mobileNumber });
      }

      // Legacy methods for backward compatibility
      static async loginWithEmail(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
        return apiClient.post<{ user: User; token: string }>('/auth/login', { email, password });
      }

  static async register(userData: {
    name: string;
    email: string;
    password: string;
    mobile: string;
    type: 'Owner' | 'Dealer' | 'EndUser';
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiClient.post<{ user: User; token: string }>('/auth/register', userData);
  }

  static async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/logout', {});
  }

  static async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return apiClient.post<{ token: string }>('/auth/refresh', {});
  }

  static async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/forgot-password', { email });
  }

  static async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/reset-password', { token, password });
  }
}

// Statistics API Service
export class StatsApiService {
  static async getDashboardStats(): Promise<ApiResponse<{
    totalVehicles: number;
    totalUsers: number;
    totalRevenue: number;
    recentVehicles: Vehicle[];
    topBrands: { brand: string; count: number }[];
  }>> {
    return apiClient.get('/stats/dashboard');
  }

  static async getVehicleStats(): Promise<ApiResponse<{
    byCondition: { condition: string; count: number }[];
    byFuelType: { fuelType: string; count: number }[];
    byTransmission: { transmission: string; count: number }[];
    averagePrice: number;
    priceRange: { min: number; max: number };
  }>> {
    return apiClient.get('/stats/vehicles');
  }
}

// Utility functions
export const handleApiError = (error: string): string => {
  // Map common API errors to user-friendly messages
  const errorMessages: Record<string, string> = {
    'Unauthorized': 'Please log in to continue',
    'Forbidden': 'You do not have permission to perform this action',
    'Not Found': 'The requested resource was not found',
    'Validation Error': 'Please check your input and try again',
    'Network Error': 'Please check your internet connection',
  };

  return errorMessages[error] || error || 'Something went wrong. Please try again.';
};

export const isNetworkError = (error: string): boolean => {
  return error.includes('Network Error') || error.includes('fetch');
};

// Export the API client for custom requests
export { apiClient };

// Export types
export type { ApiResponse, PaginatedResponse };