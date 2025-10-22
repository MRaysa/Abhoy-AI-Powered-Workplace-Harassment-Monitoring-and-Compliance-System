import React from "react";
import AdminLayout from "../components/layouts/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import ReportsTable from "../pages/Admin/ReportsTable";
import Analytics from "../pages/Admin/Analytics";
import DepartmentView from "../pages/Admin/DepartmentView";
import CertificationPanel from "../pages/Admin/CertificationPanel";
import UserManagement from "../pages/Admin/UserManagement";
import ComplaintManagement from "../pages/Admin/ComplaintManagement";

const adminRoutes = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    {
      path: "reports",
      element: <ReportsTable />,
    },
    {
      path: "analytics",
      element: <Analytics />,
    },
    {
      path: "departments",
      element: <DepartmentView />,
    },
    {
      path: "certifications",
      element: <CertificationPanel />,
    },
    {
      path: "users",
      element: <UserManagement />,
    },
    {
      path: "complaints",
      element: <ComplaintManagement />,
    },
  ],
};

export default adminRoutes;
