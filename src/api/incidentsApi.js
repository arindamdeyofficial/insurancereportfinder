import { baseApi } from "./baseApi";

export const incidentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIncidents: builder.query({
      query: ({ skip = 0, limit = 50, severity } = {}) => {
        const params = new URLSearchParams({ skip, limit });
        if (severity) params.set("severity", severity);
        return `/incidents?${params}`;
      },
      providesTags: ["Incident"],
    }),
  }),
});

export const { useGetIncidentsQuery } = incidentsApi;
