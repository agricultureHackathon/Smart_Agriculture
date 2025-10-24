import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    // optional: clear user state, localStorage, session, etc.
    localStorage.clear(); 

    // navigate to login page
    navigate("/", { replace: true });
  };

  return (
    <div className="w-full flex flex-col lg:flex-row justify-start items-start">
      <Sidebar onLogout={handleLogout} /> {/* pass the function */}
      <div className="w-full min-h-screen flex-1">
        <Outlet /> 
      </div>
    </div>
  );
}

export default Layout;