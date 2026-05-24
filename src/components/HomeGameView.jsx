import { useState } from "react";
import TritonCard from "./TritonCard.jsx";
import useMediaQuery from "../lib/useMediaQuery.js";
import { track } from "../lib/analytics.js";

/**
 * Home Game tab — an interactive, click-through walkthrough that takes a
 * complete beginner through setting up a single-table home tournament.
 *
 * Six steps, in the order you'd actually make the decisions:
 *   1. Buy-in & prize pool        (the money)
 *   2. Which chip set do you have? (your equipment — gates table size)
 *   3. Chips & how long a night    (denomination set + depth -> stack)
 *   4. Blinds & the timer          (the schedule)
 *   5. Rebuys & payout             (rules to agree first)
 *   6. Deal & play                 (bridge to the Trainer)
 *
 * Advanced via Next/Back or the progress bars. Reuses the real TritonCard and
 * the shared brand palette so it feels native to the rest of the app.
 */

const GOLD = "#d4a13b";
const CREAM = "#e8e3d3";

// ── Reusable chip-value colors. Each denomination has a fixed swatch so the
// same value always looks the same wherever it appears. These are tuned to
// read on the dark felt; real chips vary by manufacturer, which is why the
// walkthrough tells players to go by the printed NUMBER, not the color.
const CHIP_COLOR = {
  25:   { fill: "#2f8a4a", ring: "#fff" },   // green
  50:   { fill: "#7fd4d0", ring: "#0a3a38" }, // teal
  100:  { fill: "#3a3f45", ring: "#fff" },   // dark
  500:  { fill: "#d35aa6", ring: "#fff" },   // pink
  1000: { fill: "#e6c84a", ring: "#5a4a00" }, // yellow
};

// ── Denomination presets. The player picks the set of four values that match
// the chips they own. Each entry lists which depths it can cleanly support
// (smallest chip = small blind; deep stacks need a high top chip). Every
// distribution below totals EXACTLY its stack, equals its stated big-blind
// depth, and fits a standard 300-chip set at 6 players (and 500 at 10).
const DENOM_PRESETS = {
  standard: {
    label: "25 · 100 · 500 · 1000",
    denoms: [25, 100, 500, 1000],
    blinds: "25 / 50",
    bb: 50,
    blurb: "The most common box. Works for any length of game.",
    stacks: {
      50:  { counts: [8, 8, 1, 1], total: 2500 },
      100: { counts: [8, 3, 5, 2], total: 5000 },
      150: { counts: [4, 4, 6, 4], total: 7500 },
    },
  },
  low: {
    label: "25 · 50 · 100 · 500",
    denoms: [25, 50, 100, 500],
    blinds: "25 / 50",
    bb: 50,
    blurb: "A lower-value set (has a 50 chip). Best for shorter games — its top chip is only 500.",
    stacks: {
      50:  { counts: [4, 4, 7, 3], total: 2500 },
      100: { counts: [4, 2, 8, 8], total: 5000 },
    },
  },
  high: {
    label: "50 · 100 · 500 · 1000",
    denoms: [50, 100, 500, 1000],
    blinds: "50 / 100",
    bb: 100,
    blurb: "A higher-value set with no small chips, so blinds start at 50 / 100.",
    stacks: {
      50:  { counts: [8, 6, 0, 4], total: 5000 },
      100: { counts: [4, 3, 3, 8], total: 10000 },
    },
  },
};
const DENOM_OPTIONS = ["standard", "low", "high"];

// ── Depth options (in big blinds). Descriptor + rough duration for a 5–6
// player game on 20-minute levels. Durations are estimates, stated as such.
const DEPTHS = {
  50:  { label: "50 BB", descriptor: "Short & fast", duration: "1½–2½ hours" },
  100: { label: "100 BB", descriptor: "Standard", duration: "2½–3½ hours" },
  150: { label: "150 BB", descriptor: "Deep & long", duration: "3½–5 hours" },
};
const DEPTH_OPTIONS = [50, 100, 150];

// Standard retail chip sets and what they realistically hold.
const SET_PRESETS = {
  300: {
    label: "300-chip set",
    players: "4–6 players",
    diff: "The everyday starter box — about 100 of the smallest chip and ~50 of each other colour. Perfect for a small group.",
  },
  500: {
    label: "500-chip set",
    players: "6–10 players",
    diff: "Roughly half-again as many chips of every colour. Seats a bigger table and leaves spares for rebuys.",
  },
};
const SET_OPTIONS = [300, 500];

// Build the blind schedule for a preset, scaled from its starting blind.
// Base schedule (×1 = starts 25/50); doubles for the "high" preset (50/100).
const BASE_LEVELS = [
  ["1", [25, 50], "start"],
  ["2", [50, 100], "20 min"],
  ["3", [75, 150], "40 min"],
  ["4", [100, 200], "1 hr"],
  ["5", [150, 300], "1 hr 20"],
  ["6", [200, 400], "1 hr 40"],
];

function Chip({ value, count }) {
  const c = CHIP_COLOR[value] || { fill: "#888", ring: "#fff" };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 54, height: 54, borderRadius: "50%", background: c.fill,
        border: `3px dashed ${c.ring}`, display: "flex", alignItems: "center",
        justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
      }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: value >= 1000 ? 12 : 14, color: c.ring }}>
          {value.toLocaleString()}
        </div>
      </div>
      <div style={{ fontSize: 11, opacity: 0.7, textAlign: "center", lineHeight: 1.3 }}>
        × {count}
      </div>
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
      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 20, color: GOLD, margin: "2px 0" }}>{big}</div>
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

function LessonLink({ onClick, children }) {
  return (
    <button onClick={onClick}
      style={{
        background: "none", border: "none", padding: 0, cursor: "pointer",
        color: GOLD, fontFamily: "'Inter', sans-serif", fontSize: "inherit",
        textDecoration: "underline", textUnderlineOffset: 2,
      }}>
      {children}
    </button>
  );
}

// Small reusable toggle row.
function Toggle({ options, value, onChange, render }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {options.map(opt => {
        const active = opt === value;
        return (
          <button key={opt} onClick={() => onChange(opt)}
            style={{
              flex: 1, fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
              cursor: "pointer", padding: "10px 4px", borderRadius: 8,
              border: "1px solid " + (active ? GOLD : "rgba(232,227,211,0.2)"),
              background: active ? "rgba(212,161,59,0.15)" : "transparent",
              color: active ? GOLD : "rgba(232,227,211,0.65)",
              transition: "all 0.15s", lineHeight: 1.25,
            }}>
            {render(opt, active)}
          </button>
        );
      })}
    </div>
  );
}

export default function HomeGameView({ onGoToTrainer, onOpenLesson }) {
  const isMobile = useMediaQuery(768);
  const [step, setStep] = useState(0);
  const [setSize, setSetSize] = useState(300);
  const [denom, setDenom] = useState("standard");
  const [depth, setDepth] = useState(100);

  // Keep depth valid for the chosen denomination set (e.g. "low"/"high" can't
  // do 150bb). If the current depth isn't supported, fall back to 100, then 50.
  const preset = DENOM_PRESETS[denom];
  const supportedDepths = DEPTH_OPTIONS.filter(d => preset.stacks[d]);
  const activeDepth = preset.stacks[depth] ? depth : (preset.stacks[100] ? 100 : 50);

  const steps = [
    // ── 1. Buy-in & prize pool
    {
      label: "Step 1 of 6",
      render: () => (
        <>
          <Tag>The prize pool</Tag>
          <Heading>Everyone buys in equally</Heading>
          <Prose>
            A tournament works like this: everyone pays the <b>same buy-in</b> to join, and that cash forms
            a single prize pool. In return, each player gets the <b>same pile of chips</b> to play with.
          </Prose>
          <Prose>
            The key thing to understand up front — and the part beginners always trip on — is that{" "}
            <b>the chips are just a scoreboard.</b> They are not money. A player with lots of chips isn't
            "winning money" yet; they just have a bigger score. The real cash only changes hands at the very
            end, when the prize pool is paid out.
          </Prose>
          <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
            <KeyStat label="Buy-in each" big="$20" sub="4–6 players"/>
            <KeyStat label="Prize pool" big="$80–$120" sub="paid out at the end"/>
          </div>
          <Panel>
            <div style={{ fontSize: 12.5, lineHeight: 1.6, opacity: 0.85 }}>
              <b style={{ color: GOLD }}>Why equal buy-ins?</b> A tournament ends with one winner taking
              the pot, so it only feels fair if everyone risked the same to get in. (A game where chips
              equal real cash and people come and go is a "cash game" — a different format we're not using
              here.)
            </div>
          </Panel>
        </>
      ),
    },

    // ── 2. Which chip set
    {
      label: "Step 2 of 6",
      render: () => {
        const set = SET_PRESETS[setSize];
        return (
          <>
            <Tag>Your chip set</Tag>
            <Heading>Which set do you have?</Heading>
            <Prose>
              Start with the box you own — it's the first practical thing that shapes the night, because it
              decides how big a table you can seat.
            </Prose>
            <div style={{ margin: "12px 0 10px" }}>
              <Toggle options={SET_OPTIONS} value={setSize} onChange={v => { setSetSize(v); track("homegame-set", { set: v }); }}
                render={opt => SET_PRESETS[opt].label}/>
            </div>
            <Panel>
              <div style={{ fontSize: 12.5, lineHeight: 1.6, opacity: 0.88 }}>
                <b style={{ color: GOLD }}>{set.players}.</b> {set.diff}
              </div>
            </Panel>
            <div style={{ fontSize: 12, opacity: 0.6, lineHeight: 1.55, marginTop: 12 }}>
              <b>The difference:</b> the two boxes hold the same kinds of chips — the 500 set just has more of
              each colour. If you're 4–6 friends, a 300 set is all you need; a 500 set is the upgrade for a
              bigger table or lots of rebuys.
            </div>
          </>
        );
      },
    },

    // ── 3. Chips (denomination set + depth)
    {
      label: "Step 3 of 6",
      render: () => {
        const p = DENOM_PRESETS[denom];
        const stack = p.stacks[activeDepth];
        const mathStr = p.denoms
          .map((v, i) => stack.counts[i] > 0 ? `(${stack.counts[i]}×${v.toLocaleString()})` : null)
          .filter(Boolean).join(" + ");
        return (
          <>
            <Tag>Chips &amp; stack</Tag>
            <Heading>Set up the chips</Heading>
            <Prose>
              Chips are identified by the <b>number printed on them</b>, not their colour (every set's colours
              differ — go by the value). Pick the four values that match your set, then how long a night you
              want.
            </Prose>

            <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.5, marginBottom: 5 }}>
              Your chip values
            </div>
            <Toggle options={DENOM_OPTIONS} value={denom}
              onChange={v => { setDenom(v); track("homegame-denom", { denom: v }); }}
              render={(opt) => (
                <span style={{ fontSize: 11.5 }}>{DENOM_PRESETS[opt].label}</span>
              )}/>
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 5, marginBottom: 14, lineHeight: 1.45 }}>
              {p.blurb}
            </div>

            <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.5, marginBottom: 5 }}>
              How long a night?
            </div>
            <Toggle options={supportedDepths} value={activeDepth}
              onChange={v => { setDepth(v); track("homegame-depth", { depth: v }); }}
              render={(opt) => (
                <>
                  {DEPTHS[opt].label}<br/>
                  <span style={{ fontSize: 10, opacity: 0.8, fontWeight: 400 }}>{DEPTHS[opt].descriptor}</span>
                </>
              )}/>
            {supportedDepths.length < 3 && (
              <div style={{ fontSize: 11, opacity: 0.5, marginTop: 5 }}>
                A deep (150 BB) game needs a higher top chip — switch to the 25 / 100 / 500 / 1000 set for that.
              </div>
            )}

            <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
              <KeyStat label="Stack" big={stack.total.toLocaleString()} sub="chips each"/>
              <KeyStat label="Runs" big={DEPTHS[activeDepth].duration} sub="5–6 players"/>
            </div>

            <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.5, textAlign: "center", marginBottom: 4 }}>
              Each player gets
            </div>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", margin: "8px 0 14px", flexWrap: "wrap" }}>
              {p.denoms.map((v, i) => stack.counts[i] > 0 && (
                <Chip key={v} value={v} count={stack.counts[i]}/>
              ))}
            </div>
            <Panel>
              <div style={{ fontSize: 12.5, lineHeight: 1.6, opacity: 0.85 }}>
                <b style={{ color: GOLD }}>The math:</b> {mathStr} = <b>{stack.total.toLocaleString()}</b> per
                player — the smallest chip equals the small blind, so you can always make change. Every player
                starts with the <i>identical</i> set. Times are estimates; rebuys and a bigger table run longer.
              </div>
            </Panel>
          </>
        );
      },
    },

    // ── 4. Blinds & timer
    {
      label: "Step 4 of 6",
      render: () => {
        const p = DENOM_PRESETS[denom];
        const mult = p.bb / 50;
        const stack = p.stacks[activeDepth];
        const levels = BASE_LEVELS.map(([lvl, [sb, bb], after]) =>
          [lvl, `${(sb * mult).toLocaleString()} / ${(bb * mult).toLocaleString()}`, after]);
        return (
          <>
            <Tag>Blinds &amp; levels</Tag>
            <Heading>Set the blinds — and a timer</Heading>
            <Prose>
              Before each hand, two players are forced to put chips in to get the betting started — otherwise
              everyone could just fold forever. The player to the dealer's left posts the <b>small blind</b>;
              the next player posts the <b>big blind</b> (twice the small). These move one seat left every
              hand, so the burden shares evenly.
              {onOpenLesson && (
                <> Want the full story? The{" "}
                  <LessonLink onClick={() => onOpenLesson("blinds-and-button")}>Blinds &amp; Button lesson</LessonLink>{" "}
                  covers it.</>
              )}
            </Prose>
            <Prose>
              Start them at <b>{p.blinds}</b> — that's what makes your {stack.total.toLocaleString()}-chip
              stack {DEPTHS[activeDepth].label}. Then raise them every <b>20 minutes</b> on a timer (any phone
              timer works).
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
              {levels.map((r, idx) => (
                <div key={r[0]} style={{
                  display: "flex", fontSize: 13, padding: "7px 14px",
                  borderBottom: idx < 5 ? "1px solid rgba(232,227,211,0.07)" : "none",
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
                still, forcing action — that's what eventually ends the night instead of folding forever.{" "}
                <b style={{ color: GOLD }}>Want a longer game?</b> Raise less often — every 30 minutes, or
                stay two timer rounds per level. <b style={{ color: GOLD }}>Shorter?</b> Every 10–15. The
                timer, not the chip count, controls how long you play.
              </div>
            </Panel>
          </>
        );
      },
    },

    // ── 5. Rebuys & payout
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

    // ── 6. Deal & play
    {
      label: "Step 6 of 6",
      render: () => (
        <>
          <Tag>You're ready</Tag>
          <Heading>Deal — and play your spots</Heading>
          <Prose>
            That's the whole setup. A few table notes: one person shuffles and deals each hand (or take
            turns), and a marker called the <b>dealer button</b> sits in front of whoever is "the dealer"
            for that hand — it moves one seat left each hand so everyone takes turns posting the blinds.
            {onOpenLesson && (
              <> New to how that rotation works? The{" "}
                <LessonLink onClick={() => onOpenLesson("blinds-and-button")}>Blinds &amp; Button lesson</LessonLink>{" "}
                walks through it.</>
            )}
          </Prose>
          <Prose>
            Lay a tablecloth or blanket down for easy chip-sliding, deal the first hand at Level 1, and
            you're playing. From here it comes down to the only thing that actually wins chips:{" "}
            <b>good decisions</b>.
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
          Six steps, start to finish
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

      <div style={{ minHeight: isMobile ? "auto" : 360 }}>
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
