import { RANKS } from "../lib/handUtils.js";
import { getMaxPushBB, getMaxCallBB, getMaxReshoveBB } from "../lib/decisionLogic.js";
import { getRfiFrequency } from "../data/rfiRanges.js";
import { getDefenseFrequency } from "../data/threeBetDefenseRanges.js";

const COLOR_LEGEND = [
  { c: "#2a2a2a", l: "Never" },
  { c: "#5a3530", l: "≤5bb" },
  { c: "#8a4a35", l: "≤10bb" },
  { c: "#a87330", l: "≤15bb" },
  { c: "#9a9230", l: "≤25bb" },
  { c: "#5a8a40", l: "≤50bb" },
  { c: "#3a8a55", l: "Always" },
];

function colorFor(max) {
  if (max <= 0) return "#2a2a2a";
  if (max <= 5) return "#5a3530";
  if (max <= 10) return "#8a4a35";
  if (max <= 15) return "#a87330";
  if (max <= 25) return "#9a9230";
  if (max <= 50) return "#5a8a40";
  return "#3a8a55";
}

/**
 * Standard 13×13 hand grid. Pairs on the diagonal, suited above, offsuit
 * below. Each cell is colored by the max bb threshold at which the action
 * is +EV given the current mode/position/stage.
 *
 * Optional props:
 *   - highlightHand: a hand code (e.g. "AKs") to highlight with a thick gold border
 *   - shoverPos: when in call mode, the actual shover position to use (defaults to BTN)
 *   - raiserPos: when in reshove mode, the raiser position (defaults to CO)
 */
export default function RangeViewer({ mode, position, stage, customMult, highlightHand, shoverPos, raiserPos, threeBettorPos }) {
  function getMaxFor(hand) {
    if (mode === "push") return getMaxPushBB(position, hand, stage, customMult);
    if (mode === "call") {
      const shover = shoverPos || "BTN";
      return getMaxCallBB(position, shover, hand, stage, customMult);
    }
    if (mode === "reshove") {
      const raiser = raiserPos || "CO";
      return getMaxReshoveBB(position, raiser, hand, stage, customMult);
    }
    if (mode === "openRaise") {
      const f = getRfiFrequency(position, hand);
      return (f.raise + f.shove) * 99;
    }
    if (mode === "threeBetDef") {
      // Color by "% of time we don't fold" — both call and 4-bet are defense
      const f = getDefenseFrequency(position, threeBettorPos || "BB", hand);
      return ((f.call || 0) + (f.fourBet || 0)) * 99;
    }
    return 0;
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(13, 1fr)", gap: 2 }}>
        {RANKS.map((r1, i) => RANKS.map((r2, j) => {
          let hand;
          if (i === j) hand = r1 + r2;
          else if (i < j) hand = r1 + r2 + "s";
          else hand = r2 + r1 + "o";
          const max = getMaxFor(hand);
          const isPair = i === j;
          const isHighlighted = hand === highlightHand;
          return (
            <div key={`${i}-${j}`}
              style={{
                background: colorFor(max),
                aspectRatio: "1",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700,
                color: isHighlighted ? "#fafaf7" : "#fafaf7",
                fontFamily: "'Inter', sans-serif",
                borderRadius: 2,
                border: isHighlighted
                  ? "2px solid #ffd96a"
                  : isPair ? "1px solid rgba(212,161,59,0.4)" : "none",
                boxShadow: isHighlighted ? "0 0 0 2px rgba(255,217,106,0.4), 0 0 10px rgba(255,217,106,0.5)" : "none",
                position: "relative",
                zIndex: isHighlighted ? 1 : 0,
              }}
              title={`${hand}: ${max > 0 ? max.toFixed(1) + "bb" : "not in range"}`}
            >
              {hand}
              {max > 0 && max < 99 && (
                <div style={{
                  position: "absolute", bottom: 1, right: 2,
                  fontSize: 7, opacity: 0.7, fontWeight: 400,
                }}>
                  {max.toFixed(0)}
                </div>
              )}
            </div>
          );
        }))}
      </div>

      <div style={{
        marginTop: 16, padding: 12,
        background: "rgba(10,24,22,0.6)", borderRadius: 6,
        display: "flex", gap: 12, fontSize: 10, justifyContent: "center", flexWrap: "wrap",
      }}>
        {COLOR_LEGEND.map(item => (
          <div key={item.l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 12, height: 12, background: item.c, borderRadius: 2 }}/>
            <span style={{ opacity: 0.8 }}>{item.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
