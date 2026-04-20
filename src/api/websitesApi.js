import { baseApi } from "./baseApi";

export const websitesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWebsites: builder.query({
      query: (activeOnly = false) => `/websites${activeOnly ? "?active_only=true" : ""}`,
      providesTags: ["Website"],
    }),
    createWebsite: builder.mutation({
      query: (body) => ({ url: "/websites", method: "POST", body }),
      invalidatesTags: ["Website"],
    }),
    toggleWebsite: builder.mutation({
      query: (id) => ({ url: `/websites/${id}/toggle`, method: "PATCH" }),
      invalidatesTags: ["Website"],
    }),
    deleteWebsite: builder.mutation({
      query: (id) => ({ url: `/websites/${id}`, method: "DELETE" }),
      invalidatesTags: ["Website"],
    }),
    triggerScrape: builder.mutation({
      query: (website_ids) => ({ url: "/scrape", method: "POST", body: { website_ids } }),
    }),
  }),
});

export const {
  useGetWebsitesQuery,
  useCreateWebsiteMutation,
  useToggleWebsiteMutation,
  useDeleteWebsiteMutation,
  useTriggerScrapeMutation,
} = websitesApi;
