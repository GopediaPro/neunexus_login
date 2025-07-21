// provider/queryProvider 
import { getErrorByCode } from '@/utils/getErrorByCode';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface ReactQueryProviderProps {
  children: React.ReactNode;
  showDevTools?: boolean;
}

function ReactQueryProvider({
  showDevTools,
  children,
}: ReactQueryProviderProps) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retryOnMount: true,
          refetchOnReconnect: false,
          retry: false,
        },
        mutations: {
          throwOnError: false,
          onError: (error) => {
            if (error instanceof AxiosError) {
              const { description } = getErrorByCode(error);
              toast.error(description);
            }
          }
        },
      },
    }),
  );
  return (
    <QueryClientProvider client={client}>
      {showDevTools && <ReactQueryDevtools buttonPosition="bottom-left" />}
      {children}
    </QueryClientProvider>
  );
}

ReactQueryProvider.defaultProps = {
  showDevTools: false,
};

export default ReactQueryProvider;