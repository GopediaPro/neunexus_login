import { createBrowserRouter } from 'react-router-dom';
import { ROUTERS } from './constant/route';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './Layout';
import TestComponent from './components/TestComponent';
import Main from './pages/Main';
import { PrivateRoute } from '@/components/layout/PrivateRoute';
import { PublicRoute } from '@/components/layout/PublicRoute';
import { ProductManagement } from './pages/ProductManagement';
import { OrderManagement } from './pages/OrderManagement';

const publicRouteList = [
  {
    path: ROUTERS.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTERS.SIGNUP,
    element: <Signup />,
  }
];

const privateRouteList = [
  {
    path: ROUTERS.MAIN,
    element: <Main />,
  },
  {
    path: ROUTERS.TEST,
    element: <TestComponent />,
  },
  {
    path: ROUTERS.PRODUCT_MANAGAMENT,
    element: <ProductManagement />
  },
  {
    path: ROUTERS.ORDER_MANAGEMENT,
    element: <OrderManagement />
  }
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