import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { TDepartment } from "@/app/constants/type"; // Define TDepartment type for your department

const API_URL = process.env.NEXT_PUBLIC_DEPT_API;

interface DepartmentState {
  departments: TDepartment[];
  currentDepartment: TDepartment | null;
  loading: boolean;
  error: string | null;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async Thunks
export const fetchAllDepartments = createAsyncThunk(
  "departments/fetchAllDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<TDepartment[]>(
        `${API_URL}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
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

export const fetchDepartmentById = createAsyncThunk(
  "departments/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TDepartment>(`${API_URL}/${id}`, {
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

export const fetchDepartmentByHeadId = createAsyncThunk(
  "departments/fetchByHeadId",
  async (headId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TDepartment>(
        `${API_URL}/head/${headId}`,
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

export const fetchDepartmentsByAdvisorId = createAsyncThunk(
  "departments/fetchByAdvisorId",
  async (advisorId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TDepartment[]>(
        `${API_URL}/advisor/${advisorId}`,
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

export const fetchDepartmentsByStudentId = createAsyncThunk(
  "departments/fetchByStudentId",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TDepartment[]>(
        `${API_URL}/student/${studentId}`,
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

export const createDepartment = createAsyncThunk(
  "departments/create",
  async (departmentData: Omit<TDepartment, "_id">, { rejectWithValue }) => {
    try {
      const response = await axios.post<TDepartment>(
        `${API_URL}/create`,
        departmentData,
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

export const updateDepartment = createAsyncThunk(
  "departments/update",
  async (
    { id, departmentData }: { id: string; departmentData: Partial<TDepartment> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TDepartment>(
        `${API_URL}/update/${id}`,
        departmentData,
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

export const deleteDepartment = createAsyncThunk(
  "departments/delete",
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

export const addUsersToDepartment = createAsyncThunk(
  "departments/addUsers",
  async (
    { departmentId, userIds, role }: { departmentId: string; userIds: string[]; role: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TDepartment>(
        `${API_URL}/add-users/${departmentId}`,
        { userIds, role },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
      return rejectWithValue(error.response?.data || "Failed to add users");
    }
  }
);

export const removeUserFromDepartment = createAsyncThunk(
  "departments/removeUser",
  async (
    { departmentId, userId, role }: { departmentId: string; userId: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TDepartment>(
        `${API_URL}/remove-user/${departmentId}`,
        { userId, role },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
      return rejectWithValue(error.response?.data || "Failed to remove user");
    }
  }
);

// Slice
const initialState: DepartmentState = {
  departments: [],
  currentDepartment: null,
  loading: false,
  error: null,
};

const departmentSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Departments
      .addCase(fetchAllDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllDepartments.fulfilled,
        (state, action: PayloadAction<TDepartment[]>) => {
          state.loading = false;
          state.departments = action.payload;
        }
      )
      .addCase(fetchAllDepartments.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Department By ID
      .addCase(fetchDepartmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDepartmentById.fulfilled,
        (state, action: PayloadAction<TDepartment>) => {
          state.loading = false;
          state.currentDepartment = action.payload;
        }
      )
      .addCase(
        fetchDepartmentById.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Fetch Department By Head ID
      .addCase(fetchDepartmentByHeadId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDepartmentByHeadId.fulfilled,
        (state, action: PayloadAction<TDepartment>) => {
          state.loading = false;
          // Replace the array with just this department for head's view
          state.departments = [action.payload];
          state.currentDepartment = action.payload;
        }
      )
      .addCase(
        fetchDepartmentByHeadId.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Fetch Departments By Advisor ID
      .addCase(fetchDepartmentsByAdvisorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDepartmentsByAdvisorId.fulfilled,
        (state, action: PayloadAction<TDepartment[]>) => {
          state.loading = false;
          state.departments = action.payload;
        }
      )
      .addCase(
        fetchDepartmentsByAdvisorId.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Fetch Departments By Student ID
      .addCase(fetchDepartmentsByStudentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDepartmentsByStudentId.fulfilled,
        (state, action: PayloadAction<TDepartment[]>) => {
          state.loading = false;
          state.departments = action.payload;
        }
      )
      .addCase(
        fetchDepartmentsByStudentId.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Create Department
      .addCase(
        createDepartment.fulfilled,
        (state, action: PayloadAction<TDepartment>) => {
          state.departments.push(action.payload);
        }
      )

      // Update Department
      .addCase(
        updateDepartment.fulfilled,
        (state, action: PayloadAction<TDepartment>) => {
          const index = state.departments.findIndex(
            (dept) => dept._id === action.payload._id
          );
          if (index !== -1) {
            state.departments[index] = action.payload;
          }

          if (state.currentDepartment?._id === action.payload._id) {
            state.currentDepartment = action.payload;
          }
        }
      )

      // Delete Department
      .addCase(
        deleteDepartment.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.departments = state.departments.filter(
            (dept) => dept._id !== action.payload
          );
          if (state.currentDepartment?._id === action.payload) {
            state.currentDepartment = null;
          }
        }
      )

      // Add Users to Department
      .addCase(addUsersToDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addUsersToDepartment.fulfilled,
        (state, action: PayloadAction<TDepartment>) => {
          state.loading = false;
          
          // Update current department if it's the one being modified
          if (state.currentDepartment?._id === action.payload._id) {
            state.currentDepartment = action.payload;
          }
          
          // Update the department in the departments array
          const index = state.departments.findIndex(
            (d) => d._id === action.payload._id
          );
          if (index !== -1) {
            state.departments[index] = action.payload;
          }
        }
      )
      .addCase(
        addUsersToDepartment.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Remove User from Department
      .addCase(removeUserFromDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeUserFromDepartment.fulfilled,
        (state, action: PayloadAction<TDepartment>) => {
          state.loading = false;
          
          // Update current department if it's the one being modified
          if (state.currentDepartment?._id === action.payload._id) {
            state.currentDepartment = action.payload;
          }
          
          // Update the department in the departments array
          const index = state.departments.findIndex(
            (d) => d._id === action.payload._id
          );
          if (index !== -1) {
            state.departments[index] = action.payload;
          }
        }
      )
      .addCase(
        removeUserFromDepartment.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default departmentSlice.reducer;