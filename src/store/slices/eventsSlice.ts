import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface EventFormData {
  title: string;
  description: string;
  dateTime: string;
  duration: string; // Keep as string for form input, convert to number when sending to API
}

interface EventsState {
  formData: EventFormData;
  selectedEventId: string | null;
  isFormValid: boolean;
  formErrors: Record<string, string>;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: EventsState = {
  formData: {
    title: "",
    description: "",
    dateTime: "",
    duration: "",
  },
  selectedEventId: null,
  isFormValid: false,
  formErrors: {},
  currentPage: 1,
  itemsPerPage: 10,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<Partial<EventFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetFormData: (state) => {
      state.formData = initialState.formData;
      state.formErrors = {};
      state.isFormValid = false;
    },
    setSelectedEventId: (state, action: PayloadAction<string | null>) => {
      state.selectedEventId = action.payload;
    },
    setFormErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.formErrors = action.payload;
    },
    setFormValid: (state, action: PayloadAction<boolean>) => {
      state.isFormValid = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
    validateForm: (state) => {
      const errors: Record<string, string> = {};

      if (!state.formData.title.trim()) {
        errors.title = "Title is required";
      }

      if (!state.formData.description.trim()) {
        errors.description = "Description is required";
      }

      if (!state.formData.dateTime) {
        errors.dateTime = "Date & Time is required";
      }

      if (!state.formData.duration || parseInt(state.formData.duration) <= 0) {
        errors.duration = "Duration must be greater than 0";
      }

      state.formErrors = errors;
      state.isFormValid = Object.keys(errors).length === 0;
    },
  },
});

export const {
  setFormData,
  resetFormData,
  setSelectedEventId,
  setFormErrors,
  setFormValid,
  setCurrentPage,
  setItemsPerPage,
  validateForm,
} = eventsSlice.actions;

export default eventsSlice.reducer;
