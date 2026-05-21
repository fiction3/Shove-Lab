import { useState, useMemo, useRef, useEffect } from "react";
import { foldEquityBreakeven, gradeAnswer } from "../../lib/oddsCalc.js";
import { DrillFrame, NumberInput, FeedbackBox, NextButton, HintBox } from "./DrillShared.jsx";

function randomSpot() {
  const risk = [6, 8, 10, 12, 15, 18, 20][Math.floor(Math.random() * 7)];
  const pot = [1.5, 2, 2.5, 3, 4, 5][Math.floor(Math.random() * 6)];
  const foldFreq = [40, 50, 55, 60, 65, 70, 75, 80][Math.floor(Math.random() * 8)];
  return { risk, pot, foldFreq };
}

/**
 * Drill: given a shove for R into dead money P, and an estimated fold
 * frequency f, what equity-when-called e do you need to break even?
 */
export default function FoldEquityDrill({ onAnswer }) {
  const [spot, setSpot] = useState(randomSpot);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const startTime = useRef(Date.now());
  useEffect(() => { startTime.current = Date.now(); }, [spot]);

  const breakeven = useMemo(
    () => foldEquityBreakeven({ risk: spot.risk, pot: spot.pot, foldFreq: spot.foldFreq / 100 }),
    [spot]
  );

  function submit() {
    if (revealed) return;
    const userVal = parseFloat(answer);
    if (isNaN(userVal)) return;
    setRevealed(true);
    const grade = gradeAnswer(userVal, breakeven, 3, 8);
    const timeMs = Date.now() - startTime.current;
    onAnswer?.({ drill: "fold-equity", grade, timeMs, userValue: userVal, trueValue: breakeven });
  }

  function next() {
    setSpot(randomSpot()); setAnswer(""); setRevealed(false);
  }

  const grade = revealed
    ? gradeAnswer(parseFloat(answer), breakeven, 3, 8)
    : null;

  return (
    <DrillFrame
      title={`Shove ${spot.risk}bb into ${spot.pot}bb dead money. Villain folds ${spot.foldFreq}% of the time.`}
      subtitle="Fold equity"
    >
      <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.85, margin: "0 0 18px 0" }}>
        What equity do you need <em>when called</em> to break even on this shove?
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <NumberInput value={answer} onChange={setAnswer}
          onSubmit={submit} placeholder="e.g. 28" suffix="%"
          disabled={revealed}/>
        {!revealed && (
          <button onClick={submit} style={{
            background: "#d4a13b", color: "#0a1816", border: "none",
            padding: "12px 22px", borderRadius: 6, cursor: "pointer",
            fontSize: 12, letterSpacing: "0.18em",
            textTransform: "uppercase", fontWeight: 700,
          }}>
            Submit
          </button>
        )}
      </div>

      {!revealed && (
        <HintBox>
          <strong>EV(shove) = f×P + (1−f)×(e×(R+P) − R)</strong>, where R = your risk, P = dead money, f = fold frequency, e = equity-when-called.<br/>
          Set EV = 0 and solve for e. Higher fold frequency means lower required equity (sometimes shockingly low — that's the magic of fold equity).
        </HintBox>
      )}

      {revealed && (
        <>
          <FeedbackBox
            grade={grade}
            trueValue={breakeven}
            suffix="%"
            explanation={
              <>
                Solving the breakeven equation gives <strong>{breakeven}%</strong> equity-when-called.
                {breakeven < 20 && " That's very low — high fold equity makes wide shoves print."}
                {breakeven >= 20 && breakeven < 35 && " Moderate — you still need a real hand when called."}
                {breakeven >= 35 && " High — limited fold equity means you need a strong hand."}
              </>
            }
            mathWalkthrough={[
              {
                label: "Step 1 — Write the EV equation",
                formula: `EV = f × P + (1−f) × (e × (R+P) − R)`,
                value: null,
                note: `f = fold freq, P = dead money already in pot (here ${spot.pot}bb), R = your risk (${spot.risk}bb), e = your equity when called.`,
              },
              {
                label: "Step 2 — Plug in the known values",
                formula: `EV = ${(spot.foldFreq / 100).toFixed(2)} × ${spot.pot} + ${((100 - spot.foldFreq) / 100).toFixed(2)} × (e × ${spot.risk + spot.pot} − ${spot.risk})`,
                value: null,
                note: "We know fold frequency, pot, and risk. Only e (your equity when called) is unknown.",
              },
              {
                label: "Step 3 — Set EV = 0 and solve for e",
                formula: `0 = ${((spot.foldFreq / 100) * spot.pot).toFixed(2)} + ${((100 - spot.foldFreq) / 100).toFixed(2)} × (e × ${spot.risk + spot.pot} − ${spot.risk})`,
                value: `→ e = ${breakeven}%`,
                note: "Below this, the shove loses on average. Above it, the shove prints.",
              },
            ]}
            eli7={[
              `Two things can happen when you shove: villain folds, or villain calls. You win the ${spot.pot}bb already in the middle every time they fold — for free, no cards needed.`,
              `Villain folds ${spot.foldFreq} times out of 100. So a big chunk of the time you just collect that dead money. That cushion means you don't need a great hand for the times you DO get called.`,
              `When you do get called, you're risking ${spot.risk}bb to win ${spot.risk + spot.pot}bb. After accounting for how often you steal it outright, the math says you only need to win about ${breakeven} times out of 100 (${breakeven}%) in those called spots to break even.`,
              `The lesson: the more often villain folds, the lower that number gets — which is why shoving can be profitable even with hands that aren't strong.`,
            ]}
          />
          <NextButton onClick={next}/>
        </>
      )}
    </DrillFrame>
  );
}
