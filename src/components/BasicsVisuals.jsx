import TritonCard from "./TritonCard.jsx";

/**
 * Visuals for the Basics lessons. Each is a small React component named the
 * same as the `name` field used in lesson data (type: "visual", name: "...").
 *
 * Design rules:
 * - Use the app's color palette: greens (#15302a, #0a1816), gold #d4a13b, etc.
 * - Use the existing TritonCard component for any actual playing cards so
 *   visuals match the rest of the app perfectly.
 * - Stay responsive: SVG with viewBox, width 100%, height auto.
 * - Keep file size small: prefer geometric shapes over decorative detail.
 */

// Shared style for caption text under visuals
const captionStyle = {
  fontSize: 11, opacity: 0.55, textAlign: "center",
  marginTop: 10, fontStyle: "italic",
};

// Shared wrapper for inline visual blocks
function Frame({ children, caption, maxWidth = 520 }) {
  return (
    <div style={{
      margin: "20px auto",
      maxWidth,
      background: "rgba(8,22,18,0.6)",
      border: "1px solid rgba(232,227,211,0.08)",
      borderRadius: 10,
      padding: 20,
    }}>
      {children}
      {caption && <div style={captionStyle}>{caption}</div>}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// HoleCardsAndBoard: hero image for "What is Hold'em"
// Shows two hole cards labeled "yours" + five community cards labeled "shared"
// ───────────────────────────────────────────────────────────────
export function HoleCardsAndBoard() {
  return (
    <Frame caption="The two cards on the left are only visible to you. The five in the middle are shared with all players.">
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
            opacity: 0.55, marginBottom: 8, color: "#d4a13b",
          }}>Your hand</div>
          <div style={{ display: "flex", gap: 2 }}>
            <TritonCard card={{ rank: "A", suit: "s" }} size={54}/>
            <TritonCard card={{ rank: "K", suit: "s" }} size={54}/>
          </div>
        </div>
        <div style={{ fontSize: 18, opacity: 0.4 }}>+</div>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
            opacity: 0.55, marginBottom: 8,
          }}>Shared board</div>
          <div style={{ display: "flex", gap: 2 }}>
            <TritonCard card={{ rank: "Q", suit: "s" }} size={44}/>
            <TritonCard card={{ rank: "J", suit: "s" }} size={44}/>
            <TritonCard card={{ rank: "T", suit: "s" }} size={44}/>
            <TritonCard card={{ rank: "7", suit: "d" }} size={44}/>
            <TritonCard card={{ rank: "2", suit: "c" }} size={44}/>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 14, color: "#7fc69a", fontSize: 12, fontWeight: 600 }}>
        You make the best five-card hand from these seven cards. In this example: a Royal Flush!
      </div>
    </Frame>
  );
}

// ───────────────────────────────────────────────────────────────
// DealSequence: shows preflop → flop → turn → river progression
// ───────────────────────────────────────────────────────────────
export function DealSequence() {
  const stages = [
    { label: "Preflop", cards: [], note: "0 cards on board" },
    { label: "Flop", cards: [{rank:"K",suit:"h"},{rank:"7",suit:"c"},{rank:"2",suit:"s"}], note: "3 cards revealed" },
    { label: "Turn", cards: [{rank:"K",suit:"h"},{rank:"7",suit:"c"},{rank:"2",suit:"s"},{rank:"5",suit:"d"}], note: "1 more card" },
    { label: "River", cards: [{rank:"K",suit:"h"},{rank:"7",suit:"c"},{rank:"2",suit:"s"},{rank:"5",suit:"d"},{rank:"J",suit:"s"}], note: "Final card" },
  ];
  return (
    <Frame caption="The four stages of every hand. Betting happens between each stage.">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {stages.map((s, i) => (
          <div key={s.label} style={{
            display: "flex", alignItems: "center", gap: 14,
            paddingBottom: i < stages.length - 1 ? 14 : 0,
            borderBottom: i < stages.length - 1 ? "1px dashed rgba(232,227,211,0.1)" : "none",
          }}>
            <div style={{
              minWidth: 70,
              fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
              fontWeight: 700, color: "#d4a13b",
            }}>
              {s.label}
            </div>
            <div style={{ display: "flex", gap: 2, flex: 1, minHeight: 50 }}>
              {s.cards.length === 0
                ? <div style={{
                    fontSize: 11, opacity: 0.4, fontStyle: "italic",
                    display: "flex", alignItems: "center",
                  }}>(hole cards dealt, no community cards yet)</div>
                : s.cards.map((c, j) => (
                    <TritonCard key={j} card={c} size={38}/>
                  ))
              }
            </div>
            <div style={{ fontSize: 10, opacity: 0.55, minWidth: 90, textAlign: "right" }}>
              {s.note}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

// ───────────────────────────────────────────────────────────────
// PokerTable: 6-max table with positions labeled, button highlighted
// ───────────────────────────────────────────────────────────────
export function PokerTablePositions() {
  // Six positions around an ellipse. Hero/button at the bottom for natural orientation.
  const cx = 200, cy = 130, rx = 150, ry = 90;
  const positions = ["UTG", "HJ", "CO", "BTN", "SB", "BB"];
  const colors = {
    BTN: "#d4a13b",  // gold - hero/dealer
    SB:  "#e07a5f",  // orange-red - small blind
    BB:  "#c8102e",  // red - big blind
  };

  const seats = positions.map((pos, i) => {
    // Place BTN at bottom center (angle = pi/2 = 90 deg = bottom in SVG y-down)
    // Other positions go counterclockwise from there
    const btnIdx = positions.indexOf("BTN");
    const angle = Math.PI / 2 + ((i - btnIdx) * (2 * Math.PI / positions.length));
    return {
      pos,
      x: cx + rx * Math.cos(angle),
      y: cy + ry * Math.sin(angle),
      color: colors[pos] || "rgba(232,227,211,0.4)",
      isBlind: pos === "SB" || pos === "BB",
      isButton: pos === "BTN",
    };
  });

  return (
    <Frame caption="A 6-max table. The dealer button (gold) rotates one seat clockwise each hand. The two seats immediately to the left of it post the blinds.">
      <svg viewBox="0 0 400 260" style={{ width: "100%", height: "auto", display: "block" }}>
        {/* Felt */}
        <ellipse cx={cx} cy={cy} rx={rx + 30} ry={ry + 30}
          fill="#15302a" stroke="#3a1e10" strokeWidth="6"/>
        <ellipse cx={cx} cy={cy} rx={rx + 20} ry={ry + 20}
          fill="none" stroke="rgba(212,161,59,0.15)" strokeWidth="1"/>
        {/* Center text */}
        <text x={cx} y={cy + 4} textAnchor="middle"
          fontSize="11" fill="rgba(212,161,59,0.3)" letterSpacing="3"
          fontFamily="'Cormorant Garamond', serif">SHOVE·LAB</text>
        {/* Seats */}
        {seats.map(s => (
          <g key={s.pos}>
            <circle cx={s.x} cy={s.y} r={s.isButton ? 22 : 18}
              fill={s.color}
              stroke={s.isButton ? "#fafaf7" : "rgba(255,255,255,0.2)"}
              strokeWidth={s.isButton ? 2 : 1}/>
            <text x={s.x} y={s.y + 3} textAnchor="middle"
              fontSize={s.isButton ? 12 : 11}
              fontWeight="700" fill="#0a1816"
              fontFamily="'Inter', sans-serif">
              {s.pos}
            </text>
            {s.isButton && (
              <text x={s.x} y={s.y + 38} textAnchor="middle"
                fontSize="9" fill="#d4a13b" letterSpacing="2"
                fontFamily="'Inter', sans-serif" fontWeight="700">DEALER</text>
            )}
            {s.pos === "SB" && (
              <text x={s.x} y={s.y - 28} textAnchor="middle"
                fontSize="9" fill="#e07a5f" letterSpacing="2"
                fontFamily="'Inter', sans-serif" fontWeight="700">0.5 BB</text>
            )}
            {s.pos === "BB" && (
              <text x={s.x} y={s.y - 28} textAnchor="middle"
                fontSize="9" fill="#c8102e" letterSpacing="2"
                fontFamily="'Inter', sans-serif" fontWeight="700">1 BB</text>
            )}
          </g>
        ))}
        {/* Position abbreviation key */}
        <text x={10} y={250} fontSize="9" fill="rgba(232,227,211,0.55)" fontFamily="'Inter', sans-serif">
          UTG = Under the Gun · HJ = Hijack · CO = Cutoff · BTN = Button · SB = Small Blind · BB = Big Blind
        </text>
      </svg>
    </Frame>
  );
}

// ───────────────────────────────────────────────────────────────
// BoardWithStraight: shows a coordinated board with straight possibilities
// ───────────────────────────────────────────────────────────────
export function BoardWithStraight() {
  return (
    <Frame caption="9-8-7 on the board: anyone holding T-J, 6-T, 5-6, or J-T has a straight. Watch out for this pattern.">
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
          opacity: 0.55, marginBottom: 12,
        }}>Dangerous board</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
          <TritonCard card={{ rank: "9", suit: "h" }} size={50}/>
          <TritonCard card={{ rank: "8", suit: "h" }} size={50}/>
          <TritonCard card={{ rank: "7", suit: "d" }} size={50}/>
          <TritonCard card={{ rank: "2", suit: "c" }} size={50}/>
          <TritonCard card={{ rank: "4", suit: "s" }} size={50}/>
        </div>
        <div style={{
          marginTop: 16, padding: "10px 14px",
          background: "rgba(224,122,95,0.08)",
          border: "1px solid rgba(224,122,95,0.3)",
          borderRadius: 6,
          fontSize: 12, lineHeight: 1.5,
          color: "#e07a5f",
        }}>
          <strong>Threat:</strong> straight (very possible).
          <span style={{ color: "rgba(232,227,211,0.7)" }}> No flush possible — only 2 hearts. No full house possible — no pair on board.</span>
        </div>
      </div>
    </Frame>
  );
}

// ───────────────────────────────────────────────────────────────
// BoardWithFlushDraw: three-suit board showing flush threat
// ───────────────────────────────────────────────────────────────
export function BoardWithFlushDraw() {
  return (
    <Frame caption="Three hearts on the board: any opponent with two hearts in their hand has a flush.">
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
          opacity: 0.55, marginBottom: 12,
        }}>Flush board</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
          <TritonCard card={{ rank: "A", suit: "h" }} size={50}/>
          <TritonCard card={{ rank: "8", suit: "h" }} size={50}/>
          <TritonCard card={{ rank: "3", suit: "h" }} size={50}/>
          <TritonCard card={{ rank: "K", suit: "s" }} size={50}/>
          <TritonCard card={{ rank: "9", suit: "c" }} size={50}/>
        </div>
        <div style={{
          marginTop: 16, padding: "10px 14px",
          background: "rgba(224,122,95,0.08)",
          border: "1px solid rgba(224,122,95,0.3)",
          borderRadius: 6,
          fontSize: 12, lineHeight: 1.5,
          color: "#e07a5f",
        }}>
          <strong>Threat:</strong> flush. Anyone holding two hearts beats you.
        </div>
      </div>
    </Frame>
  );
}

// ───────────────────────────────────────────────────────────────
// BettingActions: visual reference of the six betting actions
// ───────────────────────────────────────────────────────────────
export function BettingActions() {
  const actions = [
    { name: "Fold",   desc: "Give up your hand",                    color: "#6b6b6b", icon: "✕" },
    { name: "Check",  desc: "Stay in, don't bet (if no one has)",   color: "#7fc69a", icon: "—" },
    { name: "Call",   desc: "Match someone's bet",                  color: "#7fc69a", icon: "=" },
    { name: "Bet",    desc: "Put chips in (first to act)",          color: "#d4a13b", icon: "▲" },
    { name: "Raise",  desc: "Make a previous bet bigger",           color: "#d4a13b", icon: "↑" },
    { name: "All-in", desc: "Push your entire stack",               color: "#c8102e", icon: "★" },
  ];
  return (
    <Frame caption="The six possible actions when it's your turn. Most of poker is choosing between these.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
        {actions.map(a => (
          <div key={a.name} style={{
            background: "rgba(10,24,22,0.6)",
            border: `1px solid ${a.color}55`,
            borderLeft: `3px solid ${a.color}`,
            borderRadius: 6,
            padding: "10px 12px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{
                color: a.color, fontWeight: 700, fontSize: 14,
                fontFamily: "'Inter', sans-serif",
              }}>{a.icon}</span>
              <span style={{
                color: a.color, fontWeight: 700, fontSize: 13,
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}>
                {a.name}
              </span>
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.4 }}>{a.desc}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

// ───────────────────────────────────────────────────────────────
// TournamentLifecycle: visual timeline showing how MTTs progress
// ───────────────────────────────────────────────────────────────
export function TournamentLifecycle() {
  const stages = [
    { label: "Early",        desc: "Deep stacks, low blinds, play patient",             color: "#7fc69a", pct: "100%" },
    { label: "Mid",          desc: "Stacks shrinking, blinds rising",                   color: "#d4a13b", pct: "60%" },
    { label: "Bubble",       desc: "Just before the money — ICM peak, tighten up",      color: "#e07a5f", pct: "20%" },
    { label: "In the money", desc: "Cashing, but most prize $ is at the top",           color: "#9b5de5", pct: "12%" },
    { label: "Final table",  desc: "Top 8-9 players, massive payout jumps",             color: "#c8102e", pct: "1.5%" },
    { label: "Winner",       desc: "1 player gets ~20-30% of the prize pool",           color: "#ffd96a", pct: "0.2%" },
  ];
  return (
    <Frame caption="The journey through an MTT. Each row shows roughly what % of starters are still in at that point.">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {stages.map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              minWidth: 110,
              fontSize: 12, fontWeight: 700,
              color: s.color,
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              {s.label}
            </div>
            <div style={{ flex: 1, fontSize: 12, opacity: 0.75 }}>{s.desc}</div>
            <div style={{
              minWidth: 50, textAlign: "right",
              fontSize: 12, fontWeight: 700, color: s.color,
              fontFamily: "'Inter', sans-serif",
            }}>
              {s.pct}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

// ───────────────────────────────────────────────────────────────
// VISUAL_REGISTRY: maps lesson-data names to components
// ───────────────────────────────────────────────────────────────
export const VISUAL_REGISTRY = {
  HoleCardsAndBoard,
  DealSequence,
  PokerTablePositions,
  BoardWithStraight,
  BoardWithFlushDraw,
  BettingActions,
  TournamentLifecycle,
};
