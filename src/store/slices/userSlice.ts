import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../services/authApi";

const backendUrl = import.meta.env.BACKEND_URL;
interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  updateSuccess: boolean;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  updateSuccess: false,
};

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (
    userData: {
      name?: string;
      email?: string;
      bio?: string;
      contactInfo?: string;
      profileImage?: File | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      if (userData.name) formData.append("name", userData.name);
      if (userData.email) formData.append("email", userData.email);
      if (userData.bio) formData.append("bio", userData.bio);
      if (userData.contactInfo)
        formData.append("contactInfo", userData.contactInfo);
      if (userData.profileImage)
        formData.append("profileImage", userData.profileImage);

      const response = await fetch(`${backendUrl}/api/user/profile`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to update profile");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("Network error occurred");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      state.updateSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.updateSuccess = true;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      });
  },
});

export const { setUser, clearUser, clearError, clearUpdateSuccess } =
  userSlice.actions;

export default userSlice.reducer;
