import { configureStore, TaskAbortError } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import authReducer from "./slices/authSlice";
import serviceReducer from "./slices/serviceSlice";
import organizationReducer from "./slices/orgSlice";
import projectReducer from "./slices/projectSlice";
import userReducer from "./slices/userSlice";
import themeReducer from './slices/themeSlice';
import taskReducer from "./slices/taskSlice";
import manualReducer from "./slices/manualSlice";
import proposalReducer from "./slices/proposalSlice";
import scheduleReducer from "./slices/scheduleSlice";
import departmentReducer from "./slices/deptSlice";
import messageReducer from "./slices/messageSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist the auth slice
  stateReconciler: (inboundState: any, originalState: any) => {
    return originalState;
  }
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    service: serviceReducer,
    organization: organizationReducer,
    department: departmentReducer,
    project:projectReducer,
    task: taskReducer,
    manual: manualReducer,
    message: messageReducer,
    proposal: proposalReducer,
    schedule: scheduleReducer,
    user: userReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Ignore redux-persist actions
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store); // Create a persistor
export default store;