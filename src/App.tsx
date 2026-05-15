import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AppRoute } from './routes/appRoute';
import { AuthProvider } from './libs/ui/context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {

  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient} >
        <AuthProvider>
          <BrowserRouter>
            <AppRoute></AppRoute>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </>
  )
}

export default App;