import { useState, useMemo, useRef, useEffect } from "react";
import { potOdds, CANONICAL_RATIOS } from "../../lib/oddsCalc.js";
import { DrillFrame, ChoiceButton, FeedbackBox, NextButton, HintBox } from "./DrillShared.jsx";

/**
 * Generate a spot whose true pot-odds ratio snaps neatly to one of our
 * canonical labels (2:1, 3:1, etc.). We choose a target ratio and back-solve
 * the bet size so the math is clean — better drill experience than random
 * fractions of pot.
 */
function randomSpot() {
  const target = CANONICAL_RATIOS[Math.floor(Math.random() * CANONICAL_RATIOS.length)];
  // "Pot is P, villain bets B" → after villain's bet, total pot = P + B and the call is B.
  // Pot odds ratio = (P + B) / B   ⇒   P = B * (ratio − 1).
  const bet = [2, 3, 4, 5, 6, 8, 10][Math.floor(Math.random() * 7)];
  const pot = +(bet * (target.value - 1)).toFixed(1);
  if (pot < 2) return randomSpot(); // avoid trivially small pots
  return { pot, bet, targetRatio: target };
}

function makeChoices(targetRatio) {
  // Pick the correct ratio plus three nearby distractors.
  const idx = CANONICAL_RATIOS.findIndex(r => r.value === targetRatio.value);
  const pool = new Set([targetRatio.label]);
  let offset = 1;
  while (pool.size < 4 && offset < 10) {
    if (CANONICAL_RATIOS[idx - offset]) pool.add(CANONICAL_RATIOS[idx - offset].label);
    if (CANONICAL_RATIOS[idx + offset] && pool.size < 4) pool.add(CANONICAL_RATIOS[idx + offset].label);
    offset++;
  }
  return CANONICAL_RATIOS
    .filter(r => pool.has(r.label))
    .map(r => r.label);
}

/**
 * Pot Odds Drill: given pot + villain bet, identify the ratio the pot
 * is offering. Answer is a RATIO (e.g. "3:1"), not a percentage.
 */
export default function PotOddsDrill({ onAnswer }) {
  const [spot, setSpot] = useState(randomSpot);
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const startTime = useRef(Date.now());
  useEffect(() => { startTime.current = Date.now(); }, [spot]);

  const { requiredEquity } = useMemo(
    () => potOdds(spot.pot + spot.bet, spot.bet),
    [spot]
  );
  const correctLabel = spot.targetRatio.label;
  const choices = useMemo(() => makeChoices(spot.targetRatio), [spot]);

  function pick(label) {
    if (revealed) return;
    setChosen(label);
    setRevealed(true);
    const grade = label === correctLabel ? "exact" : "wrong";
    const timeMs = Date.now() - startTime.current;
    onAnswer?.({ drill: "pot-odds", grade, timeMs, userValue: label, trueValue: correctLabel });
  }

  function next() {
    setSpot(randomSpot()); setChosen(null); setRevealed(false);
  }

  const grade = revealed ? (chosen === correctLabel ? "exact" : "wrong") : null;

  const walkthrough = [
    {
      label: "Step 1 — What's the pot when you have to call?",
      formula: `pot + villain's bet = ${spot.pot} + ${spot.bet}`,
      value: `= ${spot.pot + spot.bet}bb`,
      note: "Villain's bet is now part of the pot; you'd be calling INTO this total.",
    },
    {
      label: "Step 2 — Express it as a ratio (pot : your call)",
      formula: `${spot.pot + spot.bet} : ${spot.bet}`,
      value: `= ${(spot.pot + spot.bet) / spot.bet}:1`,
      note: "Divide both sides by your call amount to put it in X:1 form.",
    },
    {
      label: "Step 3 — Turn the ratio into a percentage",
      formula: `final pot = ${spot.pot + spot.bet} + ${spot.bet} = ${spot.pot + 2 * spot.bet}bb`,
      value: `${spot.bet} / ${spot.pot + 2 * spot.bet} = ${requiredEquity}%`,
      note: `The ratio (${correctLabel}) compares the ${spot.pot + spot.bet}bb you can win to your ${spot.bet}bb call. To get the percentage you need to win, add your own call to the pot (${spot.pot + spot.bet} + ${spot.bet} = ${spot.pot + 2 * spot.bet}bb final pot), then divide your call by that total. Both describe the same break-even point.`,
    },
  ];

  return (
    <DrillFrame
      title={`Pot is ${spot.pot}bb. Villain bets ${spot.bet}bb.`}
      subtitle="Pot odds"
    >
      <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.85, margin: "0 0 18px 0" }}>
        What odds is the pot offering you?
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {choices.map(label => (
          <ChoiceButton key={label}
            label={label}
            isCorrect={label === correctLabel}
            isChosen={label === chosen}
            revealed={revealed}
            onClick={() => pick(label)}/>
        ))}
      </div>

      {!revealed && (
        <HintBox>
          <strong>Pot odds = (current pot including villain's bet) : (your call amount)</strong>.<br/>
          Add villain's bet to the existing pot, then divide by your call to get the ratio.
          A ratio of <strong>X:1</strong> means you're risking 1 unit to win X. Higher ratio = better price.
        </HintBox>
      )}

      {revealed && (
        <>
          <FeedbackBox
            grade={grade}
            trueValue={correctLabel}
            suffix=""
            explanation={
              <>
                You're calling <strong>{spot.bet}bb</strong> to win a pot of <strong>{spot.pot + spot.bet}bb</strong>.
                Ratio: <strong>{correctLabel}</strong>. As a percentage that's <strong>{requiredEquity}%</strong> required equity to break even.
              </>
            }
            mathWalkthrough={walkthrough}
            eli7={[
              `There's ${spot.pot + spot.bet}bb sitting on the table, and it costs you ${spot.bet}bb to stay in.`,
              `So you're risking ${spot.bet} to win ${spot.pot + spot.bet}. How many times bigger is the prize than the price? Divide: ${spot.pot + spot.bet} ÷ ${spot.bet} = ${(spot.pot + spot.bet) / spot.bet}. (Check it the other way: ${spot.bet} × ${(spot.pot + spot.bet) / spot.bet} = ${spot.pot + spot.bet}.) That's why it's written ${correctLabel} — ${(spot.pot + spot.bet) / spot.bet} back for every 1 you put in.`,
              `You don't need to win every time. You just need to win often enough that the wins cover the losses — and the bigger that first number, the less often you need to win.`,
            ]}
          />
          <NextButton onClick={next}/>
        </>
      )}
    </DrillFrame>
  );
}
