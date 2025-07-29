import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@cms/ui/styles/globals.css';
import './App.css';
import { QueryProviders } from './lib/QueryProvider.tsx';
import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProviders>
      <RouterProvider router={router} />
    </QueryProviders>
  </StrictMode>
);
