import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  modalOpen: boolean;
  modalType: "addEvent" | "editEvent" | "deleteEvent" | null;
  sidebarOpen: boolean;
  loading: boolean;
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    duration?: number;
  }>;
}

const initialState: UIState = {
  modalOpen: false,
  modalType: null,
  sidebarOpen: false,
  loading: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload;
      if (!action.payload) {
        state.modalType = null;
      }
    },
    setModalType: (state, action: PayloadAction<UIState["modalType"]>) => {
      state.modalType = action.payload;
      if (action.payload) {
        state.modalOpen = true;
      }
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<UIState["notifications"][0], "id">>
    ) => {
      const id = Date.now().toString();
      state.notifications.push({
        ...action.payload,
        id,
        duration: action.payload.duration || 5000,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setModalOpen,
  setModalType,
  setSidebarOpen,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
