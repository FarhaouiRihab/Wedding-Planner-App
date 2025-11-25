import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import "./User/user-pages.css";

// Pages
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

// Below this point = only your component definitions
function LoginPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  function handleLogin(form) {
    console.log("Logged in:", form);
    setUser({ email: form.email });
    setView("admin");
  }

  return <Login onLogin={handleLogin} onGoSignUp={() => navigate("/signup")} />;
}

function SignUpPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  function handleSignUp(form) {
    console.log("Signed up:", form);
    setUser({ email: form.email });
    setView("admin");
  }

  // === Render depending on the view ===
  if (view === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onGoSignUp={() => setView("signup")}
      />
    );
  }

  if (view === "signup") {
    return (
      <SignUp
        onSignUp={handleSignUp}
        onGoLogin={() => setView("login")}
      />
    );
  }

}

export default App;
