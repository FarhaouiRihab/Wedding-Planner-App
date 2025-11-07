import React from "react";

export default function ServiceDetail({ service, onBack, onAddToPlan }) {
  if (!service) return null;

  return (
    <div style={{ padding: 16 }}>
      <button onClick={onBack} style={{ marginBottom: 12 }}>← Back to Services</button>
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 16, background: "#fff" }}>
        <h2 style={{ marginTop: 0 }}>{service.name}</h2>
        <div style={{ color: "#64748b", marginBottom: 12 }}>{service.description}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: "#64748b" }}>Price</div>
            <div style={{ fontWeight: 600 }}>${service.price}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: "#64748b" }}>Availability</div>
            <div style={{ fontWeight: 600 }}>{service.available ? "Available" : "Unavailable"}</div>
          </div>
          {service.capacity ? (
            <div>
              <div style={{ fontSize: 13, color: "#64748b" }}>Capacity</div>
              <div style={{ fontWeight: 600 }}>{service.capacity}</div>
            </div>
          ) : null}
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <button
            onClick={() => onAddToPlan(service)}
            disabled={!service.available}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #22c55e",
              background: service.available ? "#22c55e" : "#94a3b8",
              color: "#fff",
              cursor: service.available ? "pointer" : "not-allowed"
            }}
          >
            Add to Plan
          </button>
        </div>
      </div>
    </div>
  );
}


