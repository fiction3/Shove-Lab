import { useState, useEffect, useRef } from "react";
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
  const [hovered, setHovered] = useState(null); // { hand, x, y }

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

  /**
   * Build advice for the tooltip. Returns an array of { action, pct, color }
   * entries (frequency modes) or a single { summary } entry (threshold modes).
   * The renderer below switches on shape.
   */
  function getAdvice(hand) {
    if (mode === "openRaise") {
      const f = getRfiFrequency(position, hand);
      return {
        kind: "frequency",
        rows: [
          { action: "Raise", pct: f.raise, color: "#7fc69a" },
          { action: "Shove", pct: f.shove, color: "#e07a5f" },
          { action: "Fold",  pct: f.fold,  color: "rgba(232,227,211,0.5)" },
        ].filter(r => r.pct > 0),
      };
    }
    if (mode === "threeBetDef") {
      const villain = threeBettorPos || "BB";
      const f = getDefenseFrequency(position, villain, hand);
      return {
        kind: "frequency",
        rows: [
          { action: "4-Bet", pct: f.fourBet, color: "#e07a5f" },
          { action: "Call",  pct: f.call,    color: "#7fc69a" },
          { action: "Fold",  pct: f.fold,    color: "rgba(232,227,211,0.5)" },
        ].filter(r => r.pct > 0),
      };
    }
    // Threshold modes (push / call / reshove)
    const max = getMaxFor(hand);
    let actionWord, color;
    if (mode === "push") { actionWord = "Shove"; color = "#e07a5f"; }
    else if (mode === "call") { actionWord = "Call"; color = "#7fc69a"; }
    else { actionWord = "Reshove"; color = "#e07a5f"; }

    if (max <= 0) {
      return { kind: "threshold", summary: "Fold", color: "rgba(232,227,211,0.5)", detail: "Not in range at any stack." };
    }
    if (max >= 99) {
      return { kind: "threshold", summary: `${actionWord} always`, color, detail: "Always in range." };
    }
    return {
      kind: "threshold",
      summary: `${actionWord} up to ${max.toFixed(1)}bb`,
      color,
      detail: `${actionWord} when effective stack ≤ ${max.toFixed(1)}bb. Fold above.`,
    };
  }

  function showTooltip(e, hand) {
    const rect = e.currentTarget.getBoundingClientRect();
    setHovered({
      hand,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8,
    });
  }
  function hideTooltip() {
    setHovered(null);
  }

  // Mouse hover (desktop only). On touch devices, browsers simulate a brief
  // mouseenter on tap which we don't want — so we ignore the simulated event
  // by checking the pointerType in the preceding onPointerEnter.
  const lastPointerWasTouch = useRef(false);
  function handlePointerEnter(e, hand) {
    lastPointerWasTouch.current = e.pointerType === "touch" || e.pointerType === "pen";
    if (lastPointerWasTouch.current) return; // touch is handled by onClick
    showTooltip(e, hand);
  }
  function handleMouseLeave() {
    if (lastPointerWasTouch.current) return; // touch shouldn't dismiss on "leave"
    hideTooltip();
  }
  function handleCellClick(e, hand) {
    // Tap / click: toggle the tooltip for this cell.
    e.stopPropagation();
    if (hovered?.hand === hand) hideTooltip();
    else showTooltip(e, hand);
  }

  // Dismiss tooltip when user taps anywhere outside the grid (touch flow)
  useEffect(() => {
    if (!hovered) return;
    function onDocClick() { setHovered(null); }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [hovered]);

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
              onPointerEnter={e => handlePointerEnter(e, hand)}
              onMouseLeave={handleMouseLeave}
              onClick={e => handleCellClick(e, hand)}
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
                cursor: "pointer",
              }}
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

      {hovered && <AdviceTooltip hand={hovered.hand} x={hovered.x} y={hovered.y} advice={getAdvice(hovered.hand)}/>}
    </div>
  );
}

/**
 * Floating tooltip rendered with position: fixed so it can escape the grid.
 * Centers under the hovered cell. If the cell is near the bottom of the
 * screen, the tooltip flips above.
 */
function AdviceTooltip({ hand, x, y, advice }) {
  // Estimated dimensions (we don't measure the DOM here to keep this cheap)
  const estHeight = advice.kind === "frequency" ? 90 : 60;
  const estWidth = 170;  // tooltip natural width with padding
  const margin = 8;       // minimum gap from viewport edge

  // Vertical: flip above the cell if it would clip off the bottom
  const flipUp = y + estHeight + 20 > window.innerHeight;
  const topPos = flipUp ? y - estHeight - 24 : y;

  // Horizontal: try to center on x, but clamp so it never overflows either edge
  const half = estWidth / 2;
  const maxLeft = window.innerWidth - estWidth - margin;
  let leftPos = x - half; // natural centered position
  if (leftPos < margin) leftPos = margin;
  if (leftPos > maxLeft) leftPos = maxLeft;

  return (
    <div style={{
      position: "fixed",
      left: leftPos,
      top: topPos,
      background: "rgba(8,22,18,0.98)",
      border: "1px solid rgba(212,161,59,0.4)",
      borderRadius: 6,
      padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      zIndex: 2000,
      pointerEvents: "none",
      minWidth: 140,
      maxWidth: estWidth,
      fontFamily: "inherit",
    }}>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 16, fontWeight: 700,
        letterSpacing: "0.02em",
        color: "#d4a13b",
        marginBottom: 6,
        lineHeight: 1,
      }}>
        {hand}
      </div>

      {advice.kind === "frequency" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {advice.rows.map(r => (
            <div key={r.action} style={{
              display: "flex", justifyContent: "space-between",
              gap: 16, fontSize: 12,
            }}>
              <span style={{ color: r.color, fontWeight: 600 }}>{r.action}</span>
              <span style={{ color: "rgba(232,227,211,0.85)", fontWeight: 500 }}>
                {Math.round(r.pct * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {advice.kind === "threshold" && (
        <>
          <div style={{
            fontSize: 13, fontWeight: 700,
            color: advice.color, marginBottom: 2,
          }}>
            {advice.summary}
          </div>
          <div style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.4 }}>
            {advice.detail}
          </div>
        </>
      )}
    </div>
  );
}
