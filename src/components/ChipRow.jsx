/**
 * Reusable chip-style picker. Each option becomes a small pill button;
 * the active one is filled in gold.
 */
export default function ChipRow({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
      {options.map(opt => {
        const active = value === opt.value;
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} title={opt.title}
            style={{
              background: active ? "#d4a13b" : "transparent",
              color: active ? "#0a1816" : "#e8e3d3",
              border: "1px solid " + (active ? "#d4a13b" : "rgba(232,227,211,0.2)"),
              padding: "5px 9px", borderRadius: 4, cursor: "pointer",
              fontSize: 10, letterSpacing: "0.1em",
              textTransform: "uppercase", fontWeight: 600,
            }}>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
