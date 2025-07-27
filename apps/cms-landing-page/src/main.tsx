import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryProviders } from './lib/QueryProvider.tsx';
import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import '@cms/ui/styles/globals.css';
import { createApiClient, setApiClient } from '@cms/data';

setApiClient(createApiClient(import.meta.env.VITE_BACKEND_SERVER));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProviders>
      <RouterProvider router={router} />
    </QueryProviders>
  </StrictMode>
);
