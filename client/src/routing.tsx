import { createBrowserRouter } from 'react-router-dom';
import { ROUTERS } from './constant/route';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './Layout';
import TestComponent from './components/TestComponent';
import Main from './pages/Main';
import RegisterTest from '@/components/RegisterTestComponent';

const routeList = [
  {
    path: ROUTERS.MAIN,
    element: <Main />,
  },
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
  },
  {
    path: ROUTERS.REGISTER_TEST,
    element: <RegisterTest />
  }
];

export const router = createBrowserRouter(
  routeList.map((item) => {
    return {
      ...item,
      element: <Layout>{item.element}</Layout>,
    };
  })
);