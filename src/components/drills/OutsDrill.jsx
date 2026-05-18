import { useState, useMemo, useRef, useEffect } from "react";
import { equityFromOuts, gradeAnswer } from "../../lib/oddsCalc.js";
import { DrillFrame, NumberInput, FeedbackBox, NextButton } from "./DrillShared.jsx";

const DRAW_TYPES = [
  { name: "Flush draw", outs: 9, explanation: "9 cards of your suit remaining" },
  { name: "Open-ended straight draw", outs: 8, explanation: "8 cards complete the straight on either end" },
  { name: "Gutshot straight draw", outs: 4, explanation: "4 cards complete the inside straight" },
  { name: "Flush draw + gutshot", outs: 12, explanation: "9 flush outs + 4 gutshot outs − 1 overlap = 12" },
  { name: "Flush draw + open-ended", outs: 15, explanation: "9 flush outs + 8 straight outs − 2 overlaps = 15" },
  { name: "Two overcards", outs: 6, explanation: "3 of each overcard, assuming both pair gives you the best hand" },
  { name: "Top pair, kicker draw", outs: 3, explanation: "3 cards pair your kicker (rough estimate)" },
  { name: "Set, drawing to full house or quads", outs: 7, explanation: "Pairing the board (3 outs each for two board cards) or 1 quad" },
  { name: "Pocket pair, drawing to a set", outs: 2, explanation: "Just the two remaining cards of your rank" },
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

  const streetLabel = spot.street === "flop" ? "with two cards to come (flop)" : "with one card to come (turn)";

  return (
    <DrillFrame title={`${spot.draw.name}, ${streetLabel}`} subtitle="Outs and equity">
      {stage === "outs" && (
        <>
          <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.85, margin: "0 0 18px 0" }}>
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
              Next →
            </button>
          </div>
        </>
      )}

      {(stage === "equity" || stage === "done") && (
        <>
          <div style={{
            marginBottom: 18, padding: "10px 14px",
            background: outsGrade === "exact"
              ? "rgba(127,198,154,0.08)"
              : "rgba(224,122,95,0.08)",
            borderLeft: `2px solid ${outsGrade === "exact" ? "#7fc69a" : "#e07a5f"}`,
            borderRadius: 4, fontSize: 13,
          }}>
            You answered <strong>{outsAnswer}</strong> outs. True: <strong>{trueOuts}</strong> ({spot.draw.explanation}).
          </div>

          <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.85, margin: "0 0 14px 0" }}>
            Now: what's your equity to the river? (Use the Rule of 4 and 2 if you like.)
          </p>

          {stage === "equity" && (
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
              />
              <NextButton onClick={next}/>
            </>
          )}
        </>
      )}
    </DrillFrame>
  );
}
