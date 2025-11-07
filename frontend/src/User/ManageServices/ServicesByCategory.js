import React from "react";

export default function ServicesByCategory({ category, services, onBack, onViewDetails, onToggleCompare, compareSet }) {
  return (
    <div style={{ padding: 16 }}>
      <button onClick={onBack} style={{ marginBottom: 12 }}>← Back to Categories</button>
      <h2 style={{ marginBottom: 8 }}>{category.name}</h2>
      <div style={{ color: "#64748b", marginBottom: 16 }}>{category.description}</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {services.map((svc) => (
          <div key={svc.id} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 12, background: "#fff" }}>
            <div style={{ fontWeight: 600 }}>{svc.name}</div>
            <div style={{ color: "#64748b", fontSize: 13, margin: "6px 0" }}>{svc.description}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <div style={{ fontWeight: 600 }}>${svc.price}</div>
              <div style={{ fontSize: 12, color: svc.available ? "#16a34a" : "#dc2626" }}>
                {svc.available ? "Available" : "Unavailable"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={() => onViewDetails(svc)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}>View Details</button>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={compareSet.has(svc.id)}
                  onChange={() => onToggleCompare(svc)}
                />
                Compare
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


