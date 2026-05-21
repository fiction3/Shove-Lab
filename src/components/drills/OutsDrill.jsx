import { useState, useMemo, useRef, useEffect } from "react";
import { equityFromOuts, gradeAnswer } from "../../lib/oddsCalc.js";
import { DrillFrame, NumberInput, FeedbackBox, NextButton, HintBox } from "./DrillShared.jsx";

const DRAW_TYPES = [
  {
    name: "Flush draw",
    description: "You have four cards of the same suit. One more of that suit completes a flush.",
    outs: 9,
    explanation: "13 cards of your suit total minus 4 you can already see (your 2 hole cards + 2 on the board) = 9 left in the deck.",
  },
  {
    name: "Open-ended straight draw",
    description: "You have four cards in a row (like 7-8-9-T). Either end could complete the straight.",
    outs: 8,
    explanation: "4 cards on one end + 4 on the other = 8 cards that make a straight.",
  },
  {
    name: "Gutshot straight draw",
    description: "You have four cards toward a straight but with a gap in the middle (like 7-8-T-J). Only one rank fills the gap.",
    outs: 4,
    explanation: "Only the 4 cards of one specific rank complete the inside straight.",
  },
  {
    name: "Combo draw — flush + gutshot",
    description: "You have a flush draw AND a gutshot straight draw at the same time. Big draw, many outs.",
    outs: 12,
    explanation: "9 flush outs + 4 gutshot outs − 1 card that's both (the one filling the gap that's also your flush suit) = 12.",
  },
  {
    name: "Combo draw — flush + open-ended",
    description: "You have a flush draw AND an open-ended straight draw at the same time. Monster draw.",
    outs: 15,
    explanation: "9 flush outs + 8 straight outs − 2 cards that are both = 15.",
  },
  {
    name: "Two overcards",
    description: "Your two hole cards are both higher than every card on the board (like AK on a 9-7-4 flop). Pairing either gives you top pair.",
    outs: 6,
    explanation: "3 cards remaining of each rank × 2 ranks = 6 cards that pair either of your overcards.",
  },
  {
    name: "Top pair looking to improve kicker",
    description: "You have top pair, but your second card (kicker) is weak. Pairing your kicker gives you two pair.",
    outs: 3,
    explanation: "3 remaining cards of your kicker's rank.",
  },
  {
    name: "Three of a kind, looking for full house or quads",
    description: "You have three of a kind (like pocket 7s on a board with one 7). You'd improve if the board pairs up, or if the last 7 comes.",
    outs: 7,
    explanation: "3 cards each that pair the two board cards (6 total) + 1 remaining card of your rank (quads) = 7.",
  },
  {
    name: "Pocket pair looking for three of a kind",
    description: "You have a pocket pair (like pocket 8s) and you want to hit one more for three of a kind (a set).",
    outs: 2,
    explanation: "Only 2 cards of your rank remain in the deck.",
  },
];

const STREETS = ["flop", "turn"];

function randomSpot() {
  const draw = DRAW_TYPES[Math.floor(Math.random() * DRAW_TYPES.length)];
  const street = STREETS[Math.floor(Math.random() * 2)];
  return { draw, street };
}

/**
 * Drill: describe a draw, ask user for both outs and equity. Two-step.
 */
export default function OutsDrill({ onAnswer }) {
  const [spot, setSpot] = useState(randomSpot);
  const [outsAnswer, setOutsAnswer] = useState("");
  const [equityAnswer, setEquityAnswer] = useState("");
  const [stage, setStage] = useState("outs"); // "outs" -> "equity" -> "done"
  const startTime = useRef(Date.now());
  useEffect(() => { startTime.current = Date.now(); }, [spot]);

  const trueOuts = spot.draw.outs;
  const eqInfo = useMemo(() => equityFromOuts(trueOuts, spot.street), [trueOuts, spot.street]);

  function submitOuts() {
    const v = parseInt(outsAnswer, 10);
    if (isNaN(v)) return;
    setStage("equity");
  }

  function submitEquity() {
    const userEq = parseFloat(equityAnswer);
    const userOuts = parseInt(outsAnswer, 10);
    if (isNaN(userEq) || isNaN(userOuts)) return;
    // Grade based on equity primarily (using exact value, generous tolerance)
    const grade = gradeAnswer(userEq, eqInfo.exact, 2, 6);
    const timeMs = Date.now() - startTime.current;
    setStage("done");
    onAnswer?.({
      drill: "outs", grade, timeMs,
      userValue: { outs: userOuts, equity: userEq },
      trueValue: { outs: trueOuts, equity: eqInfo.exact },
    });
  }

  function next() {
    setSpot(randomSpot()); setOutsAnswer(""); setEquityAnswer(""); setStage("outs");
  }

  const outsGrade = stage !== "outs"
    ? gradeAnswer(parseInt(outsAnswer, 10), trueOuts, 0, 1)
    : null;
  const equityGrade = stage === "done"
    ? gradeAnswer(parseFloat(equityAnswer), eqInfo.exact, 2, 6)
    : null;

  const streetLabel = spot.street === "flop" ? "Flop (turn and river still to come)" : "Turn (only the river left)";

  return (
    <DrillFrame title={spot.draw.name} subtitle={streetLabel}>
      {stage === "outs" && (
        <>
          <p style={{
            fontSize: 14, lineHeight: 1.6, opacity: 0.9,
            margin: "0 0 14px 0",
          }}>
            {spot.draw.description}
          </p>
          <p style={{
            fontSize: 14, lineHeight: 1.6, opacity: 0.85,
            margin: "0 0 18px 0", fontWeight: 600,
          }}>
            How many outs do you have?
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <NumberInput value={outsAnswer} onChange={setOutsAnswer}
              onSubmit={submitOuts} placeholder="e.g. 9" suffix="outs"/>
            <button onClick={submitOuts} style={{
              background: "#d4a13b", color: "#0a1816", border: "none",
              padding: "12px 22px", borderRadius: 6, cursor: "pointer",
              fontSize: 12, letterSpacing: "0.18em",
              textTransform: "uppercase", fontWeight: 700,
            }}>
              Submit
            </button>
          </div>
          <HintBox>
            <strong>An "out" is any unseen card that improves your hand to a likely winner.</strong>
            {" "}Common counts: flush draw = 9, open-ended straight = 8, gutshot = 4, two overcards = 6. Combine draws — but subtract overlaps (cards that complete more than one).
          </HintBox>
        </>
      )}

      {(stage === "equity" || stage === "done") && (
        <>
          <div style={{
            marginTop: 8, marginBottom: 18, padding: 16,
            background: outsGrade === "exact"
              ? "rgba(127,198,154,0.08)"
              : "rgba(224,122,95,0.08)",
            borderLeft: `2px solid ${outsGrade === "exact" ? "#7fc69a" : "#e07a5f"}`,
            borderRadius: 4,
          }}>
            <div style={{
              display: "flex", alignItems: "baseline", gap: 12,
              marginBottom: 8, flexWrap: "wrap",
            }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20,
                color: outsGrade === "exact" ? "#7fc69a" : "#e07a5f",
                fontWeight: 600,
              }}>
                {outsGrade === "exact" ? "Correct" : "Off"}
              </span>
              <span style={{ fontSize: 13, opacity: 0.7 }}>
                You answered <strong>{outsAnswer}</strong> outs · True: <strong style={{ color: "#d4a13b" }}>{trueOuts}</strong>
              </span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.55, opacity: 0.85 }}>
              {spot.draw.explanation}
            </div>
          </div>

          <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.85, margin: "0 0 14px 0" }}>
            Now: what's your equity to the river? (Use the Rule of 4 and 2 if you like.)
          </p>

          {stage === "equity" && (
            <>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <NumberInput value={equityAnswer} onChange={setEquityAnswer}
                  onSubmit={submitEquity} placeholder="e.g. 36" suffix="%"/>
                <button onClick={submitEquity} style={{
                  background: "#d4a13b", color: "#0a1816", border: "none",
                  padding: "12px 22px", borderRadius: 6, cursor: "pointer",
                  fontSize: 12, letterSpacing: "0.18em",
                  textTransform: "uppercase", fontWeight: 700,
                }}>
                  Submit
                </button>
              </div>
              <HintBox>
                {spot.street === "flop" ? (
                  <>
                    <strong>Rule of 4 (flop → river):</strong> equity ≈ outs × 4. Quick mental shortcut, accurate within ~2% for under 12 outs (overestimates above that).
                  </>
                ) : (
                  <>
                    <strong>Rule of 2 (turn → river):</strong> equity ≈ outs × 2. Very accurate — usually within ~0.5%.
                  </>
                )}
              </HintBox>
            </>
          )}

          {stage === "done" && (
            <>
              <FeedbackBox
                grade={equityGrade}
                trueValue={eqInfo.exact}
                suffix="%"
                explanation={
                  <>
                    Rule of {spot.street === "flop" ? "4" : "2"}: {trueOuts} × {spot.street === "flop" ? 4 : 2} = <strong>{eqInfo.approx}%</strong> (estimate).
                    Exact: <strong>{eqInfo.exact}%</strong>.
                    The rule {eqInfo.error > 0 ? "overestimates" : "underestimates"} by {Math.abs(eqInfo.error)}% here.
                  </>
                }
                mathWalkthrough={
                  spot.street === "flop"
                    ? [
                        { label: "Rule of 4 (flop → river)", formula: `outs × 4 = ${trueOuts} × 4`, value: `≈ ${eqInfo.approx}%`, note: "Quick mental shortcut, good within ~2% for under 12 outs." },
                        { label: "Exact formula", formula: `1 − C(47−outs, 2) / C(47, 2)`, value: `= ${eqInfo.exact}%`, note: "47 unseen cards after the flop. C(n,2) is 'n choose 2', counting how many two-card combinations miss your outs." },
                        { label: "Discrepancy", formula: `${eqInfo.approx} − ${eqInfo.exact}`, value: `= ${eqInfo.error}%`, note: eqInfo.error > 0 ? "Rule overestimates here — typical when out count is high." : "Rule underestimates slightly." },
                      ]
                    : [
                        { label: "Rule of 2 (turn → river)", formula: `outs × 2 = ${trueOuts} × 2`, value: `≈ ${eqInfo.approx}%`, note: "On the turn, only one card is left to come." },
                        { label: "Exact formula", formula: `outs / 46`, value: `= ${eqInfo.exact}%`, note: "46 unseen cards remain after the turn." },
                        { label: "Discrepancy", formula: `${eqInfo.approx} − ${eqInfo.exact}`, value: `= ${eqInfo.error}%`, note: "Rule of 2 is very accurate — usually within ~0.5%." },
                      ]
                }
                eli7={
                  spot.street === "flop"
                    ? [
                        `An "out" is a card that turns your hand into a winner. You have ${trueOuts} of them.`,
                        `There are two cards still to come (turn and river), so the quick trick is to multiply your outs by 4: ${trueOuts} × 4 = ${trueOuts * 4}. That's roughly ${trueOuts * 4}% — a ${trueOuts * 4} in 100 chance of hitting.`,
                        `The exact answer is ${eqInfo.exact}%, so the trick is off by only ${Math.abs(eqInfo.error)}% — close enough to use at the table.`,
                      ]
                    : [
                        `An "out" is a card that turns your hand into a winner. You have ${trueOuts} of them.`,
                        `Only one card is left to come (the river), so the quick trick is to multiply your outs by 2: ${trueOuts} × 2 = ${trueOuts * 2}. That's roughly ${trueOuts * 2}% — a ${trueOuts * 2} in 100 chance of hitting.`,
                        `The exact answer is ${eqInfo.exact}%, so the trick is off by only ${Math.abs(eqInfo.error)}% — very accurate on the turn.`,
                      ]
                }
              />
              <NextButton onClick={next}/>
            </>
          )}
        </>
      )}
    </DrillFrame>
  );
}
