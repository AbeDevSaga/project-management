import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { TProject } from "@/app/constants/type"; // Define TProject type for your project

const API_URL = process.env.NEXT_PUBLIC_PROJECT_API;

interface ProjectState {
  projects: TProject[];
  currentProject: TProject | null;
  loading: boolean;
  error: string | null;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async Thunks
export const fetchAllProjects = createAsyncThunk(
  "projects/fetchAllProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<TProject[]>(
        `${API_URL}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      console.log("projects: ", response.data)
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

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (organizationId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TProject[]>(
        `${API_URL}/organization/${organizationId}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
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

export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TProject>(`${API_URL}/${id}`, {
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

export const createProject = createAsyncThunk(
  "projects/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post<TProject>(
        `${API_URL}/create`,
        formData,
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

export const updateProject = createAsyncThunk(
  "projects/update",
  async (
    { id, projectData }: { id: string; projectData: Partial<TProject> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TProject>(
        `${API_URL}/update/${id}`,
        projectData,
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

export const deleteProject = createAsyncThunk(
  "projects/delete",
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
export const addStudentsToProject = createAsyncThunk(
  "projects/addStudents",
  async (
    { projectId, studentIds }: { projectId: string; studentIds: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TProject>(
        `${API_URL}/add-students/${projectId}`,
        { studentIds },
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
        // Token is invalid or expired
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
      return rejectWithValue(error.response?.data || "Failed to add students");
    }
  }
);
export const addEvaluatorsToProject = createAsyncThunk(
  "projects/addEvaluators",
  async (
    { projectId, evaluatorsIds }: { projectId: string; evaluatorsIds: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TProject>(
        `${API_URL}/add-evaluators/${projectId}`,
        { evaluatorsIds },
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
        // Token is invalid or expired
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
      return rejectWithValue(error.response?.data || "Failed to add advisors");
    }
  }
);
export const addEvaluationToProject = createAsyncThunk(
  "projects/addEvaluation",
  async (
    { evaluationData, projectId }: { evaluationData: string[], projectId: string; },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TProject>(
        `${API_URL}/add-evaluation/${projectId}`,
        { evaluationData },
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
        // Token is invalid or expired
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
      return rejectWithValue(error.response?.data || "Failed to add evaluation");
    }
  }
);
export const addUserToProject = createAsyncThunk(
  "projects/addUser",
  async (
    { projectId, userId, role }: { projectId: string; userId: string, role: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TProject>(
        `${API_URL}/add-user/${projectId}`,
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
        // Token is invalid or expired
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
      return rejectWithValue(error.response?.data || "Failed to add students");
    }
  }
);
// Slice
const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllProjects.fulfilled,
        (state, action: PayloadAction<TProject[]>) => {
          state.loading = false;
          state.projects = action.payload;
        }
      )
      .addCase(fetchAllProjects.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<TProject[]>) => {
          state.loading = false;
          state.projects = action.payload;
        }
      )
      .addCase(fetchProjects.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjectById.fulfilled,
        (state, action: PayloadAction<TProject>) => {
          state.loading = false;
          state.currentProject = action.payload;
        }
      )
      .addCase(
        fetchProjectById.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(
        createProject.fulfilled,
        (state, action: PayloadAction<TProject>) => {
          state.projects.push(action.payload);
        }
      )
      .addCase(
        updateProject.fulfilled,
        (state, action: PayloadAction<TProject>) => {
          const index = state.projects.findIndex(
            (project) => project._id === action.payload._id
          );
          if (index !== -1) {
            state.projects[index] = action.payload;
          }

          if (state.currentProject?._id === action.payload._id) {
            state.currentProject = action.payload;
          }
        }
      )
      .addCase(
        deleteProject.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.projects = state.projects.filter(
            (project) => project._id !== action.payload
          );
        }
      )
      // Add Students to Project cases
      .addCase(addStudentsToProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addStudentsToProject.fulfilled,
        (state, action: PayloadAction<TProject>) => {
          state.loading = false;
          
          // Update the current project if it's the one being modified
          if (state.currentProject?._id === action.payload._id) {
            state.currentProject = action.payload;
          }
          
          // Update the project in the projects array
          const index = state.projects.findIndex(
            (p) => p._id === action.payload._id
          );
          if (index !== -1) {
            state.projects[index] = action.payload;
          }
        }
      )
      .addCase(
        addStudentsToProject.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      // Add Evaluators to Project cases
      .addCase(addEvaluatorsToProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addEvaluatorsToProject.fulfilled,
        (state, action: PayloadAction<TProject>) => {
          state.loading = false;
          
          // Update the current project if it's the one being modified
          if (state.currentProject?._id === action.payload._id) {
            state.currentProject = action.payload;
          }
          
          // Update the project in the projects array
          const index = state.projects.findIndex(
            (p) => p._id === action.payload._id
          );
          if (index !== -1) {
            state.projects[index] = action.payload;
          }
        }
      )
      .addCase(
        addEvaluatorsToProject.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      // Add Evaluation to Project cases
      .addCase(addEvaluationToProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addEvaluationToProject.fulfilled,
        (state, action: PayloadAction<TProject>) => {
          state.loading = false;
          
          // Update the current project if it's the one being modified
          if (state.currentProject?._id === action.payload._id) {
            state.currentProject = action.payload;
          }
          
          // Update the project in the projects array
          const index = state.projects.findIndex(
            (p) => p._id === action.payload._id
          );
          if (index !== -1) {
            state.projects[index] = action.payload;
          }
        }
      )
      .addCase(
        addEvaluationToProject.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      // Add User to Project cases
      .addCase(addUserToProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addUserToProject.fulfilled,
        (state, action: PayloadAction<TProject>) => {
          state.loading = false;
          
          // Update the current project if it's the one being modified
          if (state.currentProject?._id === action.payload._id) {
            state.currentProject = action.payload;
          }
          
          // Update the project in the projects array
          const index = state.projects.findIndex(
            (p) => p._id === action.payload._id
          );
          if (index !== -1) {
            state.projects[index] = action.payload;
          }
        }
      )
      .addCase(
        addUserToProject.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
  },
});

export default projectSlice.reducer;