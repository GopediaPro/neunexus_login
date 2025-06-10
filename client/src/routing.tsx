import { createBrowserRouter } from 'react-router-dom';
import { ROUTERS } from '@/constant/route';
import Layout from '@/Layout';
import TestComponent from '@/components/TestComponent';
import Main from '@/pages/Main';
import Login from '@/pages/Login';

const routeList = [
  {
    path: ROUTERS.MAIN,
    element: <Main />
  },
  {
    path: ROUTERS.LOGIN,
    element: <Login />
  },
  {
    path: ROUTERS.TEST,
    element: <TestComponent />
  },
];

export const router = createBrowserRouter(
  routeList.map((item) => {
    return {
      ...item,
      element: <Layout>{item.element}</Layout>,
    };
  })
);