import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// ---------- Types ----------
export interface Requirement {
  requirementId: string;
  id?: string;
  carName?: string;
  brand?: string;
  model?: string;
  variant?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  ownership?: string;
  manufacturingYear?: number;
  registrationYear?: number;
  isSale?: "Sell" | "Buy";
  minPrice?: number;
  maxPrice?: number;
  maxKmDriven?: number;
  seats?: number;
  description?: string;
  isFound?: boolean;
  enquiryCount?: number;
  budget?: string;
  createdAt?: string;
  address?: {
    city?: string;
    state?: string;
    locality?: string;
  };
  user?: {
    fullName?: string;
    mobileNumber?: string;
    email?: string;
    userType?: string;
    id?: string;
    userProfileUrl?: string;
  };
  location?: string;
}

interface RequirementState {
  data: Requirement[];
  userRequirements: Requirement[];
  selectedRequirement: Requirement | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

const initialState: RequirementState = {
  data: [],
  userRequirements: [],
  selectedRequirement: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 0,
  hasMore: false,
};

// ---------- Async Thunks ----------

// Create or Update Car Requirement
export const createOrUpdateRequirement = createAsyncThunk<
  Requirement,
  {
    userId: string;
    requirementId?: string;
    city?: string;
    locality?: string;
    state?: string;
    carName?: string;
    brand?: string;
    model?: string;
    variant?: string;
    fuelType?: string;
    transmission?: string;
    bodyType?: string;
    ownership?: string;
    manufacturingYear?: number;
    registrationYear?: number;
    isSale?: "Sell" | "Buy";
    minPrice?: number;
    maxPrice?: number;
    maxKmDriven?: number;
    seats?: number;
    description?: string;
  },
  { state: RootState }
>("requirements/createOrUpdate", async (payload, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/api/v1/car-requirement/create-update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(payload),
      mode: "cors",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to create/update requirement");
    }

    const data = await res.json();
    const requirement = data.data;
    // Normalize ID field
    if (requirement && !requirement.requirementId && requirement.id) {
      requirement.requirementId = requirement.id;
    }
    return requirement;
  } catch (err: any) {
    return rejectWithValue(err.message || "Unknown error");
  }
});

// Get All Car Requirements
export const fetchAllRequirements = createAsyncThunk<
  {
    data: Requirement[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  },
  {
    userId?: string;
    page?: number;
    limit?: number;
    sort?: string;
    filter?: any;
    location?: any;
    connectionType?: string;
  },
  { state: RootState }
>("requirements/fetchAll", async (payload, { rejectWithValue }) => {
  try {
    const { userId, page = 1, limit = 10, sort, filter = {}, location = {}, connectionType } = payload;
    const token = localStorage.getItem("token");
    
    // If userId is empty, backend will return error - we'll handle it gracefully
    const res = await fetch(
      `${BACKEND_URL}/api/v1/car-requirement/get-all?page=${page}&limit=${limit}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ userId: userId || "", sort, filter, location, connectionType }),
        mode: "cors",
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = errorText || "Failed to fetch requirements";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        // If errorText is not JSON, use it as is
      }
      
      // If userId is required but missing, return empty data instead of error
      // This allows viewing requirements page without login
      if (errorMessage.includes("User ID is required") || errorMessage.includes("userId")) {
        return {
          data: [],
          totalCount: 0,
          currentPage: page,
          totalPages: 0,
          hasMore: false,
        };
      }
      
      throw new Error(errorMessage);
    }

    const data = await res.json();
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('Requirements API Response:', data);
    }
    
    // Normalize ID fields in requirements array
    const normalizedData = (data.data || []).map((req: any) => {
      if (!req.requirementId && req.id) {
        req.requirementId = req.id;
      }
      return req;
    });
    
    return {
      data: normalizedData,
      totalCount: data.totalCount || 0,
      currentPage: data.currentPage || page,
      totalPages: data.totalPages || 0,
      hasMore: data.hasMore || false,
    };
  } catch (err: any) {
    return rejectWithValue(err.message || "Unknown error");
  }
});

// Get User's Car Requirements
export const fetchUserRequirements = createAsyncThunk<
  {
    requirements: Requirement[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  },
  {
    userId: string;
    page?: number;
    limit?: number;
  },
  { state: RootState }
>("requirements/fetchUserRequirements", async (payload, { rejectWithValue }) => {
  try {
    const { userId, page = 1, limit = 10 } = payload;
    const token = localStorage.getItem("token");
    
    const res = await fetch(
      `${BACKEND_URL}/api/v1/car-requirement/get-user-requirements?page=${page}&limit=${limit}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ userId }),
        mode: "cors",
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to fetch user requirements");
    }

    const data = await res.json();
    // Normalize ID fields in requirements array
    const normalizedRequirements = (data.requirements || []).map((req: any) => {
      if (!req.requirementId && req.id) {
        req.requirementId = req.id;
      }
      return req;
    });
    return {
      requirements: normalizedRequirements,
      totalCount: data.totalCount || 0,
      currentPage: data.currentPage || page,
      totalPages: data.totalPages || 0,
      hasMore: data.hasMore || false,
    };
  } catch (err: any) {
    return rejectWithValue(err.message || "Unknown error");
  }
});

// Get Requirement By ID
export const fetchRequirementById = createAsyncThunk<
  Requirement,
  string,
  { state: RootState }
>("requirements/fetchById", async (requirementId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/api/v1/car-requirement/get-by-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ requirementId }),
      mode: "cors",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to fetch requirement");
    }

    const data = await res.json();
    const requirement = data.data;
    // Normalize ID field
    if (requirement && !requirement.requirementId && requirement.id) {
      requirement.requirementId = requirement.id;
    }
    return requirement;
  } catch (err: any) {
    return rejectWithValue(err.message || "Unknown error");
  }
});

// Update Found Status
export const updateFoundStatus = createAsyncThunk<
  Requirement,
  {
    userId: string;
    requirementId: string;
    isFound: boolean;
  },
  { state: RootState }
>("requirements/updateFoundStatus", async (payload, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/api/v1/car-requirement/update-found-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(payload),
      mode: "cors",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to update found status");
    }

    const data = await res.json();
    const requirement = data.data;
    // Normalize ID field
    if (requirement && !requirement.requirementId && requirement.id) {
      requirement.requirementId = requirement.id;
    }
    return requirement;
  } catch (err: any) {
    return rejectWithValue(err.message || "Unknown error");
  }
});

// Delete Requirement
export const deleteRequirement = createAsyncThunk<
  string,
  {
    userId: string;
    requirementId: string;
  },
  { state: RootState }
>("requirements/delete", async (payload, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/api/v1/car-requirement/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(payload),
      mode: "cors",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "Failed to delete requirement" }));
      throw new Error(errorData.message || "Failed to delete requirement");
    }

    return payload.requirementId;
  } catch (err: any) {
    return rejectWithValue(err.message || "Unknown error");
  }
});

// Create Requirement Enquiry
export const createRequirementEnquiry = createAsyncThunk<
  { message: string; data: any },
  {
    userId: string;
    requirementId: string;
  },
  { state: RootState }
>("requirements/createEnquiry", async (payload, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/api/v1/car/create-requirement-enquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(payload),
      mode: "cors",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to create requirement enquiry");
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Unknown error");
  }
});

// ---------- Slice ----------
const requirementsSlice = createSlice({
  name: "requirements",
  initialState,
  reducers: {
    setSelectedRequirement(state, action: PayloadAction<Requirement | null>) {
      state.selectedRequirement = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create/Update
      .addCase(createOrUpdateRequirement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrUpdateRequirement.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add to data array
        const index = state.data.findIndex(
          (req) => req.requirementId === action.payload.id || req.requirementId === action.payload.requirementId
        );
        if (index >= 0) {
          state.data[index] = action.payload;
        } else {
          state.data.unshift(action.payload);
        }
      })
      .addCase(createOrUpdateRequirement.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create/update requirement";
      })
      // Fetch All
      .addCase(fetchAllRequirements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRequirements.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchAllRequirements.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch requirements";
      })
      // Fetch User Requirements
      .addCase(fetchUserRequirements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRequirements.fulfilled, (state, action) => {
        state.loading = false;
        state.userRequirements = action.payload.requirements;
      })
      .addCase(fetchUserRequirements.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch user requirements";
      })
      // Fetch By ID
      .addCase(fetchRequirementById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequirementById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRequirement = action.payload;
      })
      .addCase(fetchRequirementById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch requirement";
      })
      // Update Found Status
      .addCase(updateFoundStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFoundStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex(
          (req) => req.requirementId === action.payload.id || req.requirementId === action.payload.requirementId
        );
        if (index >= 0) {
          state.data[index] = action.payload;
        }
        const userIndex = state.userRequirements.findIndex(
          (req) => req.requirementId === action.payload.id || req.requirementId === action.payload.requirementId
        );
        if (userIndex >= 0) {
          state.userRequirements[userIndex] = action.payload;
        }
      })
      .addCase(updateFoundStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update found status";
      })
      // Delete
      .addCase(deleteRequirement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRequirement.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((req) => req.requirementId !== action.payload);
        state.userRequirements = state.userRequirements.filter((req) => req.requirementId !== action.payload);
        if (state.selectedRequirement?.requirementId === action.payload) {
          state.selectedRequirement = null;
        }
      })
      .addCase(deleteRequirement.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete requirement";
      });
  },
});

export const { setSelectedRequirement, clearError } = requirementsSlice.actions;
export default requirementsSlice.reducer;
