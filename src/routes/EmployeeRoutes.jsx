import React from "react";
import EmployeeLayout from "../components/layouts/EmployeeLayout";
import Home from "../pages/Employee/Home";
import ReportForm from "../pages/Employee/ReportForm";
import MyReports from "../pages/Employee/MyReports";
import LegalSupport from "../pages/Employee/LegalSupport";
import WorkplaceFinder from "../pages/Employee/WorkplaceFinder";
import Settings from "../pages/Employee/Settings";

const employeeRoutes = {
  path: "/employee",
  element: <EmployeeLayout />,
  children: [
    {
      path: "home",
      element: <Home />,
    },
    {
      path: "report",
      element: <ReportForm />,
    },
    {
      path: "reports",
      element: <MyReports />,
    },
    {
      path: "legal-support",
      element: <LegalSupport />,
    },
    {
      path: "workplace-finder",
      element: <WorkplaceFinder />,
    },
    {
      path: "settings",
      element: <Settings />,
    },
  ],
};

export default employeeRoutes;
