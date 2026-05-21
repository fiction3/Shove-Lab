import TritonCard from "./TritonCard.jsx";
import MiniTable from "./MiniTable.jsx";
import { useT } from "../lib/i18n.jsx";

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
  const { t } = useT();
  // Show: 2 hole + 5 board = 7 cards available. Then below, the "best 5"
  // selection — 5 cards that make a straight, with the 2 unused shown
  // dimmed.  A real "ah, that's how the game works" moment.
  return (
    <VisualFrame caption={t("viz.hero.caption")}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        {/* Step 1: All 7 available cards */}
        <div style={{ textAlign: "center" }}>
          <SmallLabel>{t("viz.hero.step1")}</SmallLabel>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, opacity: 0.55, marginBottom: 4, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {t("viz.hero.yourHand")}
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                <TritonCard card="As" size={54}/>
                <TritonCard card="Kh" size={54}/>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, opacity: 0.55, marginBottom: 4, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {t("viz.hero.theBoard")}
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
          <SmallLabel>{t("viz.hero.step2")}</SmallLabel>
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
            {t("viz.hero.straight")}
          </div>
          <div style={{ fontSize: 11, opacity: 0.55, marginTop: 4 }}>
            {t("viz.hero.dropped")}
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
  const { t } = useT();
  const stages = [
    { label: "Preflop",  cards: [],                              note: t("viz.deal.preflop") },
    { label: "Flop",     cards: ["Qc", "Jd", "Th"],              note: t("viz.deal.flop") },
    { label: "Turn",     cards: ["Qc", "Jd", "Th", "4s"],        note: t("viz.deal.turn") },
    { label: "River",    cards: ["Qc", "Jd", "Th", "4s", "7c"],  note: t("viz.deal.river") },
  ];
  return (
    <VisualFrame caption={t("viz.deal.caption")}>
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
                  {t("viz.deal.noCards")}
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
  const { t } = useT();
  return (
    <VisualFrame caption={t("viz.blinds.caption")}>
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
        <Legend color="#d4a13b" label={t("viz.blinds.btn")}/>
        <Legend color="#e85d75" label={t("viz.blinds.bb")}/>
        <Legend color="rgba(232,227,211,0.4)" label={t("viz.blinds.sb")}/>
      </div>
    </VisualFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Dangerous boards — three example flops with the threats highlighted
// ─────────────────────────────────────────────────────────────────────
export function DangerousBoards() {
  const { t } = useT();
  const boards = [
    {
      title: t("viz.danger.flush.title"),
      cards: ["Kh", "9h", "4h"],
      villainCards: ["Ah", "2h"],
      villainMakes: t("viz.danger.flush.makes"),
      threat: t("viz.danger.flush.threat"),
    },
    {
      title: t("viz.danger.straight.title"),
      cards: ["Tc", "9d", "8s"],
      villainCards: ["Jh", "Qc"],
      villainMakes: t("viz.danger.straight.makes"),
      threat: t("viz.danger.straight.threat"),
    },
    {
      title: t("viz.danger.paired.title"),
      cards: ["7s", "7d", "Kc"],
      villainCards: ["7h", "Tc"],
      villainMakes: t("viz.danger.paired.makes"),
      threat: t("viz.danger.paired.threat"),
    },
  ];
  return (
    <VisualFrame caption={t("viz.danger.caption")}>
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
                  {t("viz.danger.theBoard")}
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
                  {t("viz.danger.ifVillain")}
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
  const { t } = useT();
  // Realistic MTT payout shape: 1st gets ~25%, 2nd ~17%, then steep decay
  const payouts = [
    { rank: "1st",  pct: 25, color: "#d4a13b" },
    { rank: "2nd",  pct: 17, color: "#c89530" },
    { rank: "3rd",  pct: 12, color: "#a87330" },
    { rank: "4th",  pct: 8,  color: "#8a5a30" },
    { rank: "5th",  pct: 6,  color: "#6e4a2c" },
    { rank: "10th", pct: 3,  color: "#5a3a28" },
    { rank: "30th", pct: 1.5, color: "#4a3024" },
    { rank: t("viz.payout.minCash"), pct: 1, color: "#3a2820" },
  ];
  const max = Math.max(...payouts.map(p => p.pct));

  return (
    <VisualFrame caption={t("viz.payout.caption")}>
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
  const { t } = useT();
  const hands = [
    { name: "Royal Flush",     cards: ["As", "Ks", "Qs", "Js", "Ts"], note: t("viz.rankings.royalFlush") },
    { name: "Straight Flush",  cards: ["9h", "8h", "7h", "6h", "5h"], note: t("viz.rankings.straightFlush") },
    { name: "Four of a Kind",  cards: ["Qs", "Qh", "Qd", "Qc", "2s"], note: t("viz.rankings.fourOfAKind") },
    { name: "Full House",      cards: ["Kh", "Kd", "Kc", "8s", "8h"], note: t("viz.rankings.fullHouse") },
    { name: "Flush",           cards: ["Ah", "Th", "8h", "5h", "2h"], note: t("viz.rankings.flush") },
    { name: "Straight",        cards: ["Tc", "9h", "8d", "7s", "6h"], note: t("viz.rankings.straight") },
    { name: "Three of a Kind", cards: ["7s", "7h", "7d", "Kc", "2s"], note: t("viz.rankings.threeOfAKind") },
    { name: "Two Pair",        cards: ["Ah", "Ad", "9s", "9c", "4h"], note: t("viz.rankings.twoPair") },
    { name: "One Pair",        cards: ["Js", "Jh", "Kc", "8d", "3s"], note: t("viz.rankings.onePair") },
    { name: "High Card",       cards: ["Ah", "Td", "8s", "5c", "2h"], note: t("viz.rankings.highCard") },
  ];
  return (
    <VisualFrame caption={t("viz.rankings.caption")}>
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
// Button rotation — ONE table with a rotation indicator showing how
// positions shift over consecutive hands.
// ─────────────────────────────────────────────────────────────────────
export function ButtonRotation() {
  const { t } = useT();
  // Single 6-seat table. Three players are highlighted with the current
  // hand's roles (BTN/SB/BB). Below the table, we use small chip pills
  // to indicate where those roles WILL move next hand.
  // The whole concept becomes: "Look — the button is here this hand, but
  // it moves one seat clockwise next hand."
  return (
    <VisualFrame caption={t("viz.rotation.caption")}>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 18,
      }}>
        <RotationTable/>
        <RotationLegend/>
      </div>
    </VisualFrame>
  );
}

function RotationTable() {
  // 6 seats positioned around an ellipse. Each seat shows current role
  // (or just the seat letter) plus a small arrow indicating it will be
  // a new role next hand.
  const seats = [
    // Layout: 6 seats around an oval.  Index 0 is "you", going clockwise.
    { x: 175, y: 30,  label: "P1", current: "BTN", next: null,  highlight: true  }, // top
    { x: 305, y: 80,  label: "P2", current: "SB",  next: "BTN", highlight: true  }, // upper-right
    { x: 305, y: 170, label: "P3", current: "BB",  next: "SB",  highlight: true  }, // lower-right
    { x: 175, y: 220, label: "P4", current: null,  next: "BB",  highlight: false }, // bottom
    { x: 45,  y: 170, label: "P5", current: null,  next: null,  highlight: false }, // lower-left
    { x: 45,  y: 80,  label: "P6", current: null,  next: null,  highlight: false }, // upper-left
  ];

  return (
    <svg viewBox="0 0 350 250" style={{ width: "100%", maxWidth: 420, height: "auto" }}>
      {/* Felt */}
      <ellipse cx="175" cy="125" rx="125" ry="80"
        fill="rgba(20,55,40,0.5)" stroke="rgba(212,161,59,0.25)" strokeWidth="1.5"/>

      {/* Big rotation arrow inside the felt */}
      <g opacity="0.6">
        <path d="M 130 125 A 45 30 0 1 1 220 125"
          fill="none" stroke="#d4a13b" strokeWidth="2"/>
        <polygon points="215,118 226,125 215,132" fill="#d4a13b"/>
        <text x="175" y="135" textAnchor="middle"
          fontSize="9" fill="#d4a13b" fontWeight="700"
          letterSpacing="2" fontFamily="'Inter', sans-serif">
          ROTATION
        </text>
      </g>

      {/* Seats */}
      {seats.map((s, i) => {
        const roleColor = s.current === "BTN" ? "#d4a13b"
                        : s.current === "SB"  ? "#9b8a4a"
                        : s.current === "BB"  ? "#e85d75"
                        : "rgba(232,227,211,0.18)";
        const textColor = s.current ? "#0a1816" : "#e8e3d3";
        return (
          <g key={i}>
            {/* Seat disc */}
            <circle cx={s.x} cy={s.y} r="18"
              fill={roleColor}
              stroke={s.current === "BTN" ? "#fafaf7" : "transparent"}
              strokeWidth={s.current === "BTN" ? "2.5" : "0"}/>
            {/* Current role text on the disc */}
            {s.current ? (
              <text x={s.x} y={s.y + 4} textAnchor="middle"
                fontSize="11" fontWeight="800"
                fill={textColor}
                fontFamily="'Inter', sans-serif"
                letterSpacing="0.5">
                {s.current}
              </text>
            ) : (
              <text x={s.x} y={s.y + 4} textAnchor="middle"
                fontSize="11" fontWeight="700"
                fill="#e8e3d3" opacity="0.7"
                fontFamily="'Inter', sans-serif">
                {s.label}
              </text>
            )}
            {/* "Next hand: X" hint under the disc */}
            {s.next && (
              <text x={s.x} y={s.y + 36} textAnchor="middle"
                fontSize="8" fill="rgba(232,227,211,0.55)"
                fontFamily="'Inter', sans-serif"
                letterSpacing="0.5">
                next: {s.next}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function RotationLegend() {
  const { t } = useT();
  return (
    <div style={{
      display: "flex", gap: 16, justifyContent: "center",
      flexWrap: "wrap", fontSize: 10,
    }}>
      <Legend color="#d4a13b" label={t("viz.rotation.btn")}/>
      <Legend color="#9b8a4a" label={t("viz.rotation.sb")}/>
      <Legend color="#e85d75" label={t("viz.rotation.bb")}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Betting flow — the rhythm of a hand, with a small visual per step
// ─────────────────────────────────────────────────────────────────────
export function BettingFlow() {
  const { t } = useT();
  // Each step has a visual thumbnail (Thumb), a label, and a one-line detail.
  // The thumbnails reuse TritonCard at a small size, plus chip pills for
  // betting/blinds steps.
  const steps = [
    {
      label: t("viz.flow.blindsPosted"),
      detail: t("viz.flow.blindsPosted.d"),
      kind: "setup",
      thumb: <ChipsThumb labels={["SB", "BB"]}/>,
    },
    {
      label: t("viz.flow.holeCards"),
      detail: t("viz.flow.holeCards.d"),
      kind: "deal",
      thumb: <CardsThumb cards={[null, null]}/>,
    },
    {
      label: t("viz.flow.preflopBet"),
      detail: t("viz.flow.preflopBet.d"),
      kind: "bet",
      thumb: <ChipsThumb labels={["bet"]}/>,
    },
    {
      label: t("viz.flow.flopDealt"),
      detail: t("viz.flow.flopDealt.d"),
      kind: "deal",
      thumb: <CardsThumb cards={["Kh", "7c", "2s"]}/>,
    },
    {
      label: t("viz.flow.flopBet"),
      detail: t("viz.flow.flopBet.d"),
      kind: "bet",
      thumb: <ChipsThumb labels={["bet"]}/>,
    },
    {
      label: t("viz.flow.turnDealt"),
      detail: t("viz.flow.turnDealt.d"),
      kind: "deal",
      thumb: <CardsThumb cards={["Kh", "7c", "2s", "9d"]}/>,
    },
    {
      label: t("viz.flow.turnBet"),
      detail: t("viz.flow.turnBet.d"),
      kind: "bet",
      thumb: <ChipsThumb labels={["bet"]}/>,
    },
    {
      label: t("viz.flow.riverDealt"),
      detail: t("viz.flow.riverDealt.d"),
      kind: "deal",
      thumb: <CardsThumb cards={["Kh", "7c", "2s", "9d", "Qh"]}/>,
    },
    {
      label: t("viz.flow.riverBet"),
      detail: t("viz.flow.riverBet.d"),
      kind: "bet",
      thumb: <ChipsThumb labels={["bet"]}/>,
    },
    {
      label: t("viz.flow.showdown"),
      detail: t("viz.flow.showdown.d"),
      kind: "win",
      thumb: <ShowdownThumb/>,
    },
  ];

  const colorFor = (kind) =>
    kind === "setup" ? "rgba(232,227,211,0.4)"
    : kind === "deal" ? "#7fc69a"
    : kind === "bet" ? "#d4a13b"
    : "#e85d75";

  return (
    <VisualFrame caption={t("viz.flow.caption")}>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "28px 1fr 130px",
            alignItems: "center",
            gap: 12,
            padding: "10px 4px",
          }}>
            {/* Numbered dot with connector line */}
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              alignSelf: "stretch",
              minHeight: 50,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: colorFor(s.kind),
                color: "#0a1816",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                zIndex: 1,
                flexShrink: 0,
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
            <div>
              <div style={{
                fontWeight: 600,
                color: colorFor(s.kind),
                fontSize: 13,
                marginBottom: 2,
              }}>
                {s.label}
              </div>
              <div style={{ fontSize: 11, opacity: 0.65, lineHeight: 1.4 }}>
                {s.detail}
              </div>
            </div>
            {/* Visual thumbnail */}
            <div style={{
              display: "flex", justifyContent: "flex-end",
              alignItems: "center",
            }}>
              {s.thumb}
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
        <Legend color="rgba(232,227,211,0.4)" label={t("viz.flow.legend.setup")}/>
        <Legend color="#7fc69a" label={t("viz.flow.legend.cardsDealt")}/>
        <Legend color="#d4a13b" label={t("viz.legend.bettingRound")}/>
        <Legend color="#e85d75" label={t("viz.flow.legend.handEnds")}/>
      </div>
    </VisualFrame>
  );
}

// Tiny card row used by BettingFlow thumbnails. `null` = face-down.
function CardsThumb({ cards }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {cards.map((c, i) => (
        c === null
          ? <FaceDownMini key={i}/>
          : <TritonCard key={i} card={c} size={26}/>
      ))}
    </div>
  );
}

// A small face-down placeholder matching TritonCard's aspect ratio.
function FaceDownMini() {
  return (
    <div style={{
      width: 26, height: Math.round(26 * 1.4),
      borderRadius: 3,
      background: "linear-gradient(135deg, #5a1a1a 0%, #3a0f0f 100%)",
      border: "1px solid rgba(212,161,59,0.3)",
    }}/>
  );
}

// Chip pill(s) used to represent blinds and betting rounds in BettingFlow.
function ChipsThumb({ labels }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {labels.map((lbl, i) => (
        <div key={i} style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, #f4c668 0%, #d4a13b 50%, #8a6420 100%)",
          border: "2px dashed rgba(255,255,255,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 8, fontWeight: 700,
          color: "#3a2810",
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "0.02em",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}>
          {lbl}
        </div>
      ))}
    </div>
  );
}

// Showdown thumbnail: two players reveal their cards, "vs" between them.
// No winner marker — the lesson explains the dealer/rules decide.
function ShowdownThumb() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      <div style={{ display: "flex", gap: 1 }}>
        <TritonCard card="Ah" size={20}/>
        <TritonCard card="Kh" size={20}/>
      </div>
      <div style={{
        fontSize: 8, opacity: 0.5, letterSpacing: "0.1em",
        fontWeight: 700, fontFamily: "'Inter', sans-serif",
      }}>vs</div>
      <div style={{ display: "flex", gap: 1 }}>
        <TritonCard card="Qd" size={20}/>
        <TritonCard card="Qs" size={20}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Registry — section.visual matches one of these keys
// ─────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────
// Pot odds — "the price" picture: you risk a small call to win a big pot
// ─────────────────────────────────────────────────────────────────────
export function PotOddsPrice() {
  // Visual: a stack representing what you'd win (the pot) vs what you risk
  // (your call). Big green pile = reward, small red pile = what you pay.
  return (
    <VisualFrame caption="You're paying 4 to try to win 12. That's the 'price' the pot is offering. The question is just: do you win often enough to make that price worth it?">
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "flex-end",
        gap: 40, padding: "10px 0",
      }}>
        <ChipStack count={4} color="#e07a5f" label="You risk" sublabel="4bb to call"/>
        <div style={{
          fontSize: 26, opacity: 0.4, alignSelf: "center",
          fontFamily: "'Inter', sans-serif", fontWeight: 300,
        }}>vs</div>
        <ChipStack count={12} color="#7fc69a" label="You can win" sublabel="12bb pot"/>
      </div>
    </VisualFrame>
  );
}

// A simple vertical stack of chips, scaled by count.
function ChipStack({ count, color, label, sublabel }) {
  // Cap visual chips at 12 so the stack doesn't get absurdly tall;
  // the number label still shows the true amount.
  const chips = Math.min(count, 12);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", flexDirection: "column-reverse", gap: 1 }}>
        {Array.from({ length: chips }).map((_, i) => (
          <div key={i} style={{
            width: 44, height: 8, borderRadius: 3,
            background: color, opacity: 0.55 + (i / chips) * 0.45,
            border: "1px solid rgba(0,0,0,0.2)",
          }}/>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
          opacity: 0.6, fontWeight: 600,
        }}>
          {label}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "'Inter', sans-serif" }}>
          {sublabel}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Break-even bar — how often you need to win, shown as a split bar
// ─────────────────────────────────────────────────────────────────────
export function BreakEvenBar({ winPct = 25 }) {
  return (
    <VisualFrame caption={`At this price you only need to win about ${winPct} times out of 100. Win more often than that and calling makes money over time.`}>
      <div style={{ maxWidth: 360, margin: "0 auto" }}>
        <div style={{
          display: "flex", height: 40, borderRadius: 6, overflow: "hidden",
          border: "1px solid rgba(232,227,211,0.15)",
        }}>
          <div style={{
            width: `${winPct}%`,
            background: "linear-gradient(90deg, #7fc69a, #5a8a40)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#0a1816",
          }}>
            {winPct}%
          </div>
          <div style={{
            width: `${100 - winPct}%`,
            background: "rgba(232,227,211,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600, opacity: 0.6,
          }}>
            {100 - winPct}%
          </div>
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          marginTop: 8, fontSize: 11,
        }}>
          <span style={{ color: "#7fc69a", fontWeight: 600 }}>← Win this often = call is worth it</span>
          <span style={{ opacity: 0.55 }}>lose</span>
        </div>
      </div>
    </VisualFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Showdown / hand example — a worked illustration with REAL card images.
// Flexible via props so any lesson can show a concrete situation:
//   • Two hands + board → who-wins comparison (pass hero, opp, winner)
//   • One hand + board   → "what you have" (pass hero, omit opp)
//   • Board only         → board reading (omit hero and opp)
// Props:
//   hero / opp       : ["Ks","Qs"] two hole cards (either optional)
//   board            : ["Kh","Qd","7c","4s","2h"] community cards
//   heroHand/oppHand : made-hand names
//   heroLabel/oppLabel : panel headings
//   boardLabel       : caption above the board row
//   winner           : "hero" | "opp" | "split" (only when two hands shown)
//   note             : one-line explanation under the cards
//   caption          : italic caption under the whole frame
// ─────────────────────────────────────────────────────────────────────
export function ShowdownExample({
  hero,
  opp,
  board = ["Kh", "Qd", "7c", "4s", "2h"],
  heroHand,
  oppHand,
  heroLabel = "You",
  oppLabel = "Opponent",
  boardLabel = "The board (shared by everyone)",
  winner,
  note,
  caption,
}) {
  const showHero = Array.isArray(hero) && hero.length > 0;
  const showOpp = Array.isArray(opp) && opp.length > 0;
  const showBoard = Array.isArray(board) && board.length > 0;

  return (
    <VisualFrame caption={caption}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Shared board */}
        {showBoard && (
          <div style={{ textAlign: "center" }}>
            <SmallLabel>{boardLabel}</SmallLabel>
            <div style={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
              {board.map((c, i) => <TritonCard key={i} card={c} size={42}/>)}
            </div>
          </div>
        )}

        {/* Player hand(s), if any */}
        {(showHero || showOpp) && (
          <div style={{
            display: "flex", gap: 14, justifyContent: "center",
            flexWrap: "wrap", alignItems: "stretch",
          }}>
            {showHero && (
              <PlayerHand
                label={heroLabel}
                cards={hero}
                made={heroHand}
                isWinner={winner === "hero" || winner === "split"}
                showWinBadge={showOpp}
              />
            )}
            {showOpp && (
              <PlayerHand
                label={oppLabel}
                cards={opp}
                made={oppHand}
                isWinner={winner === "opp" || winner === "split"}
                showWinBadge={showHero}
              />
            )}
          </div>
        )}

        {/* Verdict / explanation */}
        {note && (
          <div style={{
            textAlign: "center", fontSize: 13, lineHeight: 1.5,
            opacity: 0.9, marginTop: 2,
          }}>
            {note}
          </div>
        )}
      </div>
    </VisualFrame>
  );
}

function PlayerHand({ label, cards, made, isWinner, showWinBadge = true }) {
  const highlight = isWinner && showWinBadge;
  return (
    <div style={{
      flex: "1 1 200px", maxWidth: 260,
      padding: "12px 14px",
      borderRadius: 8,
      background: highlight ? "rgba(127,198,154,0.1)" : "rgba(232,227,211,0.04)",
      border: `1px solid ${highlight ? "rgba(127,198,154,0.45)" : "rgba(232,227,211,0.12)"}`,
      textAlign: "center",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        marginBottom: 8,
      }}>
        <span style={{
          fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
          fontWeight: 700,
          color: highlight ? "#7fc69a" : "rgba(232,227,211,0.6)",
        }}>
          {label}
        </span>
        {highlight && (
          <span style={{
            fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase",
            fontWeight: 700, color: "#0a1816",
            background: "#7fc69a", borderRadius: 10, padding: "2px 8px",
          }}>
            Wins
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 8 }}>
        {cards.map((c, i) => <TritonCard key={i} card={c} size={44}/>)}
      </div>
      {made && (
        <div style={{
          fontSize: 12, fontWeight: 600,
          color: highlight ? "#7fc69a" : "rgba(232,227,211,0.75)",
        }}>
          {made}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Hand trio — a row of small labeled hands, for "here are some example
// hands" cases (e.g. junk hands beginners overplay). Each entry:
//   { cards: ["Qh","7c"], label: "Q7 offsuit" }
// ─────────────────────────────────────────────────────────────────────
export function HandTrio({ hands = [], caption }) {
  return (
    <VisualFrame caption={caption}>
      <div style={{
        display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
      }}>
        {hands.map((h, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 6 }}>
              {h.cards.map((c, j) => <TritonCard key={j} card={c} size={44}/>)}
            </div>
            <div style={{
              fontSize: 12, fontWeight: 600, color: "rgba(232,227,211,0.8)",
              fontFamily: "'Inter', sans-serif",
            }}>
              {h.label}
            </div>
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

export const LESSON_VISUALS = {
  "holdem-hero":       HoldemHero,
  "deal-sequence":     DealSequence,
  "betting-flow":      BettingFlow,
  "blinds-button":     BlindsAndButton,
  "button-rotation":   ButtonRotation,
  "dangerous-boards":  DangerousBoards,
  "mtt-payouts":       MTTPayoutCurve,
  "hand-rankings":     HandRankingsQuick,
  "pot-odds-price":    PotOddsPrice,
  "break-even-bar":    BreakEvenBar,
  "showdown-example":  ShowdownExample,
  "hand-trio":         HandTrio,
};
