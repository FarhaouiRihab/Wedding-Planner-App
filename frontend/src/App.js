import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import "./App.css";
import "./User/user-pages.css";

// Pages
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";
import AdminDashboard from "./AdminPortal/AdminDashboard";

import Home from "./Guest/Home";
import AddPhotos from "./Guest/AddPhotos";
import ParkingCapacity from "./Guest/ParkingCapacity";

// ⭐ NEW: auth API helpers
import { loginAccount, registerAccount } from "./api/client";

function App() {
  return (
    <Router>
      <Routes>
        {/* default -> login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* after login */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* invitation routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/invite/:invitationId/photos" element={<AddPhotos />} />
        <Route
          path="/invite/:invitationId/parking"
          element={<ParkingCapacity />}
        />
      </Routes>
    </Router>
  );
}

// --------- Component wrappers ---------

function LoginPage() {
  const navigate = useNavigate();

  // 🔐 real login using backend
  async function handleLogin(form) {
    try {
      const { user, token } = await loginAccount({
        email: form.email,
        password: form.password,
      });

      // store auth info
      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      // redirect based on role (single ADMIN, others = normal users)
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please check your email and password.");
    }
  }

  return (
    <Login
      onLogin={handleLogin}
      onGoSignUp={() => navigate("/signup")}
    />
  );
}

function SignUpPage() {
  const navigate = useNavigate();

  // 🔐 real register using backend
  async function handleSignUp(form) {
    try {
      const { user, token } = await registerAccount({
        full_name: form.fullName,      // map camelCase → snake_case
        email: form.email,
        password: form.password,
        // role is forced to USER in backend; no admin created here
      });

      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      // after signup you can go straight to /home or back to login
      navigate("/home");
    } catch (err) {
      console.error("Sign up failed:", err);
      alert("Sign up failed. Try a different email.");
    }
  }

  return (
    <SignUp
      onSignUp={handleSignUp}
      onGoLogin={() => navigate("/login")}
    />
  );
}

export default App;
