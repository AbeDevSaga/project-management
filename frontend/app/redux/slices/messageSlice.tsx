import { TMessage } from "@/app/constants/type";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_MESSAGE_API;

interface MessageState {
  messages: TMessage[];
  currentMessage: TMessage | null;
  loading: boolean;
  error: string | null;
  unreadCount: number;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async Thunks
export const fetchProjectMessages = createAsyncThunk(
  "messages/fetchProjectMessages",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TMessage[]>(`${API_URL}/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      console.log("Fetched messages:", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
      return rejectWithValue(error.response?.data?.message || "Failed to fetch messages");
    }
  }
);

export const fetchMessageById = createAsyncThunk(
  "messages/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TMessage>(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch message");
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/send",
  async (
    { message }: 
    { message: TMessage },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post<TMessage>(
        `${API_URL}/send`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      console.log("Message sent:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to send message");
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "messages/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete message");
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "messages/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<number>(`${API_URL}/unread/count`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch unread count");
    }
  }
);

export const markAsRead = createAsyncThunk(
  "messages/markAsRead",
  async (messageId: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch<TMessage>(
        `${API_URL}/${messageId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark as read");
    }
  }
);

// Slice
const initialState: MessageState = {
  messages: [],
  currentMessage: null,
  loading: false,
  error: null,
  unreadCount: 0,
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.currentMessage = null;
    },
    addNewMessage: (state, action: PayloadAction<TMessage>) => {
      state.messages.unshift(action.payload);
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Project Messages
      .addCase(fetchProjectMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjectMessages.fulfilled,
        (state, action: PayloadAction<TMessage[]>) => {
          state.loading = false;
          state.messages = action.payload;
        }
      )
      .addCase(fetchProjectMessages.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Message by ID
      .addCase(fetchMessageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMessageById.fulfilled,
        (state, action: PayloadAction<TMessage>) => {
          state.loading = false;
          state.currentMessage = action.payload;
        }
      )
      .addCase(fetchMessageById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        sendMessage.fulfilled,
        (state, action: PayloadAction<TMessage>) => {
          state.loading = false;
          state.messages.unshift(action.payload);
        }
      )
      .addCase(sendMessage.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Message
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteMessage.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.messages = state.messages.filter(
            (message) => message._id !== action.payload
          );
          if (state.currentMessage?._id === action.payload) {
            state.currentMessage = null;
          }
        }
      )
      .addCase(deleteMessage.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Unread Count
      .addCase(fetchUnreadCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUnreadCount.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.unreadCount = action.payload;
        }
      )
      .addCase(fetchUnreadCount.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark as Read
      .addCase(markAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        markAsRead.fulfilled,
        (state, action: PayloadAction<TMessage>) => {
          state.loading = false;
          // Update the message in the list if it exists
          const index = state.messages.findIndex(
            (msg) => msg._id === action.payload._id
          );
          if (index !== -1) {
            state.messages[index] = action.payload;
          }
          // Update current message if it's the one being marked as read
          if (state.currentMessage?._id === action.payload._id) {
            state.currentMessage = action.payload;
          }
          // Decrement unread count if it was unread
          if (state.unreadCount > 0) {
            state.unreadCount -= 1;
          }
        }
      )
      .addCase(markAsRead.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages, addNewMessage, incrementUnreadCount } = messageSlice.actions;
export default messageSlice.reducer;