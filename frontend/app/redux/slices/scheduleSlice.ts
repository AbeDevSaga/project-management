import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { TSchedule } from "@/app/constants/type"; // Define TSchedule type for your schedule

const API_URL = process.env.NEXT_PUBLIC_SCHEDULE_API;

interface ScheduleState {
  schedules: TSchedule[];
  currentSchedule: TSchedule | null;
  upcomingSchedules: TSchedule[];
  loading: boolean;
  error: string | null;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async Thunks
export const fetchAllSchedules = createAsyncThunk(
  "schedules/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<TSchedule[]>(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      console.log("Fetched schedules:", response.data); // Debugging line
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
      return rejectWithValue(error.response?.data || "Failed to fetch schedules");
    }
  }
);

export const fetchSchedulesByProject = createAsyncThunk(
  "schedules/fetchByProject",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TSchedule[]>(
        `${API_URL}/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch project schedules");
    }
  }
);

export const fetchSchedulesByUser = createAsyncThunk(
  "schedules/fetchByUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TSchedule[]>(
        `${API_URL}/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      console.log("Fetched schedules:", response.data); // Debugging line
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch user schedules");
    }
  }
);

export const fetchUpcomingSchedules = createAsyncThunk(
  "schedules/fetchUpcoming",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<TSchedule[]>(
        `${API_URL}/upcoming/all`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch upcoming schedules");
    }
  }
);

export const fetchScheduleById = createAsyncThunk(
  "schedules/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TSchedule>(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch schedule");
    }
  }
);

export const createSchedule = createAsyncThunk(
  "schedules/create",
  async (scheduleData: Omit<TSchedule, "_id">, { rejectWithValue }) => {
    try {
      const response = await axios.post<TSchedule>(
        `${API_URL}`,
        scheduleData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create schedule");
    }
  }
);

export const updateSchedule = createAsyncThunk(
  "schedules/update",
  async (
    { id, scheduleData }: { id: string; scheduleData: Partial<TSchedule> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TSchedule>(
        `${API_URL}/${id}`,
        scheduleData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update schedule");
    }
  }
);

export const deleteSchedule = createAsyncThunk(
  "schedules/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete schedule");
    }
  }
);

// Slice
const initialState: ScheduleState = {
  schedules: [],
  currentSchedule: null,
  upcomingSchedules: [],
  loading: false,
  error: null,
};

const scheduleSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    clearCurrentSchedule: (state) => {
      state.currentSchedule = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Schedules
      .addCase(fetchAllSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllSchedules.fulfilled,
        (state, action: PayloadAction<TSchedule[]>) => {
          state.loading = false;
          state.schedules = action.payload;
        }
      )
      .addCase(fetchAllSchedules.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Schedules by Project
      .addCase(fetchSchedulesByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSchedulesByProject.fulfilled,
        (state, action: PayloadAction<TSchedule[]>) => {
          state.loading = false;
          state.schedules = action.payload;
        }
      )
      .addCase(fetchSchedulesByProject.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Schedules by User
      .addCase(fetchSchedulesByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSchedulesByUser.fulfilled,
        (state, action: PayloadAction<TSchedule[]>) => {
          state.loading = false;
          state.schedules = action.payload;
        }
      )
      .addCase(fetchSchedulesByUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Upcoming Schedules
      .addCase(fetchUpcomingSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUpcomingSchedules.fulfilled,
        (state, action: PayloadAction<TSchedule[]>) => {
          state.loading = false;
          state.upcomingSchedules = action.payload;
        }
      )
      .addCase(fetchUpcomingSchedules.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Schedule by ID
      .addCase(fetchScheduleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchScheduleById.fulfilled,
        (state, action: PayloadAction<TSchedule>) => {
          state.loading = false;
          state.currentSchedule = action.payload;
        }
      )
      .addCase(fetchScheduleById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Schedule
      .addCase(createSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createSchedule.fulfilled,
        (state, action: PayloadAction<TSchedule>) => {
          state.loading = false;
          state.schedules.push(action.payload);
        }
      )
      .addCase(createSchedule.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Schedule
      .addCase(updateSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateSchedule.fulfilled,
        (state, action: PayloadAction<TSchedule>) => {
          state.loading = false;
          const index = state.schedules.findIndex(
            (schedule) => schedule._id === action.payload._id
          );
          if (index !== -1) {
            state.schedules[index] = action.payload;
          }

          if (state.currentSchedule?._id === action.payload._id) {
            state.currentSchedule = action.payload;
          }
        }
      )
      .addCase(updateSchedule.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Schedule
      .addCase(deleteSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteSchedule.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.schedules = state.schedules.filter(
            (schedule) => schedule._id !== action.payload
          );
          if (state.currentSchedule?._id === action.payload) {
            state.currentSchedule = null;
          }
        }
      )
      .addCase(deleteSchedule.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentSchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;