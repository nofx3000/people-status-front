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
import Summary from "../views/Summary/Index";
import Responsible from "../views/Responsible/Responsible";
import RecordDetail from "../views/RecordDetail/RecordDetail";
import Specialist from "../views/Specialist/Specialist";

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
        element: <Navigate to="/summary"></Navigate>,
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
        path: "summary",
        element: <Summary />,
      },
      {
        path: "record-detail/:person_id",
        element: <RecordDetail />,
      },
      {
        path: "specialist",
        element: <Specialist />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router}></RouterProvider>;
}
