import { createBrowserRouter } from 'react-router-dom';
<<<<<<< feat/inputBox-component
import { ROUTERS } from '@/constant/route';
import Layout from '@/Layout';
import TestComponent from '@/components/TestComponent';
import Main from '@/pages/Main';
import Login from '@/pages/Login';
=======
import { ROUTERS } from './constant/route';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './Layout';
import TestComponent from './components/TestComponent';
import Main from './pages/Main';
>>>>>>> dev

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
];

export const router = createBrowserRouter(
  routeList.map((item) => {
    return {
      ...item,
      element: <Layout>{item.element}</Layout>,
    };
  })
);