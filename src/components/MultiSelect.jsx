import { useState, useRef, useEffect } from "react";

export function MultiSelect({ options, value, onChange, placeholder = "Select…" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (id) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  };

  const label = value.length === 0
    ? placeholder
    : value.length === options.length
    ? "All selected"
    : `${value.length} selected`;

  return (
    <div ref={ref} style={{ position: "relative", minWidth: 240 }}>
      <button
        type="button"
        className="btn btn-secondary"
        style={{ width: "100%", justifyContent: "space-between", fontWeight: 400 }}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{label}</span>
        <span style={{ marginLeft: 8 }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "var(--color-surface)", border: "1px solid var(--color-border)",
          borderRadius: "var(--radius)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          zIndex: 100, maxHeight: 280, overflowY: "auto",
        }}>
          <div style={{ padding: "8px", borderBottom: "1px solid var(--color-border)", display: "flex", gap: 8 }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onChange(options.map(o => o.value))}>All</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onChange([])}>None</button>
          </div>
          {options.map((opt) => (
            <label key={opt.value} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 12px", cursor: "pointer",
              background: value.includes(opt.value) ? "#eff6ff" : "transparent",
            }}>
              <input
                type="checkbox"
                style={{ width: "auto", cursor: "pointer" }}
                checked={value.includes(opt.value)}
                onChange={() => toggle(opt.value)}
              />
              <span style={{ flex: 1, fontSize: 13 }}>{opt.label}</span>
              {opt.badge && <span className={`badge badge-${opt.badge}`} style={{ fontSize: 10 }}>{opt.badge}</span>}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
