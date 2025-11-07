import React from "react";

export default function Categories({ categories, onSelectCategory }) {
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Browse Wedding Service Categories</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat)}
            style={{
              textAlign: "left",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: 12,
              background: "#fff",
              cursor: "pointer"
            }}
          >
            <div style={{ fontWeight: 600 }}>{cat.name}</div>
            <div style={{ color: "#64748b", fontSize: 13 }}>{cat.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}


