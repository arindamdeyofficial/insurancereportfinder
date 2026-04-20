import { baseApi } from "./baseApi";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSentimentTrend: build.query({
      query: (days = 30) => `/analytics/sentiment-trend?days=${days}`,
    }),
    getIncidentTrend: build.query({
      query: (days = 30) => `/analytics/incident-trend?days=${days}`,
    }),
    getRivalLeaderboard: build.query({
      query: (days = 30) => `/analytics/rival-leaderboard?days=${days}`,
    }),
    getSourceActivity: build.query({
      query: (days = 30) => `/analytics/source-activity?days=${days}`,
    }),
  }),
});

export const {
  useGetSentimentTrendQuery,
  useGetIncidentTrendQuery,
  useGetRivalLeaderboardQuery,
  useGetSourceActivityQuery,
} = analyticsApi;
