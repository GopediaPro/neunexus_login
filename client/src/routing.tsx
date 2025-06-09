import { createBrowserRouter } from 'react-router-dom';
import { ROUTERS } from "./constant/route";
import Login from "./pages/Login";
import Layout from './Layout';

const routeList = [
  {
    path: ROUTERS.LOGIN,
    element: <Login />
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