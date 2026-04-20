import { baseApi } from "./baseApi";

export const rivalAdsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRivalAds: builder.query({
      query: ({ skip = 0, limit = 50, competitor } = {}) => {
        const params = new URLSearchParams({ skip, limit });
        if (competitor) params.set("competitor", competitor);
        return `/rival-ads?${params}`;
      },
      providesTags: ["RivalAd"],
    }),
  }),
});

export const { useGetRivalAdsQuery } = rivalAdsApi;
