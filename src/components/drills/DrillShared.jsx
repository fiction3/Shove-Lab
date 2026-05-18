// Shared subcomponents used inside every drill type.

export function DrillFrame({ children, title, subtitle }) {
  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(15,40,32,0.6) 0%, rgba(8,22,18,0.8) 100%)",
      borderRadius: 16,
      border: "1px solid rgba(212,161,59,0.2)",
      padding: 32,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 30% 20%, rgba(212,161,59,0.06) 0%, transparent 50%)",
        pointerEvents: "none",
      }}/>
      <div style={{ position: "relative" }}>
        {title && (
          <div style={{
            fontSize: 10, letterSpacing: "0.25em",
            textTransform: "uppercase", opacity: 0.5, marginBottom: 6,
          }}>
            {subtitle}
          </div>
        )}
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 28, fontWeight: 500, margin: "0 0 24px 0",
          lineHeight: 1.2,
        }}>
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

export function ChoiceButton({ label, isCorrect, isChosen, revealed, onClick, disabled }) {
  let bg = "transparent";
  let borderColor = "rgba(232,227,211,0.25)";
  let color = "#e8e3d3";
  if (revealed) {
    if (isCorrect) { bg = "rgba(127,198,154,0.18)"; borderColor = "#7fc69a"; color = "#7fc69a"; }
    else if (isChosen) { bg = "rgba(224,122,95,0.15)"; borderColor = "#e07a5f"; color = "#e07a5f"; }
    else { color = "rgba(232,227,211,0.45)"; }
  }
  return (
    <button onClick={onClick} disabled={disabled || revealed}
      style={{
        background: bg, color, border: `1px solid ${borderColor}`,
        padding: "14px 22px", borderRadius: 6, cursor: revealed ? "default" : "pointer",
        fontSize: 16, fontFamily: "inherit", fontWeight: 600,
        letterSpacing: "-0.01em",
        minWidth: 100, flex: 1,
        transition: "all 0.15s",
      }}>
      {label}
    </button>
  );
}

export function NumberInput({ value, onChange, onSubmit, placeholder, suffix, disabled }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0,
      background: "rgba(0,0,0,0.3)", border: "1px solid rgba(232,227,211,0.2)",
      borderRadius: 6, overflow: "hidden", maxWidth: 240,
    }}>
      <input type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") onSubmit?.(); }}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          flex: 1, background: "transparent", color: "#fafaf7",
          border: "none", outline: "none",
          padding: "12px 14px", fontSize: 18, fontFamily: "inherit",
          fontWeight: 600,
        }}/>
      {suffix && (
        <span style={{
          padding: "0 14px", color: "rgba(232,227,211,0.6)",
          fontSize: 14, fontWeight: 500,
          borderLeft: "1px solid rgba(232,227,211,0.15)",
        }}>
          {suffix}
        </span>
      )}
    </div>
  );
}

export function FeedbackBox({ grade, trueValue, explanation, suffix }) {
  const color = grade === "exact" ? "#7fc69a"
              : grade === "close" ? "#d4a13b"
              : "#e07a5f";
  const label = grade === "exact" ? "Correct"
              : grade === "close" ? "Close"
              : "Off";
  return (
    <div style={{
      marginTop: 22, padding: 18,
      background: `rgba(${grade === "exact" ? "127,198,154" : grade === "close" ? "212,161,59" : "224,122,95"}, 0.08)`,
      borderLeft: `2px solid ${color}`,
      borderRadius: 4,
    }}>
      <div style={{
        display: "flex", alignItems: "baseline",
        gap: 12, marginBottom: 8,
      }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 22, color, fontWeight: 600,
        }}>
          {label}
        </span>
        <span style={{ fontSize: 13, opacity: 0.7 }}>
          True answer: <strong style={{ color: "#d4a13b" }}>{trueValue}{suffix}</strong>
        </span>
      </div>
      {explanation && (
        <div style={{ fontSize: 13, lineHeight: 1.55, opacity: 0.88 }}>
          {explanation}
        </div>
      )}
    </div>
  );
}

export function NextButton({ onClick }) {
  return (
    <button onClick={onClick} style={{
      marginTop: 18,
      background: "#d4a13b", color: "#0a1816", border: "none",
      padding: "10px 26px", borderRadius: 6, cursor: "pointer",
      fontSize: 12, letterSpacing: "0.2em",
      textTransform: "uppercase", fontWeight: 600,
    }}>
      Next →
    </button>
  );
}
