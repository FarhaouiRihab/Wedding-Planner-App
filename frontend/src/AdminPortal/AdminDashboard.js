import React, { useState } from "react";
import "./admin.css";                 // ✅ correct CSS import (no variable)
import AddService from "./AddService";
import Accounts from "./Accounts";
import Feedback from "./Feedback";

export default function AdminDashboard() {
  const [tab, setTab] = useState("add-service");

  const NavItem = ({ id, label }) => (
    <button
      onClick={() => setTab(id)}
      className={`nav-item ${tab === id ? "active" : ""}`}   // ✅ scoped styling
    >
      {label}
    </button>
  );

  return (
    <div className="admin">                                {/* ✅ scope root */}
      {/* Topbar */}
      <div className="topbar">
        <div className="brand">Wedding Planner — Admin</div>
        <button className="logout-btn" onClick={() => console.log("Logout clicked")}>
  Logout
</button>
      </div>

      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="section-title">Admin Panel</div>
          <NavItem id="add-service" label="Add Service" />
          <NavItem id="accounts" label="Accounts" />
          <NavItem id="feedback" label="Feedback" />
        </aside>

        {/* Content */}
        <main className="content">
          {tab === "add-service" && <AddService />}
          {tab === "accounts" && <Accounts />}
          {tab === "feedback" && <Feedback />}
        </main>
      </div>
    </div>
  );
}
