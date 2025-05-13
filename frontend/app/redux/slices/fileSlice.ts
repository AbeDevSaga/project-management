import { TFile } from "@/app/constants/type";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_FILE_API;

interface FileState {
  files: TFile[];
  currentFile: TFile | null;
  loading: boolean;
  error: string | null;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async Thunks
export const fetchProjectFiles = createAsyncThunk(
  "files/fetchProjectFiles",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TFile[]>(`${API_URL}/${projectId}`, {
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
      return rejectWithValue(error.response?.data?.message || "Failed to fetch files");
    }
  }
);

export const uploadProjectFile = createAsyncThunk(
  "files/upload",
  async (
    { projectId, formData }: { projectId: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post<TFile>(
        `${API_URL}/${projectId}/files`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "File upload failed");
    }
  }
);

export const downloadProjectFile = createAsyncThunk(
  "files/download",
  async (
    { projectId, fileId }: { projectId: string; fileId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${API_URL}/${projectId}/files/${fileId}/download`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return { data: response.data, fileId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Download failed");
    }
  }
);

export const deleteProjectFile = createAsyncThunk(
  "files/delete",
  async (
    { projectId, fileId }: { projectId: string; fileId: string },
    { rejectWithValue }
  ) => {
    try {
      await axios.delete(`${API_URL}/project/${projectId}/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return fileId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

// Slice
const initialState: FileState = {
  files: [],
  currentFile: null,
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    clearFiles: (state) => {
      state.files = [];
      state.currentFile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Project Files
      .addCase(fetchProjectFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectFiles.fulfilled, (state, action: PayloadAction<TFile[]>) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchProjectFiles.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload File
      .addCase(uploadProjectFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProjectFile.fulfilled, (state, action: PayloadAction<TFile>) => {
        state.loading = false;
        state.files.push(action.payload);
      })
      .addCase(uploadProjectFile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Download File (handled in component, no state update needed)
      .addCase(downloadProjectFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadProjectFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadProjectFile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete File
      .addCase(deleteProjectFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProjectFile.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.files = state.files.filter((file) => file._id !== action.payload);
      })
      .addCase(deleteProjectFile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFiles } = fileSlice.actions;
export default fileSlice.reducer;