import { useMemo } from "react";
import { icmEquities } from "../lib/icm.js";
import { ordinal } from "../lib/handUtils.js";

const inputStyle = {
  flex: 1,
  background: "rgba(0,0,0,0.3)",
  color: "#fafaf7",
  border: "1px solid rgba(232,227,211,0.2)",
  borderRadius: 4,
  padding: "6px 10px",
  fontSize: 13,
};

const smallBtn = {
  background: "transparent",
  color: "#d4a13b",
  border: "1px solid rgba(212,161,59,0.4)",
  borderRadius: 4, padding: "5px 10px",
  cursor: "pointer", fontSize: 11,
  letterSpacing: "0.1em", textTransform: "uppercase",
};

function Stat({ label, value, highlight }) {
  return (
    <div style={{
      background: highlight ? "rgba(200,16,46,0.15)" : "rgba(0,0,0,0.2)",
      borderRadius: 6, padding: "12px 16px",
      border: highlight ? "1px solid rgba(200,16,46,0.3)" : "1px solid transparent",
    }}>
      <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.6 }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'Inter', sans-serif", fontSize: 26, fontWeight: 700,
        color: highlight ? "#e07a5f" : "#d4a13b", marginTop: 4,
      }}>{value}</div>
    </div>
  );
}

/**
 * Custom ICM editor. User enters chip stacks (player 1 = hero) and the
 * prize structure. We run Malmuth-Harville and display each player's $
 * equity. Computed push/call/reshove multipliers are shown at the bottom
 * — these get applied in the trainer when stage is set to CUSTOM.
 */
export default function ICMSetup({ icmState, setICMState, computedMults }) {
  const { stacks, payouts } = icmState;

  const equities = useMemo(() => icmEquities(stacks, payouts), [stacks, payouts]);
  const totalPayout = payouts.reduce((a, b) => a + b, 0);

  function updateStack(i, val) {
    const v = Math.max(0, parseFloat(val) || 0);
    setICMState({ ...icmState, stacks: stacks.map((s, idx) => idx === i ? v : s) });
  }
  function updatePayout(i, val) {
    const v = Math.max(0, parseFloat(val) || 0);
    setICMState({ ...icmState, payouts: payouts.map((p, idx) => idx === i ? v : p) });
  }
  function addPlayer() {
    if (stacks.length < 9) setICMState({ ...icmState, stacks: [...stacks, 10] });
  }
  function removePlayer() {
    if (stacks.length > 2) setICMState({ ...icmState, stacks: stacks.slice(0, -1) });
  }
  function addPayout() {
    if (payouts.length < 9) setICMState({ ...icmState, payouts: [...payouts, 0] });
  }
  function removePayout() {
    if (payouts.length > 1) setICMState({ ...icmState, payouts: payouts.slice(0, -1) });
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
      <div style={{
        background: "rgba(10,24,22,0.6)",
        border: "1px solid rgba(232,227,211,0.1)",
        borderRadius: 12, padding: 20,
      }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: "0 0 16px 0" }}>
          Player Stacks (chips)
        </h3>
        {stacks.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 80, fontSize: 12, opacity: 0.7 }}>
              Player {i + 1}{i === 0 ? " (Hero)" : ""}
            </div>
            <input type="number" value={s} onChange={e => updateStack(i, e.target.value)} style={inputStyle}/>
            <div style={{ minWidth: 70, fontSize: 11, opacity: 0.6, textAlign: "right" }}>
              ${equities[i]?.toFixed(2) || "0.00"}
            </div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={addPlayer} style={smallBtn}>+ Player</button>
          <button onClick={removePlayer} style={smallBtn}>− Player</button>
        </div>
      </div>

      <div style={{
        background: "rgba(10,24,22,0.6)",
        border: "1px solid rgba(232,227,211,0.1)",
        borderRadius: 12, padding: 20,
      }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: "0 0 16px 0" }}>
          Payout Structure ($)
        </h3>
        {payouts.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 80, fontSize: 12, opacity: 0.7 }}>{ordinal(i + 1)}</div>
            <input type="number" value={p} onChange={e => updatePayout(i, e.target.value)} style={inputStyle}/>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={addPayout} style={smallBtn}>+ Place</button>
          <button onClick={removePayout} style={smallBtn}>− Place</button>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
          Total prize pool: ${totalPayout.toFixed(2)}
        </div>
      </div>

      <div style={{
        gridColumn: "1 / -1",
        background: "rgba(212,161,59,0.08)",
        border: "1px solid rgba(212,161,59,0.3)",
        borderRadius: 12, padding: 20,
      }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: "0 0 12px 0" }}>
          Computed ICM Multipliers
        </h3>
        <p style={{ fontSize: 13, opacity: 0.85, margin: "0 0 12px 0" }}>
          Based on your stacks and payouts, the following multipliers will be applied to Nash thresholds when ICM mode is set to <strong>Custom</strong> in the trainer:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          <Stat label="Push multiplier" value={`${(computedMults.push * 100).toFixed(0)}%`}/>
          <Stat label="Call multiplier" value={`${(computedMults.call * 100).toFixed(0)}%`} highlight/>
          <Stat label="Reshove multiplier" value={`${(computedMults.reshove * 100).toFixed(0)}%`}/>
        </div>
        <p style={{ fontSize: 11, opacity: 0.6, marginTop: 12, fontStyle: "italic" }}>
          Multipliers derived from hero's ICM equity vs an equal-stack baseline. Lower = tighter ranges.
        </p>
      </div>
    </div>
  );
}
