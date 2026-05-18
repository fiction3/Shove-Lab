import { ICM_STAGES } from "../data/icmStages.js";

const panelStyle = {
  background: "rgba(10,24,22,0.6)",
  border: "1px solid rgba(232,227,211,0.1)",
  borderRadius: 12, padding: 20,
};

const smallBtn = {
  background: "transparent",
  color: "#d4a13b",
  border: "1px solid rgba(212,161,59,0.4)",
  borderRadius: 4, padding: "5px 10px",
  cursor: "pointer", fontSize: 11,
  letterSpacing: "0.1em", textTransform: "uppercase",
};

function SectionTitle({ children }) {
  return (
    <h3 style={{
      fontFamily: "'Cormorant Garamond', serif", fontSize: 20, margin: "0 0 14px 0",
      color: "#d4a13b",
    }}>{children}</h3>
  );
}

function ProgressRow({ label, value, total }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ opacity: 0.8 }}>{label}</span>
        <span style={{ opacity: 0.7 }}>{value}/{total} · {Math.round(pct)}%</span>
      </div>
      <div style={{ height: 6, background: "rgba(0,0,0,0.3)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: pct >= 70 ? "#7fc69a" : pct >= 50 ? "#d4a13b" : "#e07a5f",
          transition: "width 0.3s",
        }}/>
      </div>
    </div>
  );
}

function BarStat({ label, value, total, color }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
        <span style={{ opacity: 0.8 }}>{label}</span>
        <span style={{ opacity: 0.7 }}>{value}</span>
      </div>
      <div style={{ height: 4, background: "rgba(0,0,0,0.3)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color }}/>
      </div>
    </div>
  );
}

/**
 * Post-session breakdown: overall accuracy, mistake types (over-shove vs
 * over-fold — these are different leaks), per-mode/position/stage accuracy,
 * and top-three weakest positions.
 */
export default function SessionReview({ history, onClear }) {
  if (history.length === 0) {
    return (
      <div style={{ ...panelStyle, padding: 40, textAlign: "center" }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: 0 }}>
          No hands played yet
        </h3>
        <p style={{ opacity: 0.6, marginTop: 12 }}>
          Play some hands in the trainer to see your breakdown here.
        </p>
      </div>
    );
  }

  const total = history.length;
  const correct = history.filter(h => h.correct).length;
  const accuracy = Math.round((correct / total) * 100);

  const byMode = {};
  const byPosition = {};
  const byStage = {};
  for (const h of history) {
    (byMode[h.mode] ??= { total: 0, correct: 0 }).total++;
    if (h.correct) byMode[h.mode].correct++;
    (byPosition[h.position] ??= { total: 0, correct: 0 }).total++;
    if (h.correct) byPosition[h.position].correct++;
    (byStage[h.stage] ??= { total: 0, correct: 0 }).total++;
    if (h.correct) byStage[h.stage].correct++;
  }

  const mistakes = history.filter(h => !h.correct);
  const overShoves = mistakes.filter(h => h.chosen !== "fold" && h.optimal === "fold").length;
  const overFolds = mistakes.filter(h => h.chosen === "fold" && h.optimal !== "fold").length;

  const leakSpots = Object.entries(byPosition)
    .filter(([, v]) => v.total >= 3)
    .map(([k, v]) => ({ position: k, acc: v.correct / v.total, total: v.total }))
    .sort((a, b) => a.acc - b.acc)
    .slice(0, 3);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={panelStyle}>
        <SectionTitle>Overall</SectionTitle>
        <div style={{ display: "flex", gap: 20, alignItems: "baseline" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, color: "#d4a13b", lineHeight: 1 }}>
              {accuracy}%
            </div>
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
              {correct} / {total} hands correct
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <BarStat label="Over-shoved" value={overShoves} total={mistakes.length} color="#c8102e"/>
            <BarStat label="Over-folded" value={overFolds} total={mistakes.length} color="#5a8a40"/>
          </div>
        </div>
        <button onClick={onClear} style={{ ...smallBtn, marginTop: 16 }}>Clear session</button>
      </div>

      <div style={panelStyle}>
        <SectionTitle>By Mode</SectionTitle>
        {Object.entries(byMode).map(([k, v]) => (
          <ProgressRow key={k} label={k.toUpperCase()} value={v.correct} total={v.total}/>
        ))}
      </div>

      <div style={panelStyle}>
        <SectionTitle>By Position</SectionTitle>
        {Object.entries(byPosition).sort((a, b) => b[1].total - a[1].total).map(([k, v]) => (
          <ProgressRow key={k} label={k} value={v.correct} total={v.total}/>
        ))}
      </div>

      <div style={panelStyle}>
        <SectionTitle>By Stage</SectionTitle>
        {Object.entries(byStage).map(([k, v]) => (
          <ProgressRow key={k} label={ICM_STAGES[k]?.label || k} value={v.correct} total={v.total}/>
        ))}
      </div>

      {leakSpots.length > 0 && (
        <div style={{ ...panelStyle, gridColumn: "1 / -1" }}>
          <SectionTitle>Top Leaks</SectionTitle>
          <p style={{ fontSize: 12, opacity: 0.7, margin: "0 0 12px 0" }}>
            Positions where you're least accurate (minimum 3 hands).
          </p>
          {leakSpots.map(spot => (
            <div key={spot.position} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 14px", marginBottom: 8,
              background: "rgba(200,16,46,0.08)", borderLeft: "2px solid #c8102e", borderRadius: 4,
            }}>
              <div>
                <strong style={{ color: "#e07a5f" }}>{spot.position}</strong>
                <span style={{ opacity: 0.7, marginLeft: 8, fontSize: 12 }}>
                  {spot.total} hand{spot.total === 1 ? "" : "s"}
                </span>
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#e07a5f",
              }}>
                {Math.round(spot.acc * 100)}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
