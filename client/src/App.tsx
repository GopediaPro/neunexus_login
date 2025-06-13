import { RouterProvider } from 'react-router-dom';
import './App.css';
import { router } from './routing';
import { AuthProvider } from './contexts/AuthContext';
import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from '@/routing'

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
