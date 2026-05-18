import { useState, useMemo, useRef, useEffect } from "react";
import { potOdds, gradeAnswer } from "../../lib/oddsCalc.js";
import { DrillFrame, NumberInput, FeedbackBox, NextButton } from "./DrillShared.jsx";

function randomSpot() {
  // Realistic-ish pot/bet sizings. Pot in bb (3-30), bet 25%-150% of pot.
  const pot = [3, 4, 6, 8, 10, 12, 15, 20, 25, 30][Math.floor(Math.random() * 10)];
  const betFractions = [0.25, 0.33, 0.5, 0.66, 0.75, 1.0, 1.25, 1.5];
  const f = betFractions[Math.floor(Math.random() * betFractions.length)];
  const bet = Math.round(pot * f * 2) / 2; // round to nearest 0.5
  return { pot, bet };
}

/**
 * Drill: given pot + villain bet, what required equity % do I need to call?
 */
export default function PotOddsDrill({ onAnswer }) {
  const [spot, setSpot] = useState(randomSpot);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const startTime = useRef(Date.now());

  // Reset timer on new spot
  useEffect(() => { startTime.current = Date.now(); }, [spot]);

  const { requiredEquity, ratio, totalAfter } = useMemo(
    () => potOdds(spot.pot + spot.bet, spot.bet),
    [spot]
  );

  function submit() {
    if (revealed) return;
    const userVal = parseFloat(answer);
    if (isNaN(userVal)) return;
    const grade = gradeAnswer(userVal, requiredEquity, 1, 4);
    const timeMs = Date.now() - startTime.current;
    setRevealed(true);
    onAnswer?.({ drill: "pot-odds", grade, timeMs, userValue: userVal, trueValue: requiredEquity });
  }

  function next() {
    setSpot(randomSpot());
    setAnswer("");
    setRevealed(false);
  }

  const grade = revealed
    ? gradeAnswer(parseFloat(answer), requiredEquity, 1, 4)
    : null;

  return (
    <DrillFrame title={`Pot is ${spot.pot}bb. Villain bets ${spot.bet}bb.`}
      subtitle="Pot odds">
      <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.85, margin: "0 0 18px 0" }}>
        What's the required equity (%) to make calling break even?
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <NumberInput value={answer} onChange={setAnswer} onSubmit={submit}
          placeholder="e.g. 25" suffix="%" disabled={revealed}/>
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
            trueValue={requiredEquity}
            suffix="%"
            explanation={
              <>
                Math: you're calling <strong>{spot.bet}bb</strong> into a pot that becomes <strong>{totalAfter}bb</strong> after your call.
                Required equity = {spot.bet}/{totalAfter} = <strong>{requiredEquity}%</strong>.
                The pot is offering you <strong>{ratio}</strong>.
              </>
            }
          />
          <NextButton onClick={next}/>
        </>
      )}
    </DrillFrame>
  );
}
