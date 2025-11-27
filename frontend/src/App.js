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

// ⭐ auth API helpers
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

// ---------- Login wrapper ----------
function LoginPage() {
  const navigate = useNavigate();

  async function handleLogin(form) {
    try {
      console.log("Login form:", form);

      const { user, token } = await loginAccount({
        email: form.email,
        password: form.password,
      });

      // store auth info
      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

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

// ---------- SignUp wrapper ----------
function SignUpPage() {
  const navigate = useNavigate();

  async function handleSignUp(form) {
    try {
      console.log("SignUp form:", form);

      const { user, token } = await registerAccount({
        full_name: form.fullName,
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

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
