import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  zoomLink: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  creatorId: string;
}

export interface PaginationLink {
  label: string;
  active: boolean;
  url: string | null;
  page: number;
}

export interface Pagination {
  page: number;
  itemsPerPage: number;
  links: PaginationLink[];
  total: number;
  lastPage: number;
  prev: number | null;
  next: number | null;
}

export interface EventsResponse {
  data: Event[];
  payload: {
    pagination: Pagination;
  };
}

export interface CreateEventRequest {
  title: string;
  description: string;
  dateTime: string;
  duration: number;
  zoomLink?: string;
}

export interface UpdateEventRequest {
  id: string;
  title?: string;
  description?: string;
  dateTime?: string;
  duration?: number;
  zoomLink?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface EventResponse {
  id: string;
  status: "YES" | "NO" | "MAYBE";
  userId: string;
  eventId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: User;
}

export interface EventResponsesResponse {
  data: EventResponse[];
  payload: {
    pagination: {
      page: number;
      itemsPerPage: number;
      total: number;
      lastPage: number;
    };
  };
}

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${backendUrl}/api`, // Update this with your actual API URL
    prepareHeaders: (headers) => {
      // Add auth token if needed
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    getEvents: builder.query<EventsResponse, { page?: number; limit?: number }>(
      {
        query: (params = {}) => ({
          url: "event",
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
          },
        }),
        providesTags: ["Event"],
      }
    ),
    getEventById: builder.query<Event, string>({
      query: (id) => `event/${id}`,
      providesTags: (result, error, id) => [{ type: "Event", id }],
    }),
    createEvent: builder.mutation<Event, CreateEventRequest>({
      query: (newEvent) => ({
        url: "event",
        method: "POST",
        body: newEvent,
      }),
      invalidatesTags: ["Event"],
    }),
    updateEvent: builder.mutation<Event, UpdateEventRequest>({
      query: ({ id, ...patch }) => ({
        url: `event/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Event", id },
        "Event",
      ],
    }),
    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `event/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Event"],
    }),
    getEventResponses: builder.query<EventResponsesResponse, string>({
      query: (eventId) => `event/${eventId}`,
      providesTags: (result, error, eventId) => [
        { type: "Event", id: eventId },
        "Event",
      ],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetEventResponsesQuery,
} = eventsApi;
