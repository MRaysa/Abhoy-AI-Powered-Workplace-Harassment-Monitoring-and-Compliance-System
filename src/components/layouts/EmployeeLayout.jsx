import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../shared/Sidebar";
import {
  FaHome,
  FaFileAlt,
  FaChartLine,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaCog,
  FaUserSecret,
  FaSearch,
  FaComments,
} from "react-icons/fa";

const EmployeeLayout = () => {
  const menuItems = [
    { path: "/employee/home", label: "Home", icon: <FaHome /> },
    { path: "/employee/anonymous-complaint", label: "Anonymous Complaint", icon: <FaUserSecret /> },
    { path: "/employee/track-complaint", label: "Track Complaint", icon: <FaSearch /> },
    { path: "/employee/forum", label: "Public Forum", icon: <FaComments /> },
    { path: "/employee/report", label: "Report Incident", icon: <FaFileAlt /> },
    { path: "/employee/reports", label: "My Reports", icon: <FaChartLine /> },
    {
      path: "/employee/legal-support",
      label: "Legal Support",
      icon: <FaShieldAlt />,
    },
    {
      path: "/employee/workplace-finder",
      label: "Workplace Finder",
      icon: <FaMapMarkerAlt />,
    },
    { path: "/employee/settings", label: "Settings", icon: <FaCog /> },
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

export default EmployeeLayout;
