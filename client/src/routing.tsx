import { createBrowserRouter } from 'react-router-dom';
import { ROUTERS } from './constant/route';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './Layout';
import TestComponent from './components/TestComponent';
import Main from './pages/Main';
import { PrivateRoute } from '@/components/layout/PrivateRoute';
import { PublicRoute } from '@/components/layout/PublicRoute';

const publicRouteList = [
  {
    path: ROUTERS.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTERS.SIGNUP,
    element: <Signup />,
  },
  {
    path: ROUTERS.TEST,
    element: <TestComponent />,
  }
];

const privateRouteList = [
  {
    path: ROUTERS.MAIN,
    element: <Main />,
  },
]

export const router = createBrowserRouter([
  ...privateRouteList.map(({ path, element }) => ({
    path,
    element: (
      <PrivateRoute>
        <Layout>{element}</Layout>
      </PrivateRoute>
    )
  })),
  ...publicRouteList.map(({ path, element }) => ({
    path,
    element: (
      <PublicRoute>
        <Layout>{element}</Layout>
      </PublicRoute>
    ),
  })),
]);