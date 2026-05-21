import { useState, useEffect, useRef } from "react";
import { RANKS } from "../lib/handUtils.js";
import { getMaxPushBB, getMaxCallBB, getMaxReshoveBB } from "../lib/decisionLogic.js";
import { getRfiFrequency } from "../data/rfiRanges.js";
import { getDefenseFrequency } from "../data/threeBetDefenseRanges.js";
import useMediaQuery from "../lib/useMediaQuery.js";

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
  const isMobile = useMediaQuery(768);

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
    const target = e.currentTarget;
    if (!target || !target.getBoundingClientRect) return;
    const rect = target.getBoundingClientRect();
    setHovered({
      hand,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8,
    });
  }
  function hideTooltip() {
    setHovered(null);
  }

  // Desktop hover is handled at the grid level (see onMouseMove on the grid
  // container below) for reliability across a dense 13×13 grid. Touch is
  // handled per-cell via onTouchStart. We guard with a touch flag so a tap
  // doesn't also trigger synthetic mouse events on mobile browsers.
  const touchActive = useRef(false);

  function handleTouchStart(e, hand) {
    touchActive.current = true;
    if (hovered?.hand === hand) hideTooltip();
    else showTooltip({ currentTarget: e.currentTarget }, hand);
  }
  function handleClick(e, hand) {
    if (touchActive.current) { touchActive.current = false; return; }
    e.stopPropagation();
    if (hovered?.hand === hand) hideTooltip();
    else showTooltip(e, hand);
  }

  // Desktop: dismiss tooltip when clicking anywhere outside the grid.
  // Mobile: the panel has an explicit × close button, and tapping another
  // cell switches — so we don't auto-dismiss on every tap (which would fight
  // the tap-to-open).
  useEffect(() => {
    if (!hovered || isMobile) return;
    function onDocClick() { setHovered(null); }
    const id = setTimeout(() => document.addEventListener("click", onDocClick), 0);
    return () => { clearTimeout(id); document.removeEventListener("click", onDocClick); };
  }, [hovered, isMobile]);

  return (
    <div>
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(13, 1fr)", gap: 2 }}
        onMouseMove={isMobile ? undefined : e => {
          if (touchActive.current) return;
          const cell = e.target.closest?.("[data-hand]");
          if (!cell) return;
          const hand = cell.getAttribute("data-hand");
          // Only update if we moved to a different cell (avoids needless re-renders)
          if (hovered?.hand !== hand) {
            const rect = cell.getBoundingClientRect();
            setHovered({ hand, x: rect.left + rect.width / 2, y: rect.bottom + 8 });
          }
        }}
        onMouseLeave={isMobile ? undefined : () => { if (!touchActive.current) hideTooltip(); }}
      >
        {RANKS.map((r1, i) => RANKS.map((r2, j) => {
          let hand;
          if (i === j) hand = r1 + r2;
          else if (i < j) hand = r1 + r2 + "s";
          else hand = r2 + r1 + "o";
          const max = getMaxFor(hand);
          const isPair = i === j;
          const isHighlighted = hand === highlightHand;
          const isActive = hovered?.hand === hand;
          // Border priority: highlighted (trainer's current hand, gold) wins,
          // then active (currently shown in tooltip/panel, white), then pair.
          const border = isHighlighted ? "2px solid #ffd96a"
            : isActive ? "2px solid #fafaf7"
            : isPair ? "1px solid rgba(212,161,59,0.4)" : "none";
          const boxShadow = isHighlighted
            ? "0 0 0 2px rgba(255,217,106,0.4), 0 0 10px rgba(255,217,106,0.5)"
            : isActive ? "0 0 0 2px rgba(250,250,247,0.35)"
            : "none";
          return (
            <div key={`${i}-${j}`}
              data-hand={hand}
              onTouchStart={e => handleTouchStart(e, hand)}
              onClick={e => handleClick(e, hand)}
              style={{
                background: colorFor(max),
                aspectRatio: "1",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: isMobile ? 10 : 13, fontWeight: 700,
                color: isHighlighted ? "#fafaf7" : "#fafaf7",
                fontFamily: "'Inter', sans-serif",
                borderRadius: 2,
                border,
                boxShadow,
                position: "relative",
                zIndex: (isHighlighted || isActive) ? 1 : 0,
                cursor: "pointer",
              }}
            >
              {hand}
              {max > 0 && max < 99 && (
                <div style={{
                  position: "absolute", bottom: 1, right: 2,
                  fontSize: isMobile ? 7 : 11, opacity: 0.8, fontWeight: 600,
                  pointerEvents: "none",
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

      <div style={{
        marginTop: 12, padding: "12px 14px",
        background: "rgba(10,24,22,0.5)",
        borderLeft: "2px solid rgba(212,161,59,0.35)",
        borderRadius: 4,
        display: "flex", gap: 16,
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "center" : "flex-start",
      }}>
        <div style={{ flexShrink: 0 }}>
          <GridSchematic/>
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.55, opacity: 0.85 }}>
        {(mode === "openRaise" || mode === "threeBetDef") ? (
          <>
            <strong style={{ color: "#d4a13b" }}>How to read this grid.</strong>{" "}
            Each square is one starting hand. <strong>Suited</strong> hands sit in the upper-right triangle
            (marked with an <em>s</em>, e.g. AKs), <strong>offsuit</strong> hands in the lower-left
            (marked with an <em>o</em>), and <strong>pocket pairs</strong> run down the diagonal.{" "}
            The <strong>color</strong> shows how often the hand is played rather than folded — greener
            means played more often, darker means folded more often.{" "}
            The small <strong>number</strong> in each square is that play frequency as a percentage
            (e.g. <strong>70</strong> means the hand is raised/4-bet about 70% of the time and folded the rest).
            Hover or tap a square for the full action breakdown.
          </>
        ) : (
          <>
            <strong style={{ color: "#d4a13b" }}>How to read this grid.</strong>{" "}
            Each square is one starting hand. <strong>Suited</strong> hands sit in the upper-right triangle
            (marked with an <em>s</em>, e.g. AKs), <strong>offsuit</strong> hands in the lower-left
            (marked with an <em>o</em>), and <strong>pocket pairs</strong> run down the diagonal.{" "}
            The small <strong>number</strong> in each square is the <strong>biggest stack (in big blinds)</strong>
            {" "}at which {mode === "call" ? "calling" : mode === "reshove" ? "re-shoving" : "shoving"} this hand
            is still profitable. So <strong>12</strong> means: {mode === "call" ? "call" : mode === "reshove" ? "re-shove" : "shove"}{" "}
            this hand whenever the effective stack is <strong>12bb or less</strong>, and fold it when you have more than that.
            A blank square means the hand is never {mode === "call" ? "called" : mode === "reshove" ? "re-shoved" : "shoved"} at any depth.
            The <strong>color</strong> is just a visual scale of that number — greener = playable deeper, darker = only when very short.
            Hover or tap a square for details.
          </>
        )}
        </div>
      </div>

      {hovered && <AdviceTooltip hand={hovered.hand} x={hovered.x} y={hovered.y} advice={getAdvice(hovered.hand)} isMobile={isMobile} onClose={() => setHovered(null)}/>}
    </div>
  );
}

/**
 * A small schematic of the 13×13 hand grid, color-coding the three regions:
 * suited (upper-right triangle), offsuit (lower-left), pocket pairs (diagonal).
 * Used in the "how to read this grid" explanation.
 */
function GridSchematic() {
  const N = 13;
  const cell = 9;     // px per cell
  const gap = 1;
  const size = N * (cell + gap);
  const squares = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      let fill;
      if (i === j) fill = "#d4a13b";              // pairs (diagonal) — gold
      else if (i < j) fill = "#3a7d4c";           // suited (upper-right) — green
      else fill = "#6b5a8a";                       // offsuit (lower-left) — purple-grey
      squares.push(
        <rect key={`${i}-${j}`}
          x={j * (cell + gap)} y={i * (cell + gap)}
          width={cell} height={cell} rx={1}
          fill={fill} opacity={0.85}/>
      );
    }
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      <svg width={size} height={size} style={{ display: "block" }}>
        {squares}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 10 }}>
        <LegendDot color="#3a7d4c" label="Suited (s)"/>
        <LegendDot color="#6b5a8a" label="Offsuit (o)"/>
        <LegendDot color="#d4a13b" label="Pairs"/>
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 9, height: 9, background: color, borderRadius: 2, opacity: 0.85 }}/>
      <span style={{ opacity: 0.8 }}>{label}</span>
    </div>
  );
}

/**
 * On desktop: a floating tooltip anchored under the hovered cell.
 * On mobile: a fixed panel pinned to the bottom of the screen (a "static
 * window") — consistent location, easy to read, with a close button, since
 * hover doesn't exist on touch.
 */
function AdviceTooltip({ hand, x, y, advice, isMobile, onClose }) {
  const content = (
    <>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 8,
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: isMobile ? 20 : 16, fontWeight: 700,
          letterSpacing: "0.02em",
          color: "#d4a13b",
          lineHeight: 1,
        }}>
          {hand}
        </div>
        {isMobile && (
          <button onClick={onClose} style={{
            background: "transparent", border: "none",
            color: "rgba(232,227,211,0.6)", fontSize: 20,
            cursor: "pointer", lineHeight: 1, padding: "0 4px",
          }}>
            ×
          </button>
        )}
      </div>

      {advice.kind === "frequency" && (
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 6 : 3 }}>
          {advice.rows.map(r => (
            <div key={r.action} style={{
              display: "flex", justifyContent: "space-between",
              gap: 16, fontSize: isMobile ? 14 : 12,
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
            fontSize: isMobile ? 15 : 13, fontWeight: 700,
            color: advice.color, marginBottom: 2,
          }}>
            {advice.summary}
          </div>
          <div style={{ fontSize: isMobile ? 12 : 11, opacity: 0.7, lineHeight: 1.4 }}>
            {advice.detail}
          </div>
        </>
      )}
    </>
  );

  // ── Mobile: fixed bottom panel ──
  if (isMobile) {
    return (
      <div style={{
        position: "fixed",
        left: 0, right: 0, bottom: 0,
        background: "rgba(8,22,18,0.99)",
        borderTop: "1px solid rgba(212,161,59,0.4)",
        padding: "16px 20px calc(16px + env(safe-area-inset-bottom))",
        boxShadow: "0 -8px 24px rgba(0,0,0,0.5)",
        zIndex: 2000,
        fontFamily: "inherit",
      }}>
        {content}
      </div>
    );
  }

  // ── Desktop: floating tooltip anchored under the cell ──
  const estHeight = advice.kind === "frequency" ? 90 : 60;
  const estWidth = 170;
  const margin = 8;
  const flipUp = y + estHeight + 20 > window.innerHeight;
  const topPos = flipUp ? y - estHeight - 24 : y;
  const half = estWidth / 2;
  const maxLeft = window.innerWidth - estWidth - margin;
  let leftPos = x - half;
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
      {content}
    </div>
  );
}
