import TritonCard from "./TritonCard.jsx";
import MiniTable from "./MiniTable.jsx";

/**
 * Lesson visual registry. Each lesson section of type "visual" names one of
 * these by `section.visual`, optionally passing `section.props`.
 *
 * Visuals are SVG/Card layouts using the app's existing components, so they
 * inherit the Triton card style, color palette, and felt aesthetic without
 * any external image dependencies.
 */

// ─────────────────────────────────────────────────────────────────────
// Hold'em hero — 2 hole cards + 5 community cards, labeled
// ─────────────────────────────────────────────────────────────────────
export function HoldemHero() {
  // Show: 2 hole + 5 board = 7 cards available. Then below, the "best 5"
  // selection — 5 cards that make a straight, with the 2 unused shown
  // dimmed.  A real "ah, that's how the game works" moment.
  return (
    <VisualFrame caption="From your 2 cards + the 5 on the board, you pick the best 5-card hand. The other 2 are just ignored.">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        {/* Step 1: All 7 available cards */}
        <div style={{ textAlign: "center" }}>
          <SmallLabel>Step 1 · The 7 cards available to you</SmallLabel>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, opacity: 0.55, marginBottom: 4, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Your hand
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                <TritonCard card="As" size={54}/>
                <TritonCard card="Kh" size={54}/>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, opacity: 0.55, marginBottom: 4, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                The board
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                <TritonCard card="Qd" size={54}/>
                <TritonCard card="Jh" size={54}/>
                <TritonCard card="Tc" size={54}/>
                <TritonCard card="5s" size={54}/>
                <TritonCard card="2c" size={54}/>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow down */}
        <div style={{
          fontSize: 18, color: "rgba(212,161,59,0.5)", lineHeight: 1,
        }}>↓</div>

        {/* Step 2: best 5 picked, 2 dimmed */}
        <div style={{ textAlign: "center" }}>
          <SmallLabel>Step 2 · Pick the best 5 of those 7</SmallLabel>
          <div style={{ display: "flex", gap: 3, justifyContent: "center", alignItems: "flex-end", flexWrap: "wrap" }}>
            {/* The winning 5 — highlighted with gold ring */}
            {["As", "Kh", "Qd", "Jh", "Tc"].map((c, i) => (
              <div key={i} style={{
                boxShadow: "0 0 0 2px rgba(212,161,59,0.6)",
                borderRadius: 4,
              }}>
                <TritonCard card={c} size={56}/>
              </div>
            ))}
            {/* Separator */}
            <div style={{
              width: 18, textAlign: "center",
              fontSize: 14, opacity: 0.4, alignSelf: "center",
            }}>+</div>
            {/* The unused 2 — dimmed */}
            <div style={{ display: "flex", gap: 3, opacity: 0.3 }}>
              <TritonCard card="5s" size={48}/>
              <TritonCard card="2c" size={48}/>
            </div>
          </div>
          <div style={{
            marginTop: 10,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 17, color: "#d4a13b", fontWeight: 600,
          }}>
            A-K-Q-J-T · Straight to the Ace
          </div>
          <div style={{ fontSize: 11, opacity: 0.55, marginTop: 4 }}>
            (The 5 and 2 are dropped — they don't help this hand)
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Deal sequence — preflop → flop → turn → river
// ─────────────────────────────────────────────────────────────────────
export function DealSequence() {
  const stages = [
    { label: "Preflop",  cards: [],                              note: "Just your two hole cards. Betting round 1." },
    { label: "Flop",     cards: ["Qc", "Jd", "Th"],              note: "Three community cards. Betting round 2." },
    { label: "Turn",     cards: ["Qc", "Jd", "Th", "4s"],        note: "Fourth community card. Betting round 3." },
    { label: "River",    cards: ["Qc", "Jd", "Th", "4s", "7c"],  note: "Final community card. Betting round 4." },
  ];
  return (
    <VisualFrame caption="The hand unfolds in four stages, each followed by betting.">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {stages.map(s => (
          <div key={s.label} style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr",
            gap: 16,
            alignItems: "center",
          }}>
            <div style={{
              fontSize: 10, letterSpacing: "0.25em",
              textTransform: "uppercase", color: "#d4a13b",
              fontWeight: 700,
            }}>
              {s.label}
            </div>
            <div>
              {s.cards.length > 0 ? (
                <div style={{ display: "flex", gap: 3, marginBottom: 4, flexWrap: "wrap" }}>
                  {s.cards.map((c, i) => <TritonCard key={i} card={c} size={42}/>)}
                </div>
              ) : (
                <div style={{
                  fontSize: 12, fontStyle: "italic", opacity: 0.5, marginBottom: 4,
                }}>
                  (No community cards yet)
                </div>
              )}
              <div style={{ fontSize: 12, opacity: 0.7 }}>{s.note}</div>
            </div>
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Table positions — reuses MiniTable to show 6-max with BTN/SB/BB highlighted
// ─────────────────────────────────────────────────────────────────────
export function BlindsAndButton() {
  return (
    <VisualFrame caption="The Button moves one seat to the left each hand. SB and BB are forced to bet before any cards are dealt.">
      <div style={{ maxWidth: 320, margin: "0 auto" }}>
        <MiniTable
          seatCount={6}
          heroPosition="BTN"
          villainPosition="BB"
          onChangeSeats={() => {}}
          mode="call"
        />
      </div>
      <div style={{
        display: "flex", gap: 18, justifyContent: "center",
        marginTop: 12, fontSize: 11, flexWrap: "wrap",
      }}>
        <Legend color="#d4a13b" label="BTN — Button (acts last)"/>
        <Legend color="#e85d75" label="BB — Big Blind (forced bet)"/>
        <Legend color="rgba(232,227,211,0.4)" label="SB — Small Blind"/>
      </div>
    </VisualFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Dangerous boards — three example flops with the threats highlighted
// ─────────────────────────────────────────────────────────────────────
export function DangerousBoards() {
  const boards = [
    {
      title: "Flush draw board",
      cards: ["Kh", "9h", "4h"],
      villainCards: ["Ah", "2h"],
      villainMakes: "Flush — five hearts",
      threat: "Three hearts on board. Anyone holding two hearts has a flush.",
    },
    {
      title: "Straight draw board",
      cards: ["Tc", "9d", "8s"],
      villainCards: ["Jh", "Qc"],
      villainMakes: "Straight — 8-9-T-J-Q",
      threat: "Three connected ranks. Anyone holding two cards that fit the run has a straight.",
    },
    {
      title: "Paired board",
      cards: ["7s", "7d", "Kc"],
      villainCards: ["7h", "Tc"],
      villainMakes: "Three of a kind — trip 7s",
      threat: "Two sevens on board. Anyone holding the third 7 has three of a kind.",
    },
  ];
  return (
    <VisualFrame caption="Memorize these three patterns. Almost every postflop trap comes from one of them.">
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {boards.map(b => (
          <div key={b.title} style={{
            paddingBottom: 18,
            borderBottom: "1px solid rgba(232,227,211,0.08)",
          }}>
            <div style={{
              fontSize: 10, letterSpacing: "0.22em",
              textTransform: "uppercase", color: "#e07a5f",
              fontWeight: 700, marginBottom: 10,
            }}>
              {b.title}
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: 14,
              alignItems: "center",
            }}>
              {/* Left: the board */}
              <div>
                <div style={{ fontSize: 9, opacity: 0.55, marginBottom: 4, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  The board
                </div>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  {b.cards.map((c, i) => <TritonCard key={i} card={c} size={42}/>)}
                </div>
              </div>
              {/* Arrow */}
              <div style={{ fontSize: 16, opacity: 0.4, color: "#e07a5f" }}>→</div>
              {/* Right: villain hand */}
              <div>
                <div style={{ fontSize: 9, opacity: 0.55, marginBottom: 4, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  If villain has
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  {b.villainCards.map((c, i) => <TritonCard key={i} card={c} size={42}/>)}
                </div>
                <div style={{
                  fontSize: 11, color: "#e07a5f", marginTop: 6, fontWeight: 600,
                }}>
                  {b.villainMakes}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.5, marginTop: 12 }}>
              {b.threat}
            </div>
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────
// MTT payout curve — bar chart showing how prizes skew to the top
// ─────────────────────────────────────────────────────────────────────
export function MTTPayoutCurve() {
  // Realistic MTT payout shape: 1st gets ~25%, 2nd ~17%, then steep decay
  const payouts = [
    { rank: "1st",  pct: 25, color: "#d4a13b" },
    { rank: "2nd",  pct: 17, color: "#c89530" },
    { rank: "3rd",  pct: 12, color: "#a87330" },
    { rank: "4th",  pct: 8,  color: "#8a5a30" },
    { rank: "5th",  pct: 6,  color: "#6e4a2c" },
    { rank: "10th", pct: 3,  color: "#5a3a28" },
    { rank: "30th", pct: 1.5, color: "#4a3024" },
    { rank: "70th (min cash)", pct: 1, color: "#3a2820" },
  ];
  const max = Math.max(...payouts.map(p => p.pct));

  return (
    <VisualFrame caption="A typical MTT payout structure. First place gets ~25× what min-cashers get, even though the player skill gap isn't 25× as wide.">
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {payouts.map(p => (
          <div key={p.rank} style={{
            display: "grid",
            gridTemplateColumns: "130px 1fr 50px",
            alignItems: "center",
            gap: 10,
          }}>
            <div style={{
              fontSize: 11, opacity: 0.75, textAlign: "right",
              fontFamily: "'Inter', sans-serif",
            }}>
              {p.rank}
            </div>
            <div style={{
              height: 18, background: "rgba(232,227,211,0.04)",
              borderRadius: 3, overflow: "hidden",
            }}>
              <div style={{
                width: `${(p.pct / max) * 100}%`,
                height: "100%",
                background: p.color,
                transition: "width 0.3s",
              }}/>
            </div>
            <div style={{
              fontSize: 12, fontWeight: 700, color: "#d4a13b",
              fontFamily: "'Inter', sans-serif", letterSpacing: "0.02em",
            }}>
              {p.pct}%
            </div>
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Hand rankings quick reference — top 5 hands a beginner sees most
// ─────────────────────────────────────────────────────────────────────
export function HandRankingsQuick() {
  const hands = [
    { name: "Royal Flush",     cards: ["As", "Ks", "Qs", "Js", "Ts"], note: "Best possible hand. Vanishingly rare." },
    { name: "Straight Flush",  cards: ["9h", "8h", "7h", "6h", "5h"], note: "Five consecutive cards of the same suit." },
    { name: "Four of a Kind",  cards: ["Qs", "Qh", "Qd", "Qc", "2s"], note: "All four of one rank." },
    { name: "Full House",      cards: ["Kh", "Kd", "Kc", "8s", "8h"], note: "Three of a kind plus a pair." },
    { name: "Flush",           cards: ["Ah", "Th", "8h", "5h", "2h"], note: "Five cards of the same suit (not in sequence)." },
    { name: "Straight",        cards: ["Tc", "9h", "8d", "7s", "6h"], note: "Five consecutive cards of mixed suits." },
    { name: "Three of a Kind", cards: ["7s", "7h", "7d", "Kc", "2s"], note: "Three cards of the same rank. Also called \"trips\" or \"a set\"." },
    { name: "Two Pair",        cards: ["Ah", "Ad", "9s", "9c", "4h"], note: "Two pairs of different ranks." },
    { name: "One Pair",        cards: ["Js", "Jh", "Kc", "8d", "3s"], note: "Two cards of the same rank." },
    { name: "High Card",       cards: ["Ah", "Td", "8s", "5c", "2h"], note: "Nothing else — wins by the highest single card." },
  ];
  return (
    <VisualFrame caption="The complete hand ranking, strongest to weakest. Memorizing this is the first homework of poker.">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {hands.map((h, i) => (
          <div key={h.name} style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 14,
            alignItems: "center",
          }}>
            <div style={{
              display: "flex", gap: 2,
            }}>
              {h.cards.map((c, j) => <TritonCard key={j} card={c} size={32}/>)}
            </div>
            <div>
              <div style={{
                fontSize: 13, fontWeight: 600, color: "#d4a13b",
              }}>
                {i + 1}. {h.name}
              </div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
                {h.note}
              </div>
            </div>
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Shared frame + small helper components
// ─────────────────────────────────────────────────────────────────────
function VisualFrame({ children, caption }) {
  return (
    <div style={{
      margin: "24px 0",
      padding: 20,
      background: "rgba(10,24,22,0.5)",
      border: "1px solid rgba(232,227,211,0.08)",
      borderRadius: 8,
    }}>
      {children}
      {caption && (
        <div style={{
          marginTop: 14,
          fontSize: 11, opacity: 0.6,
          textAlign: "center",
          lineHeight: 1.5,
          fontStyle: "italic",
        }}>
          {caption}
        </div>
      )}
    </div>
  );
}

function SmallLabel({ children }) {
  return (
    <div style={{
      fontSize: 9, letterSpacing: "0.25em",
      textTransform: "uppercase", opacity: 0.55,
      marginBottom: 6,
    }}>
      {children}
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 10, height: 10, borderRadius: 3, background: color,
      }}/>
      <span style={{ opacity: 0.8 }}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Button rotation — 3 mini tables showing how the button moves each hand
// ─────────────────────────────────────────────────────────────────────
export function ButtonRotation() {
  // 4-seat mini tables. Players A, B, C, D in fixed seats. Button moves
  // one seat to the left (clockwise from player's perspective) each hand.
  // This teaches the rotation concept without 6-max clutter.
  const tables = [
    { label: "Hand 1", btnPlayer: "A", sb: "B", bb: "C" },
    { label: "Hand 2", btnPlayer: "B", sb: "C", bb: "D" },
    { label: "Hand 3", btnPlayer: "C", sb: "D", bb: "A" },
  ];

  return (
    <VisualFrame caption="Each hand, the button shifts one seat clockwise. After enough hands, every player takes a turn at every role — so the forced bets share evenly across the table.">
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 14,
      }}>
        {tables.map(t => <MiniRotationTable key={t.label} {...t}/>)}
      </div>
    </VisualFrame>
  );
}

function MiniRotationTable({ label, btnPlayer, sb, bb }) {
  // 4 seats laid out in a 3x3 grid: top, left, bottom, right around a central
  // felt. Each seat is a colored disc with the player letter; the role label
  // (BTN/SB/BB) sits below the disc as a colored chip.
  const players = ["A", "B", "C", "D"];
  const positionStyle = (p) => {
    // Map player letter to grid cell. A=top, B=right, C=bottom, D=left.
    const map = {
      A: { gridArea: "top" },
      B: { gridArea: "right" },
      C: { gridArea: "bottom" },
      D: { gridArea: "left" },
    };
    return map[p];
  };
  const roleFor = (p) => {
    if (p === btnPlayer) return { tag: "BTN", color: "#d4a13b" };
    if (p === sb)        return { tag: "SB",  color: "#9b8a4a" };
    if (p === bb)        return { tag: "BB",  color: "#e85d75" };
    return null;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontSize: 10, letterSpacing: "0.22em",
        textTransform: "uppercase", color: "#d4a13b",
        fontWeight: 700, marginBottom: 10,
      }}>
        {label}
      </div>
      <div style={{
        display: "grid",
        gridTemplateAreas: `
          ".    top    .    "
          "left center right"
          ".    bottom .    "
        `,
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "auto auto auto",
        gap: 6,
        maxWidth: 170,
        margin: "0 auto",
        alignItems: "center",
        justifyItems: "center",
      }}>
        {/* Felt circle in the centre */}
        <div style={{
          gridArea: "center",
          width: 56, height: 56,
          borderRadius: "50%",
          background: "rgba(20,55,40,0.5)",
          border: "1px solid rgba(212,161,59,0.25)",
          position: "relative",
        }}>
          {/* Rotation arrow inside the felt */}
          <svg viewBox="0 0 40 40" style={{
            position: "absolute", inset: 4,
            width: "calc(100% - 8px)", height: "calc(100% - 8px)",
            opacity: 0.45,
          }}>
            <path d="M 12 20 A 8 8 0 1 1 28 20"
              fill="none" stroke="#d4a13b" strokeWidth="1.5"/>
            <polygon points="26,17 30,20 26,23" fill="#d4a13b"/>
          </svg>
        </div>
        {/* Seats */}
        {players.map(p => {
          const role = roleFor(p);
          return (
            <div key={p} style={{
              ...positionStyle(p),
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: role ? role.color : "rgba(232,227,211,0.18)",
                color: role ? "#0a1816" : "#e8e3d3",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                border: role && role.tag === "BTN" ? "2px solid #fafaf7" : "none",
              }}>
                {p}
              </div>
              {role && (
                <div style={{
                  fontSize: 8, letterSpacing: "0.15em",
                  fontWeight: 700, color: role.color,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {role.tag}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Betting flow — the rhythm of a hand: deal → bet → next street → bet ...
// ─────────────────────────────────────────────────────────────────────
export function BettingFlow() {
  const steps = [
    { label: "Blinds posted",      kind: "setup",  detail: "SB and BB put in chips" },
    { label: "Hole cards dealt",   kind: "deal",   detail: "Each player gets 2 cards" },
    { label: "Preflop betting",    kind: "bet",    detail: "Fold, call, or raise" },
    { label: "Flop dealt",         kind: "deal",   detail: "3 community cards" },
    { label: "Flop betting",       kind: "bet",    detail: "Check or bet" },
    { label: "Turn dealt",         kind: "deal",   detail: "4th community card" },
    { label: "Turn betting",       kind: "bet",    detail: "Check or bet" },
    { label: "River dealt",        kind: "deal",   detail: "5th community card" },
    { label: "River betting",      kind: "bet",    detail: "Final round" },
    { label: "Showdown",           kind: "win",    detail: "Best 5-card hand wins" },
  ];

  const colorFor = (kind) =>
    kind === "setup" ? "rgba(232,227,211,0.4)"
    : kind === "deal" ? "#7fc69a"
    : kind === "bet" ? "#d4a13b"
    : "#e85d75";

  return (
    <VisualFrame caption="The rhythm of every hand: deal cards, then bet, then deal more cards, then bet — until someone wins by showdown or by everyone else folding.">
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "32px 1fr",
            alignItems: "center",
            gap: 12,
            padding: "8px 4px",
          }}>
            {/* Step number + connector */}
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: colorFor(s.kind),
                color: "#0a1816",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                zIndex: 1,
              }}>
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute",
                  top: 24,
                  bottom: -10,
                  width: 2,
                  background: "rgba(232,227,211,0.15)",
                }}/>
              )}
            </div>
            {/* Label + detail */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
              <div style={{
                fontWeight: 600,
                color: colorFor(s.kind),
                fontSize: 13,
              }}>
                {s.label}
              </div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>
                {s.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div style={{
        display: "flex", gap: 18, justifyContent: "center",
        marginTop: 14, paddingTop: 14,
        borderTop: "1px solid rgba(232,227,211,0.08)",
        flexWrap: "wrap", fontSize: 10,
      }}>
        <Legend color="#7fc69a" label="Cards dealt"/>
        <Legend color="#d4a13b" label="Betting round"/>
        <Legend color="#e85d75" label="Hand ends"/>
      </div>
    </VisualFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Registry — section.visual matches one of these keys
// ─────────────────────────────────────────────────────────────────────
export const LESSON_VISUALS = {
  "holdem-hero":      HoldemHero,
  "deal-sequence":    DealSequence,
  "betting-flow":     BettingFlow,
  "blinds-button":    BlindsAndButton,
  "button-rotation":  ButtonRotation,
  "dangerous-boards": DangerousBoards,
  "mtt-payouts":      MTTPayoutCurve,
  "hand-rankings":    HandRankingsQuick,
};
