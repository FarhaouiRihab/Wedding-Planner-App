import React, { useState } from "react";
import "./App.css";

// Import the pages
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";
import ManageWeddingServices from "./User/ManageServices/ManageWeddingServices";

function App() {
  // Control which page to display
  const [view, setView] = useState("login"); // default = login
  const [user, setUser] = useState(null);

  // Simulated login/signup success handlers
  function handleLogin(form) {
    console.log("Logged in:", form);
    setUser({ email: form.email });
    setView("home");
  }

  function handleSignUp(form) {
    console.log("Signed up:", form);
    setUser({ email: form.email });
    setView("home");
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

  // Authenticated area
  if (user) {
    if (view === "services") {
      return (
        <ManageWeddingServices onExit={() => setView("home")} />
      );
    }

    // Default home for authenticated user
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Welcome</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 14, color: "#64748b" }}>{user.email}</div>
            <button onClick={() => { setUser(null); setView("login"); }}>
              Logout
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: 12, maxWidth: 680 }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Manage Wedding Services</div>
            <div style={{ color: "#64748b", marginBottom: 12 }}>
              Browse, compare, and select services for your wedding plan.
            </div>
            <button onClick={() => setView("services")}>
              Open
            </button>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
