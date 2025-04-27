import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 3,
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 3,
      networkMode: 'offlineFirst',
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error(`Query error: ${error}`, query);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error(`Mutation error: ${error}`);
    },
  }),
});
