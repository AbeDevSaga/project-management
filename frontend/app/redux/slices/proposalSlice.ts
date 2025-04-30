import { TProposal } from "@/app/constants/type";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_PROPOSAL_API;

interface ProposalState {
  proposals: TProposal[];
  proposal: TProposal | null;
  currentProposal: TProposal | null;
  loading: boolean;
  error: string | null;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async Thunks
export const fetchProposals = createAsyncThunk(
  "proposals/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<TProposal[]>(`${API_URL}`, {
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

export const fetchProposalById = createAsyncThunk(
  "proposals/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TProposal>(`${API_URL}/${id}`, {
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

export const fetchProposalsByStatus = createAsyncThunk(
  "proposals/fetchByStatus",
  async (status: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TProposal[]>(`${API_URL}/status/${status}`, {
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

export const fetchProposalsByStudent = createAsyncThunk(
  "proposals/fetchByStudent",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TProposal[]>(`${API_URL}/student/${studentId}`, {
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

export const fetchProposalByProject = createAsyncThunk(
  "proposals/fetchByProject",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TProposal>(`${API_URL}/project/${projectId}`, {
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

export const createProposal = createAsyncThunk(
  "proposals/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post<TProposal>(`${API_URL}`, formData, {
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

export const updateProposal = createAsyncThunk(
  "proposals/update",
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TProposal>(`${API_URL}/${id}`, formData, {
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

export const updateProposalStatus = createAsyncThunk(
  "proposals/updateStatus",
  async (
    { id, status, feedback }: { id: string; status: string; feedback?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch<TProposal>(
        `${API_URL}/${id}/status`,
        { status, feedback },
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

export const deleteProposal = createAsyncThunk(
  "proposals/delete",
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

export const downloadProposal = createAsyncThunk(
  "proposals/download",
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
const initialState: ProposalState = {
  proposals: [],
  proposal: null,
  currentProposal: null,
  loading: false,
  error: null,
};

const proposalSlice = createSlice({
  name: "proposals",
  initialState,
  reducers: {
    clearCurrentProposal: (state) => {
      state.currentProposal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Proposals
      .addCase(fetchProposals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProposals.fulfilled,
        (state, action: PayloadAction<TProposal[]>) => {
          state.loading = false;
          state.proposals = action.payload;
        }
      )
      .addCase(fetchProposals.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Proposal by ID
      .addCase(fetchProposalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProposalById.fulfilled,
        (state, action: PayloadAction<TProposal>) => {
          state.loading = false;
          state.currentProposal = action.payload;
        }
      )
      .addCase(fetchProposalById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Proposals by Status
      .addCase(fetchProposalsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProposalsByStatus.fulfilled,
        (state, action: PayloadAction<TProposal[]>) => {
          state.loading = false;
          state.proposals = action.payload;
        }
      )
      .addCase(fetchProposalsByStatus.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Proposals by Student
      .addCase(fetchProposalsByStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProposalsByStudent.fulfilled,
        (state, action: PayloadAction<TProposal[]>) => {
          state.loading = false;
          state.proposals = action.payload;
        }
      )
      .addCase(fetchProposalsByStudent.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Proposals by Project
      .addCase(fetchProposalByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProposalByProject.fulfilled,
        (state, action: PayloadAction<TProposal>) => {
          state.loading = false;
          state.proposal = action.payload;
        }
      )
      .addCase(fetchProposalByProject.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Proposal
      .addCase(createProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProposal.fulfilled,
        (state, action: PayloadAction<TProposal>) => {
          state.loading = false;
          state.proposals.push(action.payload);
        }
      )
      .addCase(createProposal.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Proposal
      .addCase(updateProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProposal.fulfilled,
        (state, action: PayloadAction<TProposal>) => {
          state.loading = false;
          const index = state.proposals.findIndex(
            (proposal) => proposal._id === action.payload._id
          );
          if (index !== -1) {
            state.proposals[index] = action.payload;
          }
          if (state.currentProposal?._id === action.payload._id) {
            state.currentProposal = action.payload;
          }
        }
      )
      .addCase(updateProposal.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Proposal Status
      .addCase(updateProposalStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProposalStatus.fulfilled,
        (state, action: PayloadAction<TProposal>) => {
          state.loading = false;
          const index = state.proposals.findIndex(
            (proposal) => proposal._id === action.payload._id
          );
          if (index !== -1) {
            state.proposals[index] = action.payload;
          }
          if (state.currentProposal?._id === action.payload._id) {
            state.currentProposal = action.payload;
          }
        }
      )
      .addCase(updateProposalStatus.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Proposal
      .addCase(deleteProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteProposal.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.proposals = state.proposals.filter(
            (proposal) => proposal._id !== action.payload
          );
          if (state.currentProposal?._id === action.payload) {
            state.currentProposal = null;
          }
        }
      )
      .addCase(deleteProposal.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProposal } = proposalSlice.actions;
export default proposalSlice.reducer;