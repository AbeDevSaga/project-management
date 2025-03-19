import { TService } from "@/app/constants/type";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_SERVICE_API;

interface ServiceState {
  services: TService[];
  currentService: TService | null;
  loading: boolean;
  error: string | null;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async Thunks
export const fetchServices = createAsyncThunk(
  "services/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<TService[]>(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
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

export const fetchServiceById = createAsyncThunk(
  "services/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TService>(`${API_URL}/${id}`, {
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

export const createService = createAsyncThunk(
  "services/create",
  async (serviceData: Omit<TService, "_id">, { rejectWithValue }) => {
    try {
      const response = await axios.post<TService>(
        `${API_URL}/create`,
        serviceData,
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

export const updateService = createAsyncThunk(
  "services/update",
  async (
    { id, serviceData }: { id: string; serviceData: Partial<TService> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TService>(
        `${API_URL}/update/${id}`,
        serviceData,
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

export const deleteService = createAsyncThunk(
  "services/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`, {
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
const initialState: ServiceState = {
  services: [],
  currentService: null,
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchServices.fulfilled,
        (state, action: PayloadAction<TService[]>) => {
          state.loading = false;
          state.services = action.payload;
        }
      )
      .addCase(fetchServices.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchServiceById.fulfilled,
        (state, action: PayloadAction<TService>) => {
          state.loading = false;
          state.currentService = action.payload;
        }
      )
      .addCase(
        fetchServiceById.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(
        createService.fulfilled,
        (state, action: PayloadAction<TService>) => {
          state.services.push(action.payload);
        }
      )
      .addCase(
        updateService.fulfilled,
        (state, action: PayloadAction<TService>) => {
          const index = state.services.findIndex(
            (service) => service._id === action.payload._id
          );
          if (index !== -1) {
            state.services[index] = action.payload;
          }
        }
      )
      .addCase(
        deleteService.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.services = state.services.filter(
            (service) => service._id !== action.payload
          );
        }
      );
  },
});

export default serviceSlice.reducer;
