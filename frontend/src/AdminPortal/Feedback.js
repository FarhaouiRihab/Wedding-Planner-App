import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";

export default function Feedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch feedback from backend (optional – will just fail silently if server not running)
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/feedback");
        setFeedbackList(res.data);
      } catch (err) {
        console.warn("No backend data yet, showing empty layout.");
        setFeedbackList([]); // keep layout even if empty
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  // Filter feedback by search text
  const filteredFeedback = feedbackList.filter(
    (fb) =>
      fb.name?.toLowerCase().includes(search.toLowerCase()) ||
      fb.email?.toLowerCase().includes(search.toLowerCase()) ||
      fb.service?.toLowerCase().includes(search.toLowerCase())
  );

  // Delete feedback (works locally if backend not connected yet)
  const handleDelete = (id) => {
    if (window.confirm("Delete this feedback?")) {
      setFeedbackList((prev) => prev.filter((fb) => fb.id !== id));
    }
  };

  return (
    <div className="panel">
      <h2 style={{ marginBottom: "1rem" }}>User Feedback</h2>

      {/* Search bar */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "8px" }}>
        <input
          type="text"
          placeholder="Search by name, email, or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Feedback Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Service</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                Loading feedback...
              </td>
            </tr>
          ) : filteredFeedback.length > 0 ? (
            filteredFeedback.map((fb) => (
              <tr key={fb.id}>
                <td>{fb.name}</td>
                <td>{fb.email}</td>
                <td>{fb.service}</td>
                <td>{"⭐".repeat(fb.rating || 0)}</td>
                <td>{fb.comment}</td>
                <td>
                  {fb.created_at
                    ? new Date(fb.created_at).toLocaleDateString()
                    : "—"}
                </td>
                <td>
                  <button
                    className="btn"
                    onClick={() => alert(`Viewing feedback from ${fb.name}`)}
                  >
                    View
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(fb.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: "center",
                  color: "#777",
                  fontStyle: "italic",
                  padding: "20px",
                }}
              >
                No feedback yet — your users’ feedback will appear here once added.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
