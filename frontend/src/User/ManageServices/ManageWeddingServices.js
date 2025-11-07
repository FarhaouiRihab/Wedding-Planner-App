import React, { useMemo, useState, useEffect } from "react";
import Categories from "./Categories";
import ServicesByCategory from "./ServicesByCategory";
import ServiceDetail from "./ServiceDetail";

const STORAGE_KEY = "weddingPlanServices";

function loadPlan() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function savePlan(services) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
}

export default function ManageWeddingServices({ onExit }) {
  const categories = useMemo(
    () => [
      { id: "venue", name: "Venues", description: "Locations and spaces for your event" },
      { id: "catering", name: "Catering", description: "Food and beverage providers" },
      { id: "dj", name: "DJ & Music", description: "Entertainment and music" },
      { id: "photo", name: "Photography", description: "Photographers and videographers" }
    ],
    []
  );

  const allServices = useMemo(
    () => ({
      venue: [
        { id: "v1", name: "Grand Hall", description: "Elegant ballroom in city center", price: 4500, capacity: 250, available: true },
        { id: "v2", name: "Garden Terrace", description: "Outdoor venue with greenery", price: 3800, capacity: 180, available: true }
      ],
      catering: [
        { id: "c1", name: "Gourmet Feast", description: "Full-service fine dining catering", price: 65, available: true },
        { id: "c2", name: "Casual Bites", description: "Buffet-style comfort food", price: 35, available: false }
      ],
      dj: [
        { id: "d1", name: "DJ Spark", description: "High-energy mixes and lighting", price: 1200, available: true },
        { id: "d2", name: "DJ Calm", description: "Chill vibes and classics", price: 900, available: true }
      ],
      photo: [
        { id: "p1", name: "Lens Masters", description: "Photo + Video package", price: 2500, available: true },
        { id: "p2", name: "Candid Co.", description: "Candid photography specialists", price: 1800, available: true }
      ]
    }),
    []
  );

  const [plan, setPlan] = useState(() => loadPlan());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [compareSet, setCompareSet] = useState(new Set());

  useEffect(() => {
    savePlan(plan);
  }, [plan]);

  const servicesInCategory = selectedCategory ? allServices[selectedCategory.id] || [] : [];

  function handleAddToPlan(service) {
    if (!service) return;
    setPlan((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      if (exists) return prev;
      return [...prev, { ...service, categoryId: selectedCategory ? selectedCategory.id : null }];
    });
    alert("Service added to your plan");
  }

  function handleRemoveFromPlan(serviceId) {
    setPlan((prev) => prev.filter((s) => s.id !== serviceId));
  }

  function toggleCompare(service) {
    setCompareSet((prev) => {
      const next = new Set(prev);
      if (next.has(service.id)) next.delete(service.id);
      else next.add(service.id);
      return next;
    });
  }

  const compareItems = useMemo(() => {
    if (!selectedCategory) return [];
    const pool = allServices[selectedCategory.id] || [];
    return pool.filter((s) => compareSet.has(s.id));
  }, [compareSet, allServices, selectedCategory]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, padding: 16 }}>
      <div>
        {!selectedCategory && (
          <Categories categories={categories} onSelectCategory={(c) => { setSelectedCategory(c); setSelectedService(null); setCompareSet(new Set()); }} />
        )}

        {selectedCategory && !selectedService && (
          <ServicesByCategory
            category={selectedCategory}
            services={servicesInCategory}
            onBack={() => setSelectedCategory(null)}
            onViewDetails={(svc) => setSelectedService(svc)}
            onToggleCompare={toggleCompare}
            compareSet={compareSet}
          />
        )}

        {selectedService && (
          <ServiceDetail
            service={selectedService}
            onBack={() => setSelectedService(null)}
            onAddToPlan={handleAddToPlan}
          />
        )}
      </div>

      <aside style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 12, background: "#fff", height: "fit-content" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Your Plan</h3>
          <button onClick={onExit} style={{ fontSize: 12 }}>Exit</button>
        </div>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>Selected services are saved automatically.</div>
        {plan.length === 0 ? (
          <div style={{ color: "#64748b", fontSize: 14 }}>No services selected yet.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
            {plan.map((p) => (
              <li key={p.id} style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>${p.price}</div>
                  </div>
                  <button onClick={() => handleRemoveFromPlan(p.id)} style={{ fontSize: 12 }}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {selectedCategory && compareItems.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Compare</div>
            <div style={{ display: "grid", gap: 8 }}>
              {compareItems.map((ci) => (
                <div key={ci.id} style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 600 }}>{ci.name}</div>
                    <div style={{ fontWeight: 600 }}>${ci.price}</div>
                  </div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>{ci.available ? "Available" : "Unavailable"}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}


