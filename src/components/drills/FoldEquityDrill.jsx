import { useState, useMemo, useRef, useEffect } from "react";
import { foldEquityBreakeven, gradeAnswer } from "../../lib/oddsCalc.js";
import { DrillFrame, NumberInput, FeedbackBox, NextButton } from "./DrillShared.jsx";

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

      {revealed && (
        <>
          <FeedbackBox
            grade={grade}
            trueValue={breakeven}
            suffix="%"
            explanation={
              <>
                Math: EV = 0.{spot.foldFreq.toString().padStart(2, "0")} × {spot.pot} + 0.{(100 - spot.foldFreq).toString().padStart(2, "0")} × (e × {spot.risk + spot.pot} − {spot.risk}).
                Solving for e gives <strong>{breakeven}%</strong>.
                {breakeven < 20 && " That's very low — high fold equity makes wide shoves print."}
                {breakeven >= 20 && breakeven < 35 && " Moderate — you still need a real hand when called."}
                {breakeven >= 35 && " High — limited fold equity means you need a strong hand."}
              </>
            }
          />
          <NextButton onClick={next}/>
        </>
      )}
    </DrillFrame>
  );
}
