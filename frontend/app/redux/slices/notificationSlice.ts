import { TNotification } from "@/app/constants/type";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_NOTIFICATION_API;

interface NotificationState {
  notifications: TNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async Thunks
export const createNotification = createAsyncThunk(
  "notifications/createNotifications",
  async (
    notificationData: Omit<TNotification, "_id" | "status" | "timestamp">,
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post<TNotification>(
        `${API_URL}/create`,
        notificationData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      console.log("response data: ", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to create notification"
      );
    }
  }
);

export const fetchUserNotifications = createAsyncThunk(
  "notifications/fetchUserNotifications",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TNotification[]>(
        `${API_URL}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      console.log("respone data: ", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await axios.patch(
        `${API_URL}/${notificationId}/status`,
        { status: "read" },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark as read"
      );
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (userId: string, { rejectWithValue }) => {
    try {
      await axios.patch(
        `${API_URL}/${userId}/mark-all-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return userId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark all as read"
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

// Slice
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<TNotification>) => {
      state.notifications.unshift(action.payload);
      if (action.payload.status === "unread") {
        state.unreadCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Notifications
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createNotification.fulfilled,
        (state, action: PayloadAction<TNotification>) => {
          // Changed to expect single notification
          state.loading = false;
          state.notifications.unshift(action.payload); // Add new notification at beginning
          if (action.payload.status === "unread") {
            state.unreadCount += 1;
          }
        }
      )
      .addCase(
        createNotification.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Fetch User Notifications
      .addCase(fetchUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserNotifications.fulfilled,
        (state, action: PayloadAction<TNotification[]>) => {
          state.loading = false;
          state.notifications = action.payload;
          state.unreadCount = action.payload.filter(
            (n) => n.status === "unread"
          ).length;
        }
      )
      .addCase(
        fetchUserNotifications.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Mark Notification As Read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        markNotificationAsRead.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          const notification = state.notifications.find(
            (n) => n._id === action.payload
          );
          if (notification && notification.status === "unread") {
            notification.status = "read";
            state.unreadCount -= 1;
          }
        }
      )
      .addCase(
        markNotificationAsRead.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Mark All Notifications As Read
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.loading = false;
        state.notifications = state.notifications.map((n) => ({
          ...n,
          status: "read",
        }));
        state.unreadCount = 0;
      })
      .addCase(
        markAllNotificationsAsRead.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Delete Notification
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteNotification.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          const deletedNotification = state.notifications.find(
            (n) => n._id === action.payload
          );
          if (deletedNotification && deletedNotification.status === "unread") {
            state.unreadCount -= 1;
          }
          state.notifications = state.notifications.filter(
            (n) => n._id !== action.payload
          );
        }
      )
      .addCase(
        deleteNotification.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearNotifications, addNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
