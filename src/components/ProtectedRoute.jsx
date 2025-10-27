// src/components/ProtectedRoute.jsx - FIXED VERSION
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
        localStorage.setItem("authToken", user.uid); // Set token for consistency
      } else {
        setAuthenticated(false);
        localStorage.removeItem("authToken");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060C1A]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return authenticated ? children : <Navigate to="/" replace />;
}