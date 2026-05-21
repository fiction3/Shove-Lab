import { useState, useMemo, useRef, useEffect } from "react";
import { MATCHUPS, getMatchupEquity } from "../../data/equityMatchups.js";
import { gradeAnswer } from "../../lib/oddsCalc.js";
import { DrillFrame, ChoiceButton, FeedbackBox, NextButton, HintBox } from "./DrillShared.jsx";
import TritonCard from "../TritonCard.jsx";
import useMediaQuery from "../../lib/useMediaQuery.js";

const KEYS = Object.keys(MATCHUPS);

// Expand a hand code into representative cards (for display only).
function handToCards(hand) {
  if (hand.length === 2) {
    // Pair: same rank, different suits
    return [hand[0] + "s", hand[0] + "h"];
  }
  const r1 = hand[0], r2 = hand[1], suited = hand[2] === "s";
  return suited ? [r1 + "s", r2 + "s"] : [r1 + "s", r2 + "h"];
}

function randomMatchup() {
  return KEYS[Math.floor(Math.random() * KEYS.length)];
}

function makeChoices(trueEq) {
  const buckets = [trueEq, trueEq - 8, trueEq + 8, trueEq - 15];
  const choices = buckets.map(v => Math.max(5, Math.min(95, Math.round(v))));
  // Ensure unique
  const uniq = [...new Set(choices)];
  // If we collapsed, pad with neighbors
  while (uniq.length < 4) {
    const candidate = Math.max(5, Math.min(95, Math.round(trueEq + (Math.random() * 20 - 10))));
    if (!uniq.includes(candidate)) uniq.push(candidate);
  }
  return uniq.sort((a, b) => a - b);
}

/**
 * Hand-vs-hand drill: show two hole-card pairs (hero + villain), user picks
 * hero's equity percentage from 4 choices.
 */
export default function HandVsHandDrill({ onAnswer }) {
  const isMobile = useMediaQuery(768);
  const [matchKey, setMatchKey] = useState(randomMatchup);
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const startTime = useRef(Date.now());
  useEffect(() => { startTime.current = Date.now(); }, [matchKey]);

  const [heroHand, villainHand] = matchKey.split("_vs_");
  const heroCards = useMemo(() => handToCards(heroHand), [heroHand]);
  const villainCards = useMemo(() => handToCards(villainHand), [villainHand]);
  const trueEq = useMemo(() => getMatchupEquity(heroHand, villainHand), [heroHand, villainHand]);
  const choices = useMemo(() => makeChoices(trueEq), [trueEq]);

  function pick(val) {
    if (revealed) return;
    setChosen(val);
    setRevealed(true);
    const grade = gradeAnswer(val, trueEq, 2, 6);
    const timeMs = Date.now() - startTime.current;
    onAnswer?.({ drill: "hand-vs-hand", grade, timeMs, userValue: val, trueValue: trueEq });
  }
  function next() {
    setMatchKey(randomMatchup()); setChosen(null); setRevealed(false);
  }

  const grade = revealed ? gradeAnswer(chosen, trueEq, 2, 6) : null;

  return (
    <DrillFrame title="Heads-up preflop equity" subtitle="Hand vs hand">
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        gap: 24, margin: "20px 0 26px 0",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.2em",
            textTransform: "uppercase", opacity: 0.5, marginBottom: 8,
          }}>
            Hero ({heroHand})
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            <TritonCard card={heroCards[0]} size={isMobile ? 54 : 72}/>
            <TritonCard card={heroCards[1]} size={isMobile ? 54 : 72}/>
          </div>
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 26, color: "rgba(232,227,211,0.4)",
        }}>
          vs
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.2em",
            textTransform: "uppercase", opacity: 0.5, marginBottom: 8,
          }}>
            Villain ({villainHand})
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            <TritonCard card={villainCards[0]} size={isMobile ? 54 : 72}/>
            <TritonCard card={villainCards[1]} size={isMobile ? 54 : 72}/>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.85, margin: "0 0 16px 0" }}>
        What's hero's equity?
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {choices.map(c => (
          <ChoiceButton key={c}
            label={`${c}%`}
            isCorrect={c === Math.round(trueEq)}
            isChosen={c === chosen}
            revealed={revealed}
            onClick={() => pick(c)}/>
        ))}
      </div>

      {!revealed && (
        <HintBox>
          <strong>Four key matchup shapes:</strong><br/>
          • Pair over pair (AA vs KK): ~80% / 20%<br/>
          • Overpair vs two overcards (TT vs AK): ~55% / 45% — the classic race<br/>
          • Pair vs two undercards (88 vs 76s): ~80% / 20%<br/>
          • Dominated ace (AK vs AQ): ~73% / 27%
        </HintBox>
      )}

      {revealed && (
        <>
          <FeedbackBox
            grade={grade}
            trueValue={trueEq}
            suffix="%"
            explanation={
              <>
                <strong>{heroHand}</strong> has <strong>{trueEq}%</strong> equity vs <strong>{villainHand}</strong> heads-up preflop ({(100 - trueEq).toFixed(1)}% for villain).
              </>
            }
            eli7={[
              `"Equity" here just means: if these two hands ran all the way to the end ${100} times, how many would ${heroHand} win? The answer is about ${trueEq} of them — so ${trueEq}%.`,
              `That leaves ${(100 - trueEq).toFixed(0)} for ${villainHand} (100 − ${trueEq} = ${(100 - trueEq).toFixed(0)}).`,
              trueEq >= 80
                ? `${trueEq}% is a huge lead — this is a hand that's crushing the other (think a big pair against undercards).`
                : trueEq >= 60
                ? `${trueEq}% is a comfortable lead, but not a lock — the other hand still wins sometimes.`
                : trueEq >= 45
                ? `Around ${trueEq}% is close to a coin flip — both hands win a meaningful share.`
                : `At ${trueEq}%, ${heroHand} is actually the underdog here — it wins less than half the time.`,
            ]}
          />
          <NextButton onClick={next}/>
        </>
      )}
    </DrillFrame>
  );
}
