import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  createHashRouter,
} from "react-router-dom";
import JwtAuth from "../utils/JwtAuth";
import Login from "../views/Login/Login";
import Index from "../views/Index/Index";
import Home from "../views/Home/Home";
import BasicInfo from "../views/BasicInfo/BasicInfo";
import PeopleStatus from "../views/PeopleStatus/PeopleStatus";
import Summary from "../views/Summary/Summary";

const router = createHashRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <JwtAuth>
        <Index />
      </JwtAuth>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/home"></Navigate>,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "status",
        element: <PeopleStatus />,
      },
      {
        path: "basicinfo",
        element: <BasicInfo />,
      },
      {
        path: "summary",
        element: <Summary />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router}></RouterProvider>;
}
