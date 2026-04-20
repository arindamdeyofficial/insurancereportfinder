import { baseApi } from "./baseApi";

export const sentimentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSentiments: builder.query({
      query: ({ skip = 0, limit = 50, label } = {}) => {
        const params = new URLSearchParams({ skip, limit });
        if (label) params.set("label", label);
        return `/sentiments?${params}`;
      },
      providesTags: ["Sentiment"],
    }),
  }),
});

export const { useGetSentimentsQuery } = sentimentsApi;
