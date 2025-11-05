import { useState, useEffect, useCallback } from "react";
import type { Vehicle, User } from "../types";
import {
  VehicleApiService,
  UserApiService,
  AuthApiService,
  handleApiError,
} from "../services/api";
import type { ApiResponse } from "../services/api";

// Generic API hook for async operations
export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall();

        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.error || "An error occurred");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// Vehicle-specific hooks
export function useVehicles(params?: {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const { data, loading, error, execute } = useApi<{
    data: Vehicle[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>();

  const fetchVehicles = useCallback(() => {
    execute(() => VehicleApiService.getAllVehicles(params));
  }, [execute, params]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    totalPages: data?.totalPages || 0,
    loading,
    error: error ? handleApiError(error) : null,
    refetch: fetchVehicles,
  };
}

// Infinite vehicles with hasMore + fetchMore
export function useVehiclesInfinite(params?: {
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
  sortOrder?: "asc" | "desc";
}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (targetPage: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await VehicleApiService.getAllVehicles({
          ...params,
          page: targetPage,
          limit: params?.limit ?? 12,
        });
        if (res.success && res.data) {
          setPage(res.data.page);
          setTotalPages(res.data.totalPages);
          setVehicles((prev) => {
            const existingIds = new Set(prev.map((v) => v.id));
            const incoming = res.data!.data.filter(
              (v) => !existingIds.has(v.id)
            );
            return targetPage === 1 ? res.data!.data : [...prev, ...incoming];
          });
        } else {
          setError(res.error || "Failed to load vehicles");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    },
    [params]
  );

  // Reset when filters/search change
  useEffect(() => {
    setVehicles([]);
    setPage(1);
    setTotalPages(1);
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  const fetchMore = useCallback(() => {
    if (page < totalPages && !loading) {
      fetchPage(page + 1);
    }
  }, [page, totalPages, loading, fetchPage]);

  return {
    vehicles,
    page,
    totalPages,
    hasMore: page < totalPages,
    loading,
    error: error ? handleApiError(error) : null,
    fetchMore,
    refetch: () => fetchPage(1),
  };
}

export function useVehicle(id: string) {
  const { data, loading, error, execute } = useApi<Vehicle>();

  const fetchVehicle = useCallback(() => {
    if (id) {
      execute(() => VehicleApiService.getVehicleById(id));
    }
  }, [execute, id]);

  useEffect(() => {
    fetchVehicle();
  }, [fetchVehicle]);

  return {
    vehicle: data,
    loading,
    error: error ? handleApiError(error) : null,
    refetch: fetchVehicle,
  };
}

// CRUD operations for vehicles
export function useVehicleOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createVehicle = useCallback(async (vehicle: Omit<Vehicle, "id">) => {
    setLoading(true);
    setError(null);

    try {
      const response = await VehicleApiService.createVehicle(vehicle);

      if (response.success) {
        return response.data;
      } else {
        setError(response.error || "Failed to create vehicle");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create vehicle";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVehicle = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await VehicleApiService.deleteVehicle(id);

      if (response.success) {
        return true;
      } else {
        setError(response.error || "Failed to delete vehicle");
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete vehicle";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadCar = useCallback(async (formData: FormData) => {
    if (!formData || !(formData instanceof FormData)) {
      console.warn("uploadCar skipped: invalid or missing FormData");
      return null;
    }

    setLoading(true);
    setError(null);

    console.log("inUploadCar contents:");
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const response = await VehicleApiService.uploadCar(formData);

      if (response.success && response.data) {
        console.log("Upload successful:", response.data);
        return response.data; // Returns { car: TempCarRaw }
      } else {
        const errorMsg = response.error || "Failed to upload car";
        setError(errorMsg);
        console.error("Upload failed:", errorMsg);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      console.error("Upload error:", errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error: error ? handleApiError(error) : null,
    createVehicle,
    // updateVehicle,
    deleteVehicle,
    // uploadImage,
    uploadCar,
  };
}

// User-specific hooks
export function useUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}) {
  const { data, loading, error, execute } = useApi<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>();

  const fetchUsers = useCallback(() => {
    execute(() => UserApiService.getAllUsers(params));
  }, [execute, params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    totalPages: data?.totalPages || 0,
    loading,
    error: error ? handleApiError(error) : null,
    refetch: fetchUsers,
  };
}

// Auth hooks
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP-based signup flow
  const sendSignupOTP = useCallback(
    async (userData: {
      fullName: string;
      mobileNumber: string;
      userType: "Owner" | "Dealer" | "EndUser";
      addressState: string;
      addressCity: string;
      addressLocality: string;

    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await AuthApiService.signup(userData);

        if (response.success) {
          return response.data;
        } else {
          setError(response.error || "Failed to send OTP");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send OTP";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const verifySignupOTP = useCallback(
    async (otpData: {
      fullName: string;
      mobileNumber: string;
      otp: string;
      userType: "Owner" | "Dealer" | "EndUser";
      addressState: string;
      addressCity: string;
      addressLocality: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        // For now, just use the signup method since verifySignupOTP doesn't exist
        const response = await AuthApiService.signup({
          fullName: otpData.fullName,
          mobileNumber: otpData.mobileNumber,
          userType: otpData.userType,
          addressCity: otpData.addressCity,
          // addressState: otpData.addressState,
          // addressLocality: otpData.addressLocality,

        });

        if (response.success && response.data) {
          // Store user data
          localStorage.setItem("user", JSON.stringify(response.data.user));
          return response.data;
        } else {
          setError(response.error || "OTP verification failed");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "OTP verification failed";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // OTP-based login flow
  const sendLoginOTP = useCallback(async (mobileNumber: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthApiService.login(mobileNumber);

      if (response.success) {
        return response.data;
      } else {
        setError(response.error || "Failed to send OTP");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send OTP";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyLoginOTP = useCallback(
    async (loginData: { mobileNumber: string; otp: string }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await AuthApiService.login(loginData.mobileNumber);

        if (response.success && response.data) {
          // Store user data and session token
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("sessionToken", response.data.sessionToken);
          return response.data;
        } else {
          setError(response.error || "Login failed");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Login failed";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Legacy methods for backward compatibility
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthApiService.loginWithEmail(email, password);

      if (response.success && response.data) {
        // Store token and user data
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data;
      } else {
        setError(response.error || "Login failed");
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (userData: {
      name: string;
      email: string;
      password: string;
      mobile: string;
      type: "Owner" | "Dealer" | "EndUser";
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await AuthApiService.register(userData);

        if (response.success && response.data) {
          // Store token and user data
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          return response.data;
        } else {
          setError(response.error || "Registration failed");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Registration failed";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await AuthApiService.logout();
    } catch (err) {
      // Even if logout fails on server, clear local data
      console.warn("Logout request failed:", err);
    } finally {
      // Clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthApiService.forgotPassword(email);

      if (response.success) {
        return true;
      } else {
        setError(response.error || "Failed to send reset email");
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send reset email";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthApiService.resetPassword(token, password);

      if (response.success) {
        return true;
      } else {
        setError(response.error || "Failed to reset password");
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reset password";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error: error ? handleApiError(error) : null,
    // OTP-based methods
    sendSignupOTP,
    verifySignupOTP,
    sendLoginOTP,
    verifyLoginOTP,
    // Legacy methods
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };
}

// Custom hook for managing local storage auth state
export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const updateUser = useCallback((userData: User | null) => {
    setUser(userData);
    setIsAuthenticated(!!userData);

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    }
  }, []);

  return {
    user,
    isAuthenticated,
    updateUser,
  };
}
