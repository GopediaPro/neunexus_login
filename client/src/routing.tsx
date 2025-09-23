import { createBrowserRouter } from 'react-router-dom';
import { ROUTERS } from './constants/route';
import Layout from './Layout';
import { TestComponent } from './components/TestComponent';
import { PrivateRoute } from '@/components/layout/PrivateRoute';
import { PublicRoute } from '@/components/layout/PublicRoute';
import { LoginPage } from './pages/Auth/LoginPage';
import { SignupPage } from './pages/Auth/SignupPage';
import { MainPage } from './pages/Main/MainPage';
import { ProductManagementPage } from './pages/Product/ProductManagementPage';
import { OrderManagementPage } from './pages/Order/OrderManagementPage';
import { RuleEngineManagementPage } from './pages/RuleEngineManagementPage';
import { Error } from './components/ui/NotFound';

const publicRouteList = [
  {
    path: ROUTERS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTERS.SIGNUP,
    element: <SignupPage />,
  }
];

const privateRouteList = [
  {
    path: ROUTERS.MAIN,
    element: <MainPage />,
  },
  {
    path: ROUTERS.TEST,
    element: <TestComponent />,
  },
  {
    path: ROUTERS.PRODUCT_MANAGEMENT,
    element: <ProductManagementPage />
  },
  {
    path: ROUTERS.ORDER_MANAGEMENT,
    element: <OrderManagementPage />
  },
  {
    path: ROUTERS.RULE_ENGINE_MANAGEMENT,
    element: <RuleEngineManagementPage />
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
  {
    path: '*',
    element: <Error /> //
  }
]);
