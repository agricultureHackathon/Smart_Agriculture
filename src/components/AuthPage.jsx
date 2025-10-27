// src/components/AuthPage.jsx - FIXED VERSION (No Flashing)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import TranslatedText from "./TranslatedText";
import LanguageSwitcher from "./LanguageSwitcher";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to dashboard immediately
        navigate("/dashboard", { replace: true });
      } else {
        // No user, show auth page
        setCheckingAuth(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || (!isLogin && !username)) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
        localStorage.setItem("authToken", userCred.user.uid);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        await updateProfile(userCredential.user, { displayName: username });
        localStorage.setItem("authToken", userCredential.user.uid);
      }

      // Navigation will be handled by useEffect above
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-credential")
        setError("Invalid credentials! Please check your email and password.");
      else if (err.code === "auth/email-already-in-use")
        setError("Email already registered");
      else if (err.code === "auth/weak-password")
        setError("Password should be at least 6 characters");
      else if (err.code === "auth/invalid-email")
        setError("Invalid email address");
      else if (err.code === "auth/user-not-found")
        setError("User not found. Please sign up first.");
      else setError(err.message);
      
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setPassword("");
    setUsername("");
  };

  // Show loading while checking auth status
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060C1A]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060C1A] p-4">
      <div className="bg-[#0E1421] p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Language Switcher at top */}
        <div className="mb-6">
          <LanguageSwitcher />
        </div>

        <h2 className="text-3xl font-bold mb-6 text-white text-center">
          <TranslatedText>{isLogin ? "Login" : "Sign Up"}</TranslatedText>
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#121B2F] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#742BEC]"
              required
              disabled={loading}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#121B2F] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#742BEC]"
            required
            disabled={loading}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl bg-[#121B2F] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#742BEC]"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <img
                src={
                  showPassword
                    ? "/assets/password-close.png"
                    : "/assets/password-open.png"
                }
                alt="toggle"
                className="w-full h-full"
              />
            </button>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#742BEC] text-white py-3 rounded-xl hover:bg-[#5a22b5] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Processing..."
            ) : (
              <TranslatedText>{isLogin ? "Login" : "Sign Up"}</TranslatedText>
            )}
          </button>
        </form>

        <button
          type="button"
          disabled={loading}
          className="mt-4 w-full text-center text-sm text-[#742BEC] hover:text-[#5a22b5] cursor-pointer transition-colors disabled:opacity-50"
          onClick={handleToggleMode}
        >
          <TranslatedText>
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </TranslatedText>
        </button>
      </div>
    </div>
  );
}