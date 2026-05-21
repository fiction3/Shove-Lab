import { useState, useMemo, useRef, useEffect } from "react";
import { potOdds, gradeAnswer } from "../../lib/oddsCalc.js";
import { DrillFrame, ChoiceButton, FeedbackBox, NextButton, HintBox } from "./DrillShared.jsx";

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

      {!revealed && (
        <HintBox>
          <strong>Required equity = (your call) / (pot after your call)</strong>.<br/>
          The "pot after your call" includes the original pot, villain's bet, and your call. Smaller bets relative to the pot mean you need less equity.
        </HintBox>
      )}

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
            mathWalkthrough={[
              {
                label: "Step 1 — What's the final pot after your call?",
                formula: `pot + villain bet + your call = ${spot.pot} + ${spot.bet} + ${spot.bet}`,
                value: `= ${totalAfter}bb`,
                note: "All three contributions are now in the pot.",
              },
              {
                label: "Step 2 — Required equity is your call as a fraction of that final pot",
                formula: `${spot.bet} / ${totalAfter}`,
                value: `= ${requiredEquity}%`,
                note: "If your hand has at least this much equity vs villain's range, calling is +EV.",
              },
              {
                label: "Step 3 — Sanity-check via pot odds",
                formula: `pot odds = ${ratio}`,
                value: null,
                note: `${ratio} odds = ${requiredEquity}% required equity. The two are the same thing in different units.`,
              },
            ]}
            eli7={[
              `"Equity" just means: out of 100 tries, how many do I need to win for this call to pay off? We work it out from the money.`,
              `First, how big is the pot once your call goes in? Add the three pieces: ${spot.pot} (already there) + ${spot.bet} (villain's bet) + ${spot.bet} (your call) = ${totalAfter}bb total.`,
              `Now, what slice of that pot is your own ${spot.bet}bb? Divide: ${spot.bet} ÷ ${totalAfter} = ${(spot.bet / totalAfter).toFixed(2)}, which is the same as ${requiredEquity} out of 100, or ${requiredEquity}%.`,
              `So you need to win about ${requiredEquity} times out of 100 to break even. Win more often than that and the call makes money over time.`,
            ]}
          />
          <NextButton onClick={next}/>
        </>
      )}
    </DrillFrame>
  );
}
