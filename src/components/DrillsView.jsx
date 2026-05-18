import { useState, useEffect, useMemo } from "react";
import PotOddsDrill from "./drills/PotOddsDrill.jsx";
import RequiredEquityDrill from "./drills/RequiredEquityDrill.jsx";
import HandVsHandDrill from "./drills/HandVsHandDrill.jsx";
import OutsDrill from "./drills/OutsDrill.jsx";
import FoldEquityDrill from "./drills/FoldEquityDrill.jsx";
import HandRankingDrill from "./drills/HandRankingDrill.jsx";

const DRILL_DEFS = [
  { id: "pot-odds",        label: "Pot Odds",          description: "Given pot + bet, find required equity %", component: PotOddsDrill },
  { id: "required-equity", label: "Required Equity",   description: "Multiple-choice version of pot odds", component: RequiredEquityDrill },
  { id: "hand-vs-hand",    label: "Hand vs Hand",      description: "Common preflop matchups", component: HandVsHandDrill },
  { id: "outs",            label: "Outs & Equity",     description: "Count outs, apply rule of 4 and 2", component: OutsDrill },
  { id: "fold-equity",     label: "Fold Equity",       description: "Breakeven equity-when-called given fold freq", component: FoldEquityDrill },
  { id: "hand-rankings",   label: "Hand Rankings",     description: "Which hand is stronger preflop?", component: HandRankingDrill },
];

/**
 * Drills view: a row of drill-type chips at the top, the active drill below,
 * and per-drill stats (accuracy + avg time) on the right.
 *
 * If `initialDrill` is provided (e.g. from a Learn lesson's "start drill"
 * deep link), that drill is selected on mount.
 */
export default function DrillsView({ initialDrill, history, addHistory }) {
  const [activeId, setActiveId] = useState(initialDrill || DRILL_DEFS[0].id);

  // If parent passes a new initialDrill (deep link), switch to it
  useEffect(() => {
    if (initialDrill) setActiveId(initialDrill);
  }, [initialDrill]);

  const active = DRILL_DEFS.find(d => d.id === activeId);
  const ActiveDrill = active.component;

  function handleAnswer(result) {
    addHistory({ ...result, ts: Date.now() });
  }

  // Per-drill stats
  const stats = useMemo(() => {
    const map = {};
    for (const d of DRILL_DEFS) map[d.id] = { total: 0, exact: 0, close: 0, timeSum: 0 };
    for (const h of history) {
      if (!map[h.drill]) continue;
      map[h.drill].total++;
      if (h.grade === "exact") map[h.drill].exact++;
      else if (h.grade === "close") map[h.drill].close++;
      map[h.drill].timeSum += h.timeMs || 0;
    }
    return map;
  }, [history]);

  const overallTotal = history.length;
  const overallExact = history.filter(h => h.grade === "exact").length;
  const overallAcc = overallTotal > 0 ? Math.round((overallExact / overallTotal) * 100) : null;

  return (
    <div>
      {/* Drill picker */}
      <div style={{
        background: "rgba(10,24,22,0.6)",
        border: "1px solid rgba(232,227,211,0.1)",
        borderRadius: 12, padding: 16, marginBottom: 20,
      }}>
        <div style={{
          fontSize: 10, letterSpacing: "0.25em",
          textTransform: "uppercase", opacity: 0.5,
          marginBottom: 12, paddingLeft: 4,
        }}>
          Drill type
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 8,
        }}>
          {DRILL_DEFS.map(d => {
            const s = stats[d.id];
            const isActive = d.id === activeId;
            const acc = s.total > 0 ? Math.round((s.exact / s.total) * 100) : null;
            return (
              <button key={d.id} onClick={() => setActiveId(d.id)}
                style={{
                  background: isActive ? "rgba(212,161,59,0.15)" : "transparent",
                  color: isActive ? "#d4a13b" : "#e8e3d3",
                  border: "1px solid " + (isActive ? "#d4a13b" : "rgba(232,227,211,0.15)"),
                  borderRadius: 6, padding: "12px 14px",
                  cursor: "pointer", fontFamily: "inherit",
                  textAlign: "left",
                }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                  {d.label}
                </div>
                <div style={{ fontSize: 10, opacity: 0.6, lineHeight: 1.3 }}>
                  {acc !== null
                    ? `${s.total} hands · ${acc}%`
                    : "no data yet"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-column: active drill on left, stats on right */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 280px",
        gap: 20, alignItems: "start",
      }}>
        <div>
          <ActiveDrill onAnswer={handleAnswer} key={activeId + "-" + history.length}/>
        </div>

        <aside style={{
          background: "rgba(10,24,22,0.6)",
          border: "1px solid rgba(232,227,211,0.1)",
          borderRadius: 12, padding: 20,
        }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.25em",
            textTransform: "uppercase", opacity: 0.5, marginBottom: 16,
          }}>
            Session
          </div>

          {overallAcc !== null ? (
            <>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 44, color: "#d4a13b", lineHeight: 1,
              }}>
                {overallAcc}%
              </div>
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
                {overallExact} / {overallTotal} exact
              </div>

              <div style={{
                marginTop: 22, paddingTop: 18,
                borderTop: "1px solid rgba(232,227,211,0.1)",
              }}>
                <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.5, marginBottom: 10 }}>
                  Per drill
                </div>
                {DRILL_DEFS.map(d => {
                  const s = stats[d.id];
                  if (s.total === 0) return null;
                  const acc = Math.round((s.exact / s.total) * 100);
                  const avgTime = Math.round(s.timeSum / s.total / 1000);
                  return (
                    <div key={d.id} style={{
                      display: "flex", justifyContent: "space-between",
                      fontSize: 12, marginBottom: 6,
                    }}>
                      <span style={{ opacity: 0.8 }}>{d.label}</span>
                      <span style={{ opacity: 0.7 }}>
                        {acc}% · {avgTime}s
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 12, opacity: 0.6, lineHeight: 1.5 }}>
              No drills completed yet. Answer the question on the left to get started.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export { DRILL_DEFS };
