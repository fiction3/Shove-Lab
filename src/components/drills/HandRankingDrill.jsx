import { useState, useMemo, useRef, useEffect } from "react";
import { DrillFrame, ChoiceButton, NextButton } from "./DrillShared.jsx";
import TritonCard from "../TritonCard.jsx";
import useMediaQuery from "../../lib/useMediaQuery.js";

// Sklansky / Chen-style hand strength ordering for heads-up preflop.
// Each entry: [strongerHand, weakerHand, equityPctOfStronger, explanation]
// Equities are HU all-in preflop, from standard equity calculations.
const STRENGTH_PAIRS = [
  // [strongerHand, weakerHand, equityOfStronger, explanation]
  ["AKs", "AKo", 52, "Same ranks, but suitedness adds ~2% equity from flush potential."],
  ["AKo", "AQs", 56, "AK dominates AQ — when an A or K hits, AK is ahead."],
  ["AQs", "AQo", 52, "Suitedness premium on the same rank."],
  ["AJs", "KQs", 52, "Ace high beats king high in dominated spots."],
  ["KQs", "KJs", 56, "Same suit + same king; Q kicker dominates J kicker."],
  ["JJ", "AKo", 57, "Pair edges out two overcards in a coinflip."],
  ["TT", "AKs", 54, "TT is a small favorite — the 'race' is real but the pair leads."],
  ["QQ", "AKo", 56, "Overpair vs two overs — QQ holds the edge."],
  ["JJ", "AQs", 54, "Overpair vs over+kicker is still ahead."],
  ["TT", "AJs", 55, "Pocket Tens favored over AJs HU."],
  ["99", "AQo", 55, "Small pair beats two overcards in a coinflip."],
  ["88", "ATs", 54, "Pair holds slight edge over medium suited ace."],
  ["77", "A9s", 54, "Small pair edges out medium suited ace."],
  ["66", "KQs", 53, "Even small pairs beat unpaired big cards HU."],
  ["55", "QJs", 52, "Barely — 55 is the smallest 'pair vs connector' favorite."],
  ["44", "T9s", 53, "Pair beats suited connector slightly."],
  ["A5s", "A5o", 52, "Suitedness adds a flush draw and ~2% equity."],
  ["A5s", "K9s", 60, "Ace high crushes king high even with low kicker."],
  ["KTs", "K9o", 65, "Same king; suited + better kicker is a big edge."],
  ["KQo", "JTs", 55, "Big card edges out connector — KQ has higher pair potential."],
  ["QJs", "Q9o", 67, "Dominated kickers + lost suitedness is brutal."],
  ["JTs", "J9s", 66, "Higher connector, same suitedness."],
  ["T9s", "98s", 59, "Higher connector wins."],
  ["98s", "87s", 58, "Higher connector wins."],
  ["A2s", "K2s", 60, "Ace high dominates king high; both suited."],
  ["AJo", "KQo", 57, "AJo dominates KQo — when ace hits, AJ is ahead."],
  ["JJ", "AQo", 57, "Pair vs two overs — JJ has the edge."],
  ["KK", "AKs", 66, "Overpair crushes two overs in a coinflip."],
];

function randomPair() {
  return STRENGTH_PAIRS[Math.floor(Math.random() * STRENGTH_PAIRS.length)];
}

function handToCards(hand) {
  if (hand.length === 2) return [hand[0] + "s", hand[0] + "h"];
  const r1 = hand[0], r2 = hand[1], suited = hand[2] === "s";
  return suited ? [r1 + "s", r2 + "s"] : [r1 + "s", r2 + "h"];
}

/**
 * A/B comparison: which hand is stronger preflop heads-up?
 * Side-by-side card displays; user picks the favorite.
 */
export default function HandRankingDrill({ onAnswer }) {
  const isMobile = useMediaQuery(768);
  const [pair, setPair] = useState(randomPair);
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const startTime = useRef(Date.now());
  useEffect(() => { startTime.current = Date.now(); }, [pair]);

  // Randomize which side shows the stronger hand
  const [order] = useState(() => Math.random() < 0.5 ? [0, 1] : [1, 0]);
  const left = pair[order[0]];
  const right = pair[order[1]];
  const strongerHand = pair[0];
  const weakerHand = pair[1];
  const equityOfStronger = pair[2];
  const equityOfWeaker = 100 - equityOfStronger;
  const explanation = pair[3];

  const leftCards = useMemo(() => handToCards(left), [left]);
  const rightCards = useMemo(() => handToCards(right), [right]);

  function pick(side) {
    if (revealed) return;
    setChosen(side);
    setRevealed(true);
    const chosenHand = side === "left" ? left : right;
    const correct = chosenHand === strongerHand;
    const timeMs = Date.now() - startTime.current;
    onAnswer?.({
      drill: "hand-rankings",
      grade: correct ? "exact" : "wrong",
      timeMs,
      userValue: chosenHand,
      trueValue: strongerHand,
    });
  }

  function next() {
    // Force re-mount of the component to also re-randomize 'order'
    setPair(randomPair()); setChosen(null); setRevealed(false);
  }

  const correctSide = strongerHand === left ? "left" : "right";

  return (
    <DrillFrame title="Which is stronger preflop, heads-up?" subtitle="Hand rankings">
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 16, marginBottom: 16,
      }}>
        {[
          { side: "left", hand: left, cards: leftCards },
          { side: "right", hand: right, cards: rightCards },
        ].map(item => {
          const isCorrect = item.side === correctSide;
          const isChosen = item.side === chosen;
          let bg = "transparent", borderColor = "rgba(232,227,211,0.25)";
          if (revealed) {
            if (isCorrect) { bg = "rgba(127,198,154,0.15)"; borderColor = "#7fc69a"; }
            else if (isChosen) { bg = "rgba(224,122,95,0.12)"; borderColor = "#e07a5f"; }
          }
          return (
            <button key={item.side}
              onClick={() => pick(item.side)}
              disabled={revealed}
              style={{
                background: bg, border: `1px solid ${borderColor}`,
                borderRadius: 10, padding: 18,
                cursor: revealed ? "default" : "pointer",
                fontFamily: "inherit", color: "inherit",
                transition: "all 0.15s",
              }}>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 22, fontWeight: 700, letterSpacing: "0.02em",
                marginBottom: 12, color: "#d4a13b",
              }}>
                {item.hand}
              </div>
              <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <TritonCard card={item.cards[0]} size={isMobile ? 54 : 70}/>
                <TritonCard card={item.cards[1]} size={isMobile ? 54 : 70}/>
              </div>
            </button>
          );
        })}
      </div>

      {revealed && (
        <>
          <EquityFeedback
            isCorrect={chosen === correctSide}
            strongerHand={strongerHand}
            weakerHand={weakerHand}
            equityOfStronger={equityOfStronger}
            equityOfWeaker={equityOfWeaker}
            explanation={explanation}
          />
          <NextButton onClick={next}/>
        </>
      )}
    </DrillFrame>
  );
}

/**
 * Custom feedback block for the Hand Rankings drill — shows the verdict
 * prominently, the two competing hands as a side-by-side equity bar,
 * and a one-line explanation.
 */
function EquityFeedback({ isCorrect, strongerHand, weakerHand, equityOfStronger, equityOfWeaker, explanation }) {
  const color = isCorrect ? "#7fc69a" : "#e07a5f";
  const label = isCorrect ? "Correct" : "Off";
  const bgColor = isCorrect ? "rgba(127,198,154,0.08)" : "rgba(224,122,95,0.08)";

  return (
    <div style={{
      marginTop: 22, padding: 18,
      background: bgColor,
      borderLeft: `2px solid ${color}`,
      borderRadius: 4,
    }}>
      {/* Verdict header */}
      <div style={{
        display: "flex", alignItems: "baseline", gap: 12,
        marginBottom: 14, flexWrap: "wrap",
      }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 22, color, fontWeight: 600,
        }}>
          {label}
        </span>
        <span style={{ fontSize: 13, opacity: 0.7 }}>
          The stronger hand is <strong style={{ color: "#d4a13b" }}>{strongerHand}</strong>
        </span>
      </div>

      {/* Equity stat — two big numbers + a bar showing the split */}
      <div style={{ marginBottom: 14 }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "baseline", marginBottom: 6, gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 22, fontWeight: 700,
              color: "#7fc69a", letterSpacing: "-0.02em",
            }}>
              {equityOfStronger}%
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#d4a13b" }}>
              {strongerHand}
            </span>
          </div>
          <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: "0.1em", fontWeight: 600 }}>
            vs
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.85 }}>
              {weakerHand}
            </span>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 22, fontWeight: 700,
              color: "rgba(232,227,211,0.7)", letterSpacing: "-0.02em",
            }}>
              {equityOfWeaker}%
            </span>
          </div>
        </div>
        {/* Visual bar showing the equity split */}
        <div style={{
          height: 6, borderRadius: 3, overflow: "hidden",
          display: "flex",
          background: "rgba(232,227,211,0.06)",
        }}>
          <div style={{
            width: `${equityOfStronger}%`,
            background: "linear-gradient(90deg, #7fc69a, #5a8a40)",
          }}/>
          <div style={{
            width: `${equityOfWeaker}%`,
            background: "rgba(232,227,211,0.18)",
          }}/>
        </div>
        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 6, fontStyle: "italic" }}>
          Heads-up all-in equity, preflop
        </div>
      </div>

      {/* Explanation */}
      {explanation && (
        <div style={{ fontSize: 13, lineHeight: 1.55, opacity: 0.88 }}>
          {explanation}
        </div>
      )}
    </div>
  );
}
