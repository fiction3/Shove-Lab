import { useState, useMemo, useRef, useEffect } from "react";
import { DrillFrame, ChoiceButton, FeedbackBox, NextButton } from "./DrillShared.jsx";
import TritonCard from "../TritonCard.jsx";

// Sklansky / Chen-style hand strength ordering for heads-up preflop.
// We use this as the "truth" for the ranking drill. Higher index = stronger.
// Compressed list of the most commonly-confused borderline pairs.
const STRENGTH_PAIRS = [
  // [strongerHand, weakerHand, explanation]
  ["AKs", "AKo", "Suited adds ~2% equity vs random; non-trivial over volume."],
  ["AKo", "AQs", "Top pair top kicker dominates AQ family preflop."],
  ["AQs", "AQo", "Suitedness premium on the same rank."],
  ["AJs", "KQs", "Ace high beats king high in dominated spots; AJs ~52% vs KQs."],
  ["KQs", "KJs", "Same suit + same king, kicker decides — Q kicker dominates J."],
  ["AKo", "JJ", "Slight edge to JJ HU (~57-43), but AKo plays better multiway."],
  ["AKs", "TT", "TT is a small favorite HU; AKs is the standard race partner."],
  ["QQ", "AKo", "QQ is ~56% vs AKo — pair holds the edge."],
  ["JJ", "AQs", "JJ ~54% vs AQs HU."],
  ["TT", "AJs", "TT ~55% vs AJs HU."],
  ["99", "AQo", "99 ~55% vs AQo — pair vs overcards classic."],
  ["88", "ATs", "88 ~54% vs ATs HU."],
  ["77", "A9s", "77 ~54% vs A9s — small pair edges out medium suited ace."],
  ["66", "KQs", "66 is a ~53% favorite HU."],
  ["55", "QJs", "55 ~52% vs QJs."],
  ["44", "T9s", "44 ~53% vs T9s — pair vs suited connector."],
  ["A5s", "A5o", "Suitedness adds a flush draw and ~2% equity."],
  ["A5s", "K9s", "A high beats K high even with low kicker, suited equal."],
  ["KTs", "K9o", "Both same king; suited + better kicker wins easily."],
  ["KQo", "JTs", "Big card edges out connector ~55-45 HU."],
  ["QJs", "Q9o", "Same Q, suited + better kicker — large edge."],
  ["JTs", "J9s", "Connector edges gapper — both suited."],
  ["T9s", "98s", "Higher connector wins."],
  ["98s", "87s", "Higher connector wins."],
  ["A2s", "K2s", "Ace high beats king high; both suited, dominant card decides."],
  ["AJo", "KQo", "AJo ~57% vs KQo HU — dominating ace beats king-queen."],
  ["AQo", "JJ", "JJ ~57% vs AQo — overpair vs two overs."],
  ["KK", "AKs", "KK ~66% vs AKs — overpair vs two overs (better matchup for KK)."],
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
  const explanation = pair[2];

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
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24, marginBottom: 12, color: "#d4a13b",
              }}>
                {item.hand}
              </div>
              <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <TritonCard card={item.cards[0]} size={70}/>
                <TritonCard card={item.cards[1]} size={70}/>
              </div>
            </button>
          );
        })}
      </div>

      {revealed && (
        <>
          <FeedbackBox
            grade={chosen === correctSide ? "exact" : "wrong"}
            trueValue={strongerHand}
            suffix=""
            explanation={explanation}
          />
          <NextButton onClick={next}/>
        </>
      )}
    </DrillFrame>
  );
}
