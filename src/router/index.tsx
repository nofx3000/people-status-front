import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  createHashRouter,
} from "react-router-dom";
import JwtAuth from "../utils/JwtAuth";
import Login from "../views/Login/Login";
import Index from "../views/Index/Index";
import List from "../views/List/List";
import BasicInfo from "../views/BasicInfo/BasicInfo";
import Responsible from "../views/Responsible/Responsible";
import RecordDetail from "../views/RecordDetail/RecordDetail";
import Specialist from "../views/Specialist/Specialist";
import Dashboard from "../views/Dashboard/Dashboard";
import Policy from "../views/Policy/Policy";

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
        path: "/",
        index: true,
        element: <Dashboard />,
      },
      {
        path: "list",
        element: <List />,
      },
      {
        path: "basicinfo",
        element: <BasicInfo />,
      },
      {
        path: "responsible",
        element: <Responsible />,
      },
      {
        path: "record-detail/:person_id",
        element: <RecordDetail />,
      },
      {
        path: "specialist",
        element: <Specialist />,
      },
      {
        path: "policy",
        element: <Policy />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router}></RouterProvider>;
}
