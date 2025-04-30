import { TRole, TUser } from "@/app/constants/type";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_AUTH_API;

interface AuthState {
  user: TUser | null;
  role: TRole | null;
  userId: string | null;
  currentSession: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Async Thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: TUser, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData: TUser, { rejectWithValue }) => {
    console.log("userData: ", userData);
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      localStorage.setItem("token", response.data.token); // Save token to localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", JSON.stringify(response.data.user.role));
      console.log("response.data: ", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const initialState: AuthState = {
  user: 
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
  token:
    typeof window !== "undefined"
      ? localStorage.getItem("token") || null
      : null,
  role: null,
  userId: null,
  currentSession: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token"); // Remove token on logout
      localStorage.removeItem("user"); // Remove user data on logout
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
        state.userId = action.payload.user.id;
        state.currentSession = `${action.payload.user.id}_${Date.now()}`; // Create a unique session identifier
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
