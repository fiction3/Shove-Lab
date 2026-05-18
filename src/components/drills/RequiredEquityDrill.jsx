import { useState, useMemo, useRef, useEffect } from "react";
import { potOdds, gradeAnswer } from "../../lib/oddsCalc.js";
import { DrillFrame, ChoiceButton, FeedbackBox, NextButton } from "./DrillShared.jsx";

function randomSpot() {
  const pot = [3, 4, 6, 8, 10, 12, 15, 20, 25, 30][Math.floor(Math.random() * 10)];
  const betFractions = [0.25, 0.33, 0.5, 0.66, 0.75, 1.0, 1.25, 1.5];
  const f = betFractions[Math.floor(Math.random() * betFractions.length)];
  const bet = Math.round(pot * f * 2) / 2;
  return { pot, bet };
}

// Generate plausible distractors around the true equity.
function makeChoices(trueEq) {
  const offsets = [-12, -6, 0, +8].sort(() => Math.random() - 0.5);
  const choices = offsets.map(off => {
    const val = Math.max(5, Math.min(60, Math.round(trueEq + off)));
    return val;
  });
  // Ensure the true answer is one of the choices (closest snap)
  const closest = choices.reduce((best, v) =>
    Math.abs(v - trueEq) < Math.abs(best - trueEq) ? v : best, choices[0]);
  const idx = choices.indexOf(closest);
  choices[idx] = Math.round(trueEq);
  // Dedupe
  return [...new Set(choices)].sort((a, b) => a - b);
}

/**
 * Same pot-odds math, but presented as multiple choice. Tests speed
 * recognition rather than mental calculation.
 */
export default function RequiredEquityDrill({ onAnswer }) {
  const [spot, setSpot] = useState(randomSpot);
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const startTime = useRef(Date.now());
  useEffect(() => { startTime.current = Date.now(); }, [spot]);

  const { requiredEquity, ratio, totalAfter } = useMemo(
    () => potOdds(spot.pot + spot.bet, spot.bet),
    [spot]
  );
  const choices = useMemo(() => makeChoices(requiredEquity), [requiredEquity]);

  function pick(val) {
    if (revealed) return;
    setChosen(val);
    setRevealed(true);
    const grade = gradeAnswer(val, requiredEquity, 1, 4);
    const timeMs = Date.now() - startTime.current;
    onAnswer?.({ drill: "required-equity", grade, timeMs, userValue: val, trueValue: requiredEquity });
  }
  function next() {
    setSpot(randomSpot()); setChosen(null); setRevealed(false);
  }

  const grade = revealed ? gradeAnswer(chosen, requiredEquity, 1, 4) : null;

  return (
    <DrillFrame title={`Pot ${spot.pot}bb, villain bets ${spot.bet}bb.`}
      subtitle="Required equity">
      <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.85, margin: "0 0 18px 0" }}>
        How much equity do you need to call?
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {choices.map(c => (
          <ChoiceButton key={c}
            label={`${c}%`}
            isCorrect={c === Math.round(requiredEquity)}
            isChosen={c === chosen}
            revealed={revealed}
            onClick={() => pick(c)}/>
        ))}
      </div>

      {revealed && (
        <>
          <FeedbackBox
            grade={grade}
            trueValue={requiredEquity}
            suffix="%"
            explanation={
              <>
                You're calling {spot.bet}bb into a final pot of {totalAfter}bb, so required equity = {spot.bet}/{totalAfter} = <strong>{requiredEquity}%</strong>. Pot odds: {ratio}.
              </>
            }
          />
          <NextButton onClick={next}/>
        </>
      )}
    </DrillFrame>
  );
}
