import { useState, useMemo } from "react";

import { TABLE_CONFIGS, POSITION_LABELS } from "../data/tableConfigs.js";
import { ICM_STAGES } from "../data/icmStages.js";

import {
  handCode, randomHand, randomStack, randomPositionFor, randomVillainBefore, randomThreeBettorAfter,
} from "../lib/handUtils.js";
import {
  optimalPushAction, optimalCallAction, optimalReshoveAction,
} from "../lib/decisionLogic.js";
import { deriveMultipliers } from "../lib/icm.js";
import {
  pushBefore, pushAfter, callBefore, callAfter, reshoveBefore, reshoveAfter,
  openRaiseBefore, openRaiseAfter,
  threeBetDefenseBefore, threeBetDefenseAfter,
} from "../lib/reasoning.js";
import { getRfiFrequency, gradeRfiAction, primaryAction } from "../data/rfiRanges.js";
import {
  getDefenseFrequency, gradeDefenseAction, primaryDefenseAction,
} from "../data/threeBetDefenseRanges.js";

import TritonCard from "./TritonCard.jsx";
import MiniTable from "./MiniTable.jsx";
import ChipRow from "./ChipRow.jsx";
import RangeViewer from "./RangeViewer.jsx";
import SessionReview from "./SessionReview.jsx";
import ICMSetup from "./ICMSetup.jsx";
import LearnView from "./LearnView.jsx";
import DrillsView from "./DrillsView.jsx";
import RangePopover from "./RangePopover.jsx";
import HandsView from "./HandsView.jsx";
import RangeGridIcon from "./RangeGridIcon.jsx";

// ---------- Styles (kept inline for now, can extract later) ----------

const subLabel = {
  fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase",
  opacity: 0.5, marginBottom: 8, textAlign: "center",
};
const icmCalloutStyle = {
  margin: "12px 0", padding: "11px 13px",
  background: "rgba(200,16,46,0.1)", borderLeft: "2px solid #c8102e",
  borderRadius: 4, fontSize: 12,
};
const questionStyle = {
  margin: "16px 0 0 0", padding: "12px 14px",
  background: "rgba(212,161,59,0.08)", borderLeft: "2px solid #d4a13b",
  borderRadius: 4, fontStyle: "italic", fontSize: 12,
};

function actionBtn(revealed, chosen, isCorrect, base) {
  const showResult = revealed && chosen;
  return {
    background: showResult ? (isCorrect ? "#7fc69a" : "#e07a5f") : base,
    color: showResult ? "#0a1816" : "#fafaf7",
    border: "none",
    padding: "14px 32px",
    borderRadius: 6,
    cursor: revealed ? "default" : "pointer",
    fontSize: 12,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    fontWeight: 600,
    minWidth: 160,
    opacity: revealed && !chosen ? 0.35 : 1,
    transition: "all 0.2s",
    boxShadow: showResult ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.2)",
  };
}

// ---------- Small subcomponents kept local: tab strips ----------

function ModeTabs({ mode, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 0, marginBottom: 18,
      border: "1px solid rgba(232,227,211,0.2)", borderRadius: 6, overflow: "hidden",
      flexWrap: "wrap",
    }}>
      {[
        { value: "openRaise", label: "Raise" },
        { value: "push", label: "Shove" },
        { value: "call", label: "Call" },
        { value: "reshove", label: "Reshove" },
        { value: "threeBetDef", label: "vs 3-Bet" },
      ].map(t => {
        const active = mode === t.value;
        return (
          <button key={t.value} onClick={() => onChange(t.value)}
            style={{
              flex: 1, background: active ? "#d4a13b" : "transparent",
              color: active ? "#0a1816" : "#e8e3d3",
              border: "none", padding: "10px 8px", cursor: "pointer",
              fontSize: 11, letterSpacing: "0.15em",
              textTransform: "uppercase", fontWeight: 700,
            }}>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function ViewTabs({ view, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {[
        { value: "trainer", label: "Trainer" },
        { value: "hands", label: "Hands" },
        { value: "learn", label: "Learn" },
        { value: "drills", label: "Drills" },
        { value: "ranges", label: "Range Viewer" },
        { value: "review", label: "Session Review" },
        { value: "icm", label: "ICM Setup" },
      ].map(t => {
        const active = view === t.value;
        return (
          <button key={t.value} onClick={() => onChange(t.value)}
            style={{
              background: active ? "rgba(212,161,59,0.15)" : "transparent",
              color: active ? "#d4a13b" : "rgba(232,227,211,0.6)",
              border: "none",
              borderBottom: "2px solid " + (active ? "#d4a13b" : "transparent"),
              padding: "10px 16px", cursor: "pointer",
              fontSize: 12, letterSpacing: "0.18em",
              textTransform: "uppercase", fontWeight: 600,
            }}>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Main ----------

export default function PushFoldTrainer() {
  const [view, setView] = useState("trainer");
  const [mode, setMode] = useState("push");
  const [stage, setStage] = useState("CHIP_EV");
  const [seatCount, setSeatCount] = useState(6);
  const [lockedPosition, setLockedPosition] = useState(null);
  const [explanationsOn, setExplanationsOn] = useState(true);

  const [icmState, setICMState] = useState({
    stacks: [12, 18, 22, 15, 25, 20],
    payouts: [1000, 600, 400, 250, 150, 100],
  });
  const customMults = useMemo(
    () => deriveMultipliers(icmState.stacks, icmState.payouts),
    [icmState]
  );

  const [hand, setHand] = useState(() => randomHand());
  const [stack, setStack] = useState(() => randomStack("push"));
  const [position, setPosition] = useState(() => randomPositionFor(6, null, "push"));
  const [villain, setVillain] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [chosen, setChosen] = useState(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [history, setHistory] = useState([]);

  // Drill state (separate history from trainer hands)
  const [drillHistory, setDrillHistory] = useState([]);
  const [drillDeepLink, setDrillDeepLink] = useState(null);
  const [rangePopoverOpen, setRangePopoverOpen] = useState(false);

  function addDrillHistory(entry) {
    setDrillHistory(h => [...h, entry]);
  }

  function jumpToDrill(drillId) {
    setDrillDeepLink(drillId);
    setView("drills");
  }

  const code = useMemo(() => handCode(hand[0], hand[1]), [hand]);

  const before = useMemo(() => {
    if (mode === "push") return pushBefore(position, code, stack, seatCount, stage, customMults);
    if (mode === "openRaise") return openRaiseBefore(position, code, stack, seatCount, stage);
    // For call/reshove/threeBetDef modes, wait for villain to be set before computing reasoning.
    if (!villain) return null;
    if (mode === "call") return callBefore(position, villain, code, stack, seatCount, stage, customMults);
    if (mode === "threeBetDef") return threeBetDefenseBefore(position, villain, code, stack, stage);
    return reshoveBefore(position, villain, code, stack, seatCount, stage, customMults);
  }, [mode, position, villain, code, stack, seatCount, stage, customMults]);

  const after = useMemo(() => {
    if (!revealed || !chosen) return null;
    if (mode === "push") return pushAfter(position, code, stack, chosen, stage, customMults);
    if (mode === "openRaise") return openRaiseAfter(position, code, stack, chosen, stage);
    if (!villain) return null;
    if (mode === "call") return callAfter(position, villain, code, stack, chosen, stage, customMults);
    if (mode === "threeBetDef") return threeBetDefenseAfter(position, villain, code, stack, chosen, stage);
    return reshoveAfter(position, villain, code, stack, chosen, stage, customMults);
  }, [mode, revealed, chosen, position, villain, code, stack, stage, customMults]);

  function dealNew(newMode = mode, newSeats = seatCount, newLocked = lockedPosition) {
    const pos = randomPositionFor(newSeats, newLocked, newMode);
    setPosition(pos);
    if (newMode === "call" || newMode === "reshove") {
      setVillain(randomVillainBefore(newSeats, pos));
    } else if (newMode === "threeBetDef") {
      setVillain(randomThreeBettorAfter(newSeats, pos));
    } else {
      setVillain(null);
    }
    setHand(randomHand());
    setStack(randomStack(newMode));
    setRevealed(false);
    setChosen(null);
  }

  function changeMode(m) {
    setMode(m);
    setLockedPosition(null);
    dealNew(m, seatCount, null);
  }
  function changeStage(s) { setStage(s); }
  function changeSeats(n) {
    setSeatCount(n);
    const trainable = mode === "call" ? TABLE_CONFIGS[n].callableFrom
                    : mode === "reshove" ? TABLE_CONFIGS[n].reshovableFrom
                    : mode === "openRaise" ? TABLE_CONFIGS[n].rfiTrainablePositions
                    : mode === "threeBetDef" ? TABLE_CONFIGS[n].threeBetDefPositions
                    : TABLE_CONFIGS[n].trainablePositions;
    const stillValid = lockedPosition && trainable.includes(lockedPosition);
    const newLocked = stillValid ? lockedPosition : null;
    setLockedPosition(newLocked);
    dealNew(mode, n, newLocked);
  }
  function changeLockedPosition(pos) {
    setLockedPosition(pos);
    dealNew(mode, seatCount, pos);
  }
  function nextHand() { dealNew(); }

  function decide(action) {
    if (revealed) return;
    let correct, isCorrect, grade;
    if (mode === "openRaise") {
      const freq = getRfiFrequency(position, code);
      grade = gradeRfiAction(action, freq);
      correct = primaryAction(freq);
      isCorrect = grade === "exact" || grade === "close";
    } else if (mode === "threeBetDef") {
      const freq = getDefenseFrequency(position, villain, code);
      grade = gradeDefenseAction(action, freq);
      correct = primaryDefenseAction(freq);
      isCorrect = grade === "exact" || grade === "close";
    } else {
      correct = mode === "push" ? optimalPushAction(position, code, stack, stage, customMults)
              : mode === "call" ? optimalCallAction(position, villain, code, stack, stage, customMults)
              : optimalReshoveAction(position, villain, code, stack, stage, customMults);
      isCorrect = action === correct;
      grade = isCorrect ? "exact" : "wrong";
    }
    setChosen(action);
    setRevealed(true);
    setStats(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
    setHistory(h => [...h, {
      mode, position, stage, hand: code, stack,
      villain, chosen: action, optimal: correct, correct: isCorrect, grade,
      ts: Date.now(),
    }]);
  }

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : null;

  const positionOptions = useMemo(() => {
    const trainable = mode === "call" ? TABLE_CONFIGS[seatCount].callableFrom
                    : mode === "reshove" ? TABLE_CONFIGS[seatCount].reshovableFrom
                    : mode === "openRaise" ? TABLE_CONFIGS[seatCount].rfiTrainablePositions
                    : mode === "threeBetDef" ? TABLE_CONFIGS[seatCount].threeBetDefPositions
                    : TABLE_CONFIGS[seatCount].trainablePositions;
    return [
      { value: "RANDOM", label: "Random" },
      ...trainable.map(p => ({ value: p, label: p, title: POSITION_LABELS[p] })),
    ];
  }, [mode, seatCount]);

  const stageOptions = Object.entries(ICM_STAGES).map(([k, v]) => ({
    value: k, label: v.label, title: v.description,
  }));

  // First-to-act preflop varies by table size:
  //   HU (2-max): SB acts first preflop
  //   3-max: BTN acts first preflop (then SB, then BB)
  //   6-max/9-max: UTG acts first preflop
  const firstToActPositions = {
    2: "SB",
    3: "BTN",
    6: "UTG",
    9: "UTG",
  };
  const isFirstToAct = position === firstToActPositions[seatCount];

  // Action label depends on mode AND whether hero is first to act.
  // - openRaise + first-to-act: "First to act preflop" (no one's folded yet)
  // - openRaise/push + not first-to-act: "Folded to you" (others folded)
  // - call: villain shoved
  // - reshove: villain min-raised
  let actionLabel;
  if (mode === "call") actionLabel = villain ? `${villain} shoves all-in` : "Villain shoves all-in";
  else if (mode === "reshove") actionLabel = villain ? `${villain} min-raises to 2bb` : "Villain min-raises to 2bb";
  else if (mode === "threeBetDef") actionLabel = villain ? `You raise. ${villain} 3-bets.` : "Villain 3-bets your raise";
  else if (isFirstToAct) actionLabel = "First to act preflop";
  else actionLabel = "Folded to you";

  // Action buttons depend on mode.
  //   push     → Fold, Shove
  //   call     → Fold, Call
  //   reshove  → Fold, Reshove (shove over a raise)
  //   openRaise→ Fold, Raise, Shove (three options, frequency-graded)
  const actions = mode === "openRaise"
    ? [
        { value: "fold",  label: "Fold",  color: "#6b6b6b" },
        { value: "raise", label: "Raise", color: "#3a7d4c" },
        { value: "shove", label: "Shove", color: "#c8102e" },
      ]
    : mode === "threeBetDef"
      ? [
          { value: "fold",    label: "Fold",      color: "#6b6b6b" },
          { value: "call",    label: "Call",      color: "#3a7d4c" },
          { value: "fourBet", label: stack <= 30 ? "4-Bet Shove" : "4-Bet", color: "#c8102e" },
        ]
      : mode === "call"
        ? [
            { value: "fold", label: "Fold", color: "#6b6b6b" },
            { value: "call", label: "Call", color: "#3a7d4c" },
          ]
        : mode === "reshove"
          ? [
              { value: "fold",  label: "Fold",    color: "#6b6b6b" },
              { value: "shove", label: "Reshove", color: "#c8102e" },
            ]
          : [
              { value: "fold",  label: "Fold",  color: "#6b6b6b" },
              { value: "shove", label: "Shove", color: "#c8102e" },
            ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top, #15302a 0%, #0a1816 60%, #050b0a 100%)",
      color: "#e8e3d3",
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: "24px 24px 32px 24px",
    }}>
      <header style={{
        maxWidth: 1200, margin: "0 auto 16px auto",
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
      }}>
        <div>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 30, fontWeight: 600, letterSpacing: "-0.01em",
          }}>
            Shove<span style={{ color: "#d4a13b" }}>·</span>Lab
          </div>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.55, marginTop: 2 }}>
            MTT Trainer · Nash + ICM
          </div>
        </div>
        {view === "trainer" && (
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {accuracy !== null && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: "#d4a13b" }}>
                  {accuracy}%
                </div>
                <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5 }}>
                  {stats.correct} / {stats.total}
                </div>
              </div>
            )}
            <label style={{
              display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
              fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.8,
            }}>
              <span>Coaching</span>
              <div onClick={() => setExplanationsOn(v => !v)}
                style={{
                  width: 44, height: 22, borderRadius: 11,
                  background: explanationsOn ? "#d4a13b" : "rgba(232,227,211,0.2)",
                  position: "relative", transition: "background 0.2s",
                }}>
                <div style={{
                  position: "absolute", top: 2, left: explanationsOn ? 24 : 2,
                  width: 18, height: 18, borderRadius: "50%", background: "#0a1816",
                  transition: "left 0.2s",
                }}/>
              </div>
            </label>
          </div>
        )}
      </header>

      <div style={{
        maxWidth: 1200, margin: "0 auto",
        borderBottom: "1px solid rgba(232,227,211,0.15)",
        marginBottom: 24,
      }}>
        <ViewTabs view={view} onChange={v => { setView(v); if (v !== "drills") setDrillDeepLink(null); }}/>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {view === "trainer" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: explanationsOn ? "300px 1fr 340px" : "300px 1fr",
            gap: 24, alignItems: "start",
          }}>
            <aside style={{
              background: "rgba(10,24,22,0.6)",
              border: "1px solid rgba(232,227,211,0.1)",
              borderRadius: 16, padding: 20,
            }}>
              <ModeTabs mode={mode} onChange={changeMode}/>

              <div style={subLabel}>Table</div>
              <MiniTable
                seatCount={seatCount}
                heroPosition={position}
                villainPosition={villain}
                onChangeSeats={changeSeats}
                mode={mode}
              />

              <div style={{ marginTop: 16 }}>
                <div style={subLabel}>Tournament Stage</div>
                <ChipRow options={stageOptions} value={stage} onChange={changeStage}/>
                <div style={{
                  fontSize: 11, opacity: 0.7, marginTop: 8, textAlign: "center",
                  fontStyle: "italic", lineHeight: 1.4,
                }}>
                  {stage === "CUSTOM"
                    ? `Custom: push ${(customMults.push * 100).toFixed(0)}% / call ${(customMults.call * 100).toFixed(0)}% / reshove ${(customMults.reshove * 100).toFixed(0)}%`
                    : ICM_STAGES[stage].description}
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={subLabel}>{mode === "push" ? "Drill position" : "Hero position"}</div>
                <ChipRow options={positionOptions}
                  value={lockedPosition || "RANDOM"}
                  onChange={v => changeLockedPosition(v === "RANDOM" ? null : v)}/>
              </div>

              <div style={{
                marginTop: 14, padding: "10px 12px",
                background: "rgba(212,161,59,0.08)", borderRadius: 6,
                fontSize: 11, textAlign: "center",
              }}>
                <div style={{ opacity: 0.6, letterSpacing: "0.15em", textTransform: "uppercase", fontSize: 9, marginBottom: 4 }}>
                  This hand
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: "#d4a13b" }}>
                  {mode === "push" || mode === "openRaise"
                    ? POSITION_LABELS[position]
                    : mode === "threeBetDef"
                      ? `${POSITION_LABELS[position]} open vs ${villain || "villain"} 3-bet`
                      : `${POSITION_LABELS[position]} vs ${villain || "villain"} ${mode === "call" ? "shove" : "raise"}`}
                </div>
              </div>
            </aside>

            <div style={{
              background: "linear-gradient(180deg, rgba(15,40,32,0.6) 0%, rgba(8,22,18,0.8) 100%)",
              borderRadius: 16,
              border: "1px solid rgba(212,161,59,0.2)",
              padding: 32, position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "radial-gradient(circle at 30% 20%, rgba(212,161,59,0.06) 0%, transparent 50%)",
                pointerEvents: "none",
              }}/>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", opacity: 0.5 }}>
                      Action
                    </div>
                    <span style={{
                      fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
                      padding: "2px 8px",
                      background: "rgba(212,161,59,0.12)",
                      border: "1px solid rgba(212,161,59,0.35)",
                      borderRadius: 3,
                      color: "#d4a13b",
                      fontWeight: 700,
                    }}>
                      Preflop
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, marginTop: 4 }}>
                    {actionLabel}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", opacity: 0.5 }}>
                    {mode === "call" ? "To call" : "Effective stack"}
                  </div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 26, marginTop: 4, color: "#d4a13b",
                    display: "flex", alignItems: "baseline",
                    justifyContent: "flex-end", gap: 4,
                  }}>
                    <span>{stack}</span>
                    <span style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      letterSpacing: "0.05em",
                      fontWeight: 600,
                      opacity: 0.7,
                    }}>
                      bb
                    </span>
                  </div>
                </div>
              </div>

              {(mode === "call" || mode === "reshove") && (
                <div style={{ display: "flex", justifyContent: "center", gap: 2, marginBottom: 14, opacity: 0.6 }}>
                  <TritonCard hidden size={60}/>
                  <TritonCard hidden size={60}/>
                </div>
              )}

              <div style={{
                display: "flex", justifyContent: "center", gap: 2,
                margin: (mode === "call" || mode === "reshove") ? "8px 0 36px 0" : "28px 0 36px 0",
              }}>
                <TritonCard card={hand[0]} size={90}/>
                <TritonCard card={hand[1]} size={90}/>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                {actions.map(a => (
                  <button key={a.value}
                    onClick={() => decide(a.value)} disabled={revealed}
                    style={actionBtn(revealed, chosen === a.value, after?.correct === a.value, a.color)}>
                    {a.label}
                  </button>
                ))}
              </div>

              {revealed && after && (
                <div style={{
                  marginTop: 24, paddingTop: 20,
                  borderTop: "1px solid rgba(232,227,211,0.15)",
                  textAlign: "center",
                }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 26,
                    color: after.verdict === "correct" ? "#7fc69a"
                         : after.verdict === "close" ? "#d4a13b"
                         : "#e07a5f",
                  }}>
                    {after.verdict === "correct" ? "Correct"
                     : after.verdict === "close" ? "Close"
                     : "Mistake"}
                  </div>
                  <div style={{ opacity: 0.7, fontSize: 13, marginTop: 6 }}>
                    {mode === "openRaise" || mode === "threeBetDef" ? (
                      <>GTO mix: <strong style={{ color: "#d4a13b" }}>{after.freqString}</strong></>
                    ) : (
                      <>
                        Solver line: <strong style={{ color: "#d4a13b" }}>{after.correct.toUpperCase()}</strong>
                        {after.max ? <> · Threshold: {after.max > 0 ? `${after.max.toFixed(1)}bb` : "never"}</> : null}
                      </>
                    )}
                  </div>
                  <button onClick={nextHand} style={{
                    marginTop: 16,
                    background: "#d4a13b", color: "#0a1816", border: "none",
                    padding: "10px 28px", borderRadius: 6, cursor: "pointer",
                    fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600,
                  }}>
                    Next hand →
                  </button>
                </div>
              )}
            </div>

            {explanationsOn && (
              <aside style={{
                background: "rgba(10,24,22,0.6)",
                border: "1px solid rgba(232,227,211,0.1)",
                borderRadius: 16, padding: 22,
                fontSize: 13, lineHeight: 1.6,
              }}>
                {!revealed ? (
                  before ? (
                  <>
                    <div style={subLabel}>Before you decide</div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, margin: "0 0 12px 0", lineHeight: 1.3 }}>
                      Think it through
                    </h3>
                    <p style={{ margin: "0 0 12px 0" }}>{before.setup}</p>
                    {before.note && (
                      <p style={{
                        margin: "0 0 14px 0",
                        padding: "10px 12px",
                        background: "rgba(212,161,59,0.06)",
                        borderLeft: "2px solid rgba(212,161,59,0.4)",
                        borderRadius: 4,
                        fontSize: 12,
                        lineHeight: 1.55,
                        opacity: 0.9,
                      }}>
                        {before.note}
                      </p>
                    )}
                    {before.potOdds && (
                      <p style={{ margin: "0 0 12px 0", opacity: 0.85 }}>
                        <strong style={{ color: "#d4a13b" }}>Pot odds:</strong> {before.potOdds}
                      </p>
                    )}
                    {before.stack && (
                      <p style={{ margin: "0 0 12px 0", opacity: 0.85 }}>
                        <strong style={{ color: "#d4a13b" }}>Stack:</strong> {before.stack}.
                      </p>
                    )}
                    <p style={{ margin: "0 0 12px 0", opacity: 0.85 }}>
                      <strong style={{ color: "#d4a13b" }}>Position:</strong> {before.position}.
                    </p>
                    {before.shover && (
                      <p style={{ margin: "0 0 12px 0", opacity: 0.85 }}>
                        <strong style={{ color: "#d4a13b" }}>Villain:</strong> {before.shover}.
                      </p>
                    )}
                    {before.raiser && (
                      <p style={{ margin: "0 0 12px 0", opacity: 0.85 }}>
                        <strong style={{ color: "#d4a13b" }}>Raiser:</strong> {before.raiser}.
                      </p>
                    )}
                    {before.threeBettor && (
                      <p style={{ margin: "0 0 12px 0", opacity: 0.85 }}>
                        <strong style={{ color: "#d4a13b" }}>3-Bettor:</strong> {before.threeBettor}
                      </p>
                    )}
                    {before.icm && (
                      <p style={icmCalloutStyle}>
                        <strong style={{ color: "#e07a5f" }}>ICM:</strong> {before.icm}
                      </p>
                    )}
                    <button onClick={() => setRangePopoverOpen(true)} style={{
                      marginTop: 6,
                      background: "transparent",
                      color: "#d4a13b",
                      border: "1px solid rgba(212,161,59,0.4)",
                      borderRadius: 4,
                      padding: "8px 14px",
                      cursor: "pointer",
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      fontFamily: "inherit",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}>
                      <RangeGridIcon size={16}/>
                      Show range grid
                    </button>
                    <p style={questionStyle}>{before.question}</p>
                  </>
                  ) : null
                ) : after && (
                  <>
                    <div style={subLabel}>After the decision</div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, margin: "0 0 12px 0", lineHeight: 1.3 }}>
                      Why
                    </h3>
                    <p style={{ margin: "0 0 14px 0" }}>{after.why}</p>
                    {after.icmNote && (
                      <p style={icmCalloutStyle}>
                        <strong style={{ color: "#e07a5f" }}>ICM:</strong> {after.icmNote}
                      </p>
                    )}
                    <p style={{
                      margin: "14px 0 0 0", padding: "12px 14px",
                      background: after.verdict === "correct" ? "rgba(127,198,154,0.08)"
                                : after.verdict === "close" ? "rgba(212,161,59,0.08)"
                                : "rgba(224,122,95,0.08)",
                      borderLeft: `2px solid ${
                        after.verdict === "correct" ? "#7fc69a"
                        : after.verdict === "close" ? "#d4a13b"
                        : "#e07a5f"}`,
                      borderRadius: 4, fontSize: 12,
                    }}>
                      <strong>Takeaway:</strong> {after.lesson}
                    </p>
                    <button onClick={() => setRangePopoverOpen(true)} style={{
                      marginTop: 12,
                      background: "transparent",
                      color: "#d4a13b",
                      border: "1px solid rgba(212,161,59,0.4)",
                      borderRadius: 4,
                      padding: "8px 14px",
                      cursor: "pointer",
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      fontFamily: "inherit",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}>
                      <RangeGridIcon size={16}/>
                      Show range grid
                    </button>
                  </>
                )}
              </aside>
            )}
          </div>
        )}

        {view === "trainer" && (
          <RangePopover
            open={rangePopoverOpen}
            onClose={() => setRangePopoverOpen(false)}
            mode={mode}
            position={position}
            stage={stage}
            customMult={customMults}
            highlightHand={code}
            villain={villain}
          />
        )}

        {view === "ranges" && (
          <div>
            <div style={{
              background: "rgba(10,24,22,0.6)",
              border: "1px solid rgba(232,227,211,0.1)",
              borderRadius: 12, padding: 20, marginBottom: 20,
              display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap",
            }}>
              <div>
                <div style={subLabel}>Mode</div>
                <ChipRow options={[
                  { value: "push", label: "Open Shove" },
                  { value: "call", label: "Call vs BTN" },
                  { value: "reshove", label: "Reshove vs CO" },
                ]} value={mode} onChange={setMode}/>
              </div>
              <div>
                <div style={subLabel}>Position</div>
                <ChipRow options={
                  (mode === "call" ? TABLE_CONFIGS[6].callableFrom
                    : mode === "reshove" ? TABLE_CONFIGS[6].reshovableFrom
                    : TABLE_CONFIGS[6].trainablePositions
                  ).map(p => ({ value: p, label: p, title: POSITION_LABELS[p] }))
                } value={lockedPosition || position}
                  onChange={p => { setLockedPosition(p); setPosition(p); }}/>
              </div>
              <div>
                <div style={subLabel}>Stage</div>
                <ChipRow options={stageOptions} value={stage} onChange={setStage}/>
              </div>
            </div>

            <div style={{
              background: "rgba(10,24,22,0.6)",
              border: "1px solid rgba(232,227,211,0.1)",
              borderRadius: 12, padding: 20,
            }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: "0 0 6px 0" }}>
                {mode === "push" ? "Push range" : mode === "call" ? "Call range" : "Reshove range"}
                {" · "}{position}{" · "}{ICM_STAGES[stage].label}
              </h3>
              <p style={{ fontSize: 12, opacity: 0.65, margin: "0 0 16px 0" }}>
                Numbers in each cell = max effective stack (bb) at which the action is +EV. Hover for details.
              </p>
              <RangeViewer mode={mode} position={lockedPosition || position} stage={stage} customMult={customMults}/>
            </div>
          </div>
        )}

        {view === "review" && (
          <SessionReview history={history} onClear={() => {
            setHistory([]);
            setStats({ correct: 0, total: 0 });
          }}/>
        )}

        {view === "learn" && (
          <LearnView onJumpToDrill={jumpToDrill}/>
        )}

        {view === "hands" && (
          <HandsView/>
        )}

        {view === "drills" && (
          <DrillsView
            initialDrill={drillDeepLink}
            history={drillHistory}
            addHistory={addDrillHistory}
          />
        )}

        {view === "icm" && (
          <div>
            <div style={{
              background: "rgba(10,24,22,0.6)",
              border: "1px solid rgba(232,227,211,0.1)",
              borderRadius: 12, padding: 20, marginBottom: 20,
            }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, margin: "0 0 8px 0" }}>
                Custom ICM Setup
              </h3>
              <p style={{ fontSize: 13, opacity: 0.75, margin: 0 }}>
                Enter the remaining players' stacks (chips) and the prize structure. Player 1 is you (Hero). The Malmuth-Harville algorithm computes each player's tournament equity, and we derive multipliers that tighten push, call, and reshove ranges accordingly. To use these in the trainer, select <strong style={{ color: "#d4a13b" }}>Custom</strong> in the Stage chip.
              </p>
            </div>
            <ICMSetup icmState={icmState} setICMState={setICMState} computedMults={customMults}/>
          </div>
        )}
      </div>

      <footer style={{
        maxWidth: 1200, margin: "32px auto 0 auto",
        fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
        opacity: 0.4, textAlign: "center",
      }}>
        Shove·Lab · Nash data approximated · ICM via Malmuth-Harville (custom) or stage multipliers (presets)
      </footer>
    </div>
  );
}
