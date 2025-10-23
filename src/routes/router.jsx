import { createBrowserRouter } from "react-router-dom";
import Root from "../pages/Root";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import PublicForum from "../pages/Employee/PublicForum";
import AnonymousComplaint from "../pages/Employee/AnonymousComplaint";
import TrackComplaint from "../pages/Employee/TrackComplaint";
import Chat from "../pages/Common/Chat";
import employeeRoutes from "./EmployeeRoutes";
import adminRoutes from "./AdminRoutes";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "forum",
        element: <PublicForum />,
      },
      {
        path: "submit-complaint",
        element: <AnonymousComplaint />,
      },
      {
        path: "track-complaint",
        element: <TrackComplaint />,
      },
      {
        path: "signin",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "chat",
        element: (
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        ),
      },
      
    ],
  },
  // Protected Employee Routes
  {
    path: employeeRoutes.path,
    element: (
      <PrivateRoute>
        {employeeRoutes.element}
      </PrivateRoute>
    ),
    children: employeeRoutes.children,
  },
  // Protected Admin Routes
  {
    path: adminRoutes.path,
    element: (
      <PrivateRoute requiredRole="Admin">
        {adminRoutes.element}
      </PrivateRoute>
    ),
    children: adminRoutes.children,
  },
]);

export default router;
