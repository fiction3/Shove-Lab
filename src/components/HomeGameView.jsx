import { useState } from "react";
import TritonCard from "./TritonCard.jsx";
import useMediaQuery from "../lib/useMediaQuery.js";
import { track } from "../lib/analytics.js";

/**
 * Home Game tab — an interactive, click-through walkthrough that takes a
 * complete beginner through setting up a single-table home tournament for
 * 4–6 friends. Six steps, advanced via Next/Back or the progress bars.
 *
 * This is intentionally NOT a LearnView lesson: it's a guided stepper rather
 * than a scrolling article, so it lives as its own small component. It reuses
 * the real TritonCard (4-color GG deck) for any dealt-card visuals and the
 * shared brand palette so it feels native to the rest of the app.
 *
 * The final step bridges to the Trainer via the onGoToTrainer callback.
 */

const GOLD = "#d4a13b";
const CREAM = "#e8e3d3";

// Chip colors tuned to read on the dark felt (slightly brighter than a real
// chip so the white chip doesn't vanish against the background).
function Chip({ fill, ring, label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 54, height: 54, borderRadius: "50%", background: fill,
        border: `3px dashed ${ring}`, display: "flex", alignItems: "center",
        justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
      }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 14, color: ring }}>
          {value}
        </div>
      </div>
      <div style={{ fontSize: 11, opacity: 0.7, textAlign: "center", lineHeight: 1.3 }}
        dangerouslySetInnerHTML={{ __html: label }}/>
    </div>
  );
}

function KeyStat({ label, big, sub }) {
  return (
    <div style={{
      background: "rgba(212,161,59,0.1)", border: "1px solid rgba(212,161,59,0.3)",
      borderRadius: 10, padding: "12px 14px", textAlign: "center", flex: 1, minWidth: 0,
    }}>
      <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.6 }}>{label}</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 22, color: GOLD, margin: "2px 0" }}>{big}</div>
      <div style={{ fontSize: 11, opacity: 0.65 }}>{sub}</div>
    </div>
  );
}

function Panel({ children }) {
  return (
    <div style={{
      background: "rgba(232,227,211,0.04)", border: "1px solid rgba(232,227,211,0.12)",
      borderRadius: 12, padding: "16px 18px",
    }}>{children}</div>
  );
}

function Tag({ children }) {
  return (
    <div style={{
      display: "inline-block", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase",
      color: GOLD, opacity: 0.85, marginBottom: 8,
    }}>{children}</div>
  );
}

function Heading({ children }) {
  return (
    <div style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 23, fontWeight: 600,
      marginBottom: 8, lineHeight: 1.2,
    }}>{children}</div>
  );
}

function Prose({ children }) {
  return <div style={{ fontSize: 13.5, lineHeight: 1.65, opacity: 0.88, marginBottom: 12 }}>{children}</div>;
}

const BLIND_LEVELS = [
  ["1", "5 / 10", "start"],
  ["2", "10 / 20", "~25 min"],
  ["3", "25 / 50", "~50 min"],
  ["4", "50 / 100", "~75 min"],
  ["5", "100 / 200", "~100 min"],
];

export default function HomeGameView({ onGoToTrainer }) {
  const isMobile = useMediaQuery(768);
  const [step, setStep] = useState(0);

  const steps = [
    // 1 — buy-in
    {
      label: "Step 1 of 6",
      render: () => (
        <>
          <Tag>The prize pool</Tag>
          <Heading>Everyone buys in equally</Heading>
          <Prose>
            In a tournament, everyone pays the <b>same amount</b> and gets the <b>same chips</b>. The
            cash goes into one pot; the chips are just for keeping score — they aren't worth real money
            during play.
          </Prose>
          <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
            <KeyStat label="Buy-in each" big="$20" sub="4–6 players"/>
            <KeyStat label="Prize pool" big="$80–$120" sub="paid out at the end"/>
          </div>
          <Panel>
            <div style={{ fontSize: 12.5, lineHeight: 1.6, opacity: 0.85 }}>
              <b style={{ color: GOLD }}>Why equal?</b> A tournament ends with one winner taking the pot.
              That only feels fair if everyone risked the same to get in. Unequal buy-ins are a cash-game
              idea — a different format.
            </div>
          </Panel>
        </>
      ),
    },
    // 2 — stack
    {
      label: "Step 2 of 6",
      render: () => (
        <>
          <Tag>Starting chips</Tag>
          <Heading>Give everyone the same stack</Heading>
          <Prose>
            Hand each player an identical pile. The exact number is arbitrary — what matters is that it
            equals <b>100 big blinds</b>, the standard comfortable starting stack. A clean choice:{" "}
            <b>1,000 in chips</b> per person.
          </Prose>
          <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
            <KeyStat label="Per player" big="1,000" sub="in tournament chips"/>
            <KeyStat label="That equals" big="100 BB" sub="with 5/10 blinds"/>
          </div>
          <Panel>
            <div style={{ fontSize: 12.5, lineHeight: 1.6, opacity: 0.85 }}>
              100bb is the sweet spot beginners train on — deep enough to play real poker, shallow enough
              that hands resolve. It's the same depth the Shove·Lab trainer assumes.
            </div>
          </Panel>
        </>
      ),
    },
    // 3 — denominations
    {
      label: "Step 3 of 6",
      render: () => (
        <>
          <Tag>Chip denominations</Tag>
          <Heading>Assign your chip values</Heading>
          <Prose>
            Using a standard 4-color set, here's a scheme that totals about 1,000 with enough small chips
            to make change early:
          </Prose>
          <div style={{ display: "flex", gap: 14, justifyContent: "space-between", margin: "16px 0", flexWrap: "wrap" }}>
            <Chip fill="#f5f3ec" ring="#888780" label="White<br>× 4" value="5"/>
            <Chip fill="#c43c3c" ring="#fff" label="Red<br>× 6" value="25"/>
            <Chip fill="#2f6fb0" ring="#fff" label="Blue<br>× 5" value="100"/>
            <Chip fill="#2f8a4a" ring="#fff" label="Green<br>× 1" value="500"/>
          </div>
          <Panel>
            <div style={{ fontSize: 12.5, lineHeight: 1.6, opacity: 0.85 }}>
              <b style={{ color: GOLD }}>The math:</b> (4×5) + (6×25) + (5×100) + (1×500) = <b>1,020</b> —
              close enough; round to taste. Just make sure every player gets the <i>identical</i> count.
            </div>
          </Panel>
        </>
      ),
    },
    // 4 — blinds + timer
    {
      label: "Step 4 of 6",
      render: () => (
        <>
          <Tag>Blinds &amp; levels</Tag>
          <Heading>Set the blinds — and a timer</Heading>
          <Prose>
            Two players post forced bets each hand: the <b>small blind</b> and <b>big blind</b>. Start them
            at <b>5 / 10</b> — that makes your 1,000 stack exactly 100 big blinds. Then raise them every{" "}
            <b>20–30 minutes</b> on a timer.
          </Prose>
          <div style={{
            background: "rgba(232,227,211,0.04)", border: "1px solid rgba(232,227,211,0.12)",
            borderRadius: 12, overflow: "hidden", margin: "14px 0",
          }}>
            <div style={{
              display: "flex", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
              opacity: 0.55, padding: "8px 14px", borderBottom: "1px solid rgba(232,227,211,0.1)",
            }}>
              <div style={{ flex: 1 }}>Level</div>
              <div style={{ flex: 1, textAlign: "center" }}>Small / Big</div>
              <div style={{ flex: 1, textAlign: "right" }}>After</div>
            </div>
            {BLIND_LEVELS.map((r, idx) => (
              <div key={r[0]} style={{
                display: "flex", fontSize: 13, padding: "7px 14px",
                borderBottom: idx < 4 ? "1px solid rgba(232,227,211,0.07)" : "none",
                background: idx === 0 ? "rgba(212,161,59,0.08)" : "transparent",
              }}>
                <div style={{ flex: 1, opacity: 0.7 }}>{r[0]}</div>
                <div style={{ flex: 1, textAlign: "center", fontFamily: "'Inter', sans-serif", fontWeight: 600, color: idx === 0 ? GOLD : CREAM }}>{r[1]}</div>
                <div style={{ flex: 1, textAlign: "right", opacity: 0.6, fontSize: 11 }}>{r[2]}</div>
              </div>
            ))}
          </div>
          <Panel>
            <div style={{ fontSize: 12.5, lineHeight: 1.6, opacity: 0.85 }}>
              <b style={{ color: GOLD }}>Why raise them?</b> Growing blinds slowly cost everyone for sitting
              still, forcing action. That's what brings the night to an end instead of folding forever.
            </div>
          </Panel>
        </>
      ),
    },
    // 5 — rebuys + payout
    {
      label: "Step 5 of 6",
      render: () => (
        <>
          <Tag>Rules to set first</Tag>
          <Heading>Decide rebuys &amp; the payout</Heading>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ fontSize: 18, lineHeight: 1, color: GOLD, marginTop: 2 }}>↺</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Rebuys for the first hour</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.55, opacity: 0.82 }}>
                  Bust early? Buy back in for another $20, fresh stack. After one hour the game{" "}
                  <b>locks</b> — win or go home. Keeps everyone in the action while still ending cleanly.
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ fontSize: 18, lineHeight: 1, color: GOLD, marginTop: 2 }}>⚑</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Split the prize</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.55, opacity: 0.82 }}>
                  Simplest is winner-takes-all. For a softer landing, pay the top two.
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
            <KeyStat label="1st place" big="70%" sub="of the pot"/>
            <KeyStat label="2nd place" big="30%" sub="of the pot"/>
          </div>
          <Panel>
            <div style={{ fontSize: 12.5, lineHeight: 1.6, opacity: 0.85 }}>
              Lots of rebuys? Add a third spot — e.g. <b>65 / 25 / 10</b>. The golden rule:{" "}
              <b style={{ color: GOLD }}>decide this before you start</b>, never at midnight.
            </div>
          </Panel>
        </>
      ),
    },
    // 6 — deal + bridge to trainer
    {
      label: "Step 6 of 6",
      render: () => (
        <>
          <Tag>You're ready</Tag>
          <Heading>Deal — and play your spots</Heading>
          <Prose>
            That's the whole setup. Lay a tablecloth down for easy chip-sliding, pass the dealer button
            left each hand, and start at Level 1. Now it comes down to the only thing that actually wins
            chips: <b>good decisions</b>.
          </Prose>
          <div style={{ textAlign: "center", margin: "18px 0" }}>
            <div style={{ display: "inline-flex", gap: 7 }}>
              <TritonCard card="Ah" size={50}/>
              <TritonCard card="Kh" size={50}/>
            </div>
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 8 }}>
              Dealt a big hand short-stacked? That's a push/fold spot.
            </div>
          </div>
          <Panel>
            <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.9, textAlign: "center" }}>
              When you've got a game on the calendar, the <b style={{ color: GOLD }}>Trainer</b> is the best
              place to get sharp before everyone shows up.
              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => { track("homegame-to-trainer"); onGoToTrainer && onGoToTrainer(); }}
                  style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: "#0a1816",
                    background: GOLD, border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer",
                  }}>
                  Practice in the Trainer →
                </button>
              </div>
            </div>
          </Panel>
        </>
      ),
    },
  ];

  const last = steps.length - 1;
  const go = (next) => {
    const clamped = Math.max(0, Math.min(last, next));
    setStep(clamped);
    track("homegame-step", { step: clamped + 1 });
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", opacity: 0.55 }}>
          Home game setup
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? 23 : 27,
          fontWeight: 600, letterSpacing: "-0.01em", marginTop: 2,
        }}>
          Run a Single<span style={{ color: GOLD }}>·</span>Table Tournament
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 3 }}>
          Six steps, start to finish — for 4 to 6 friends
        </div>
      </div>

      {/* progress bars */}
      <div style={{ display: "flex", gap: 5, justifyContent: "center", margin: "18px 0 16px" }}>
        {steps.map((_, idx) => (
          <button key={idx} onClick={() => go(idx)} aria-label={`Go to step ${idx + 1}`}
            style={{
              width: 30, height: 4, borderRadius: 2, cursor: "pointer", border: "none", padding: 0,
              background: idx <= step ? GOLD : "rgba(232,227,211,0.18)", transition: "background 0.2s",
            }}/>
        ))}
      </div>

      <div style={{ minHeight: isMobile ? "auto" : 330 }}>
        {steps[step].render()}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18, gap: 10 }}>
        <button onClick={() => go(step - 1)}
          style={{
            fontFamily: "'Inter', sans-serif", fontSize: 13, color: CREAM, background: "transparent",
            border: "1px solid rgba(232,227,211,0.25)", borderRadius: 8, padding: "9px 16px",
            cursor: "pointer", visibility: step === 0 ? "hidden" : "visible",
          }}>
          ← Back
        </button>
        <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.5 }}>
          {steps[step].label}
        </div>
        <button onClick={() => (step === last ? go(0) : go(step + 1))}
          style={{
            fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0a1816",
            background: GOLD, border: "none", borderRadius: 8, padding: "9px 18px", cursor: "pointer",
          }}>
          {step === last ? "Start over" : "Next →"}
        </button>
      </div>
    </div>
  );
}
