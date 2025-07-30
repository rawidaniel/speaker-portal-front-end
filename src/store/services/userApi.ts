import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "./authApi";

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  bio?: string;
  contactInfo?: string;
  image?: File;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Auth"],
  endpoints: (builder) => ({
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (userData) => {
        const formData = new FormData();

        // Add text fields
        if (userData.name) formData.append("name", userData.name);
        if (userData.email) formData.append("email", userData.email);
        if (userData.bio) formData.append("bio", userData.bio);
        if (userData.contactInfo)
          formData.append("contactInfo", userData.contactInfo);

        // Add file if present
        if (userData.image) {
          formData.append("image", userData.image);
        }

        return {
          url: "user/profile",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["User", "Auth"],
    }),

    getUserProfile: builder.query<User, void>({
      query: () => "user/profile",
      providesTags: ["User"],
    }),
  }),
});

export const { useUpdateProfileMutation, useGetUserProfileQuery } = userApi;
