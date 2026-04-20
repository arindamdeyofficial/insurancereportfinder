import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/admin/users",
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (body) => ({ url: "/admin/users", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    triggerScrape: builder.mutation({
      query: () => ({ url: "/admin/scrape", method: "POST" }),
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation, useTriggerScrapeMutation } = adminApi;
