import { TManual } from "@/app/constants/type";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_MANUAL_API;

interface ManualState {
  manuals: TManual[];
  currentManual: TManual | null;
  loading: boolean;
  error: string | null;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async Thunks
export const fetchManuals = createAsyncThunk(
  "manuals/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<TManual[]>(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchManualById = createAsyncThunk(
  "manuals/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TManual>(`${API_URL}/${id}`, {
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

export const fetchManualsByType = createAsyncThunk(
  "manuals/fetchByType",
  async (type: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TManual[]>(`${API_URL}/type/${type}`, {
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

export const createManual = createAsyncThunk(
  "manuals/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post<TManual>(`${API_URL}`, formData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateManual = createAsyncThunk(
  "manuals/update",
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TManual>(`${API_URL}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteManual = createAsyncThunk(
  "manuals/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
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

export const downloadManual = createAsyncThunk(
  "manuals/download",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/download/${id}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Download failed");
    }
  }
);

// Slice
const initialState: ManualState = {
  manuals: [],
  currentManual: null,
  loading: false,
  error: null,
};

const manualSlice = createSlice({
  name: "manuals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Manuals
      .addCase(fetchManuals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchManuals.fulfilled,
        (state, action: PayloadAction<TManual[]>) => {
          state.loading = false;
          state.manuals = action.payload;
        }
      )
      .addCase(fetchManuals.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Manual by ID
      .addCase(fetchManualById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchManualById.fulfilled,
        (state, action: PayloadAction<TManual>) => {
          state.loading = false;
          state.currentManual = action.payload;
        }
      )
      .addCase(fetchManualById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Manuals by Type
      .addCase(fetchManualsByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchManualsByType.fulfilled,
        (state, action: PayloadAction<TManual[]>) => {
          state.loading = false;
          state.manuals = action.payload;
        }
      )
      .addCase(fetchManualsByType.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Manual
      .addCase(createManual.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createManual.fulfilled,
        (state, action: PayloadAction<TManual>) => {
          state.loading = false;
          state.manuals.push(action.payload);
        }
      )
      .addCase(createManual.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Manual
      .addCase(updateManual.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateManual.fulfilled,
        (state, action: PayloadAction<TManual>) => {
          state.loading = false;
          const index = state.manuals.findIndex(
            (manual) => manual._id === action.payload._id
          );
          if (index !== -1) {
            state.manuals[index] = action.payload;
          }
        }
      )
      .addCase(updateManual.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Manual
      .addCase(deleteManual.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteManual.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.manuals = state.manuals.filter(
            (manual) => manual._id !== action.payload
          );
        }
      )
      .addCase(deleteManual.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default manualSlice.reducer;