import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../shared/Sidebar";
import {
  FaChartPie,
  FaTable,
  FaChartBar,
  FaBuilding,
  FaCertificate,
  FaUsers,
} from "react-icons/fa";

const AdminLayout = () => {
  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaChartPie /> },
    { path: "/admin/reports", label: "All Reports", icon: <FaTable /> },
    { path: "/admin/analytics", label: "Analytics", icon: <FaChartBar /> },
    {
      path: "/admin/departments",
      label: "Departments",
      icon: <FaBuilding />,
    },
    {
      path: "/admin/certifications",
      label: "Certifications",
      icon: <FaCertificate />,
    },
    { path: "/admin/users", label: "User Management", icon: <FaUsers /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar menuItems={menuItems} />
        <main className="flex-1 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
