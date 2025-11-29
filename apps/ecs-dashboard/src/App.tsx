import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { QueryProviders } from './lib/QueryProvider';

function App() {
  return (
    <QueryProviders>
      <RouterProvider router={router} />
    </QueryProviders>
  );
}

export default App;
