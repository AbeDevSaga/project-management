import { TOrganization } from "@/app/constants/type";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_ORG_API;

interface OrganizationState {
  organizations: TOrganization[];
  currentOrganization: TOrganization | null;
  loading: boolean;
  error: string | null;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async Thunks
export const fetchOrganizations = createAsyncThunk(
  "organizations/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<TOrganization[]>(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      console.log("organizations", response.data)
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem("token"); // Clear the token
        window.location.href = "/auth/login"; // Redirect to login page
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrganizationById = createAsyncThunk(
  "organizations/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TOrganization>(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createOrganization = createAsyncThunk(
  "organizations/create",
  async (organizationData: Omit<TOrganization, "_id">, { rejectWithValue }) => {
    try {
      const response = await axios.post<TOrganization>(
        `${API_URL}/create_org`,
        organizationData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateOrganization = createAsyncThunk(
  "organizations/update",
  async (
    { id, organizationData }: { id: string; organizationData: Partial<TOrganization> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TOrganization>(
        `${API_URL}/update_org/${id}`,
        organizationData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteOrganization = createAsyncThunk(
  "organizations/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/delete_org/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const initialState: OrganizationState = {
  organizations: [],
  currentOrganization: null,
  loading: false,
  error: null,
};

const organizationSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrganizations.fulfilled,
        (state, action: PayloadAction<TOrganization[]>) => {
          state.loading = false;
          state.organizations = action.payload;
        }
      )
      .addCase(fetchOrganizations.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrganizationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrganizationById.fulfilled,
        (state, action: PayloadAction<TOrganization>) => {
          state.loading = false;
          state.currentOrganization = action.payload;
        }
      )
      .addCase(
        fetchOrganizationById.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(
        createOrganization.fulfilled,
        (state, action: PayloadAction<TOrganization>) => {
          state.organizations.push(action.payload);
        }
      )
      .addCase(
        updateOrganization.fulfilled,
        (state, action: PayloadAction<TOrganization>) => {
          const index = state.organizations.findIndex(
            (organization) => organization._id === action.payload._id
          );
          if (index !== -1) {
            state.organizations[index] = action.payload;
          }
        }
      )
      .addCase(
        deleteOrganization.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.organizations = state.organizations.filter(
            (organization) => organization._id !== action.payload
          );
        }
      );
  },
});

export default organizationSlice.reducer;