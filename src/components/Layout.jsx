import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/", { replace: true });
  };

  return (
    <div className="w-full flex flex-col lg:flex-row justify-start items-start">
      <Sidebar onLogout={handleLogout} />
      <div className="w-full min-h-screen flex-1">
        <Outlet /> 
      </div>
    </div>
  );
}

export default Layout;