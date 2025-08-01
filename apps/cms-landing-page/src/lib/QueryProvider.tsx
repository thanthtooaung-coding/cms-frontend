import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryclient';

export function QueryProviders({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
