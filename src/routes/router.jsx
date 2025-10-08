import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";
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
    ],
  },
  // Protected Employee Routes
  {
    ...employeeRoutes,
    element: (
      <PrivateRoute>
        {employeeRoutes.element}
      </PrivateRoute>
    ),
  },
  // Protected Admin Routes
  {
    ...adminRoutes,
    element: (
      <PrivateRoute requiredRole="Admin">
        {adminRoutes.element}
      </PrivateRoute>
    ),
  },
]);

export default router;
