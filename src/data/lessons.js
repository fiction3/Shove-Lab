// Lessons are structured data, not JSX, so they're easy to edit and add to.
// Each lesson has: id, title, subtitle, sections (array), drill link (optional).
//
// Sections are typed so the renderer knows how to display them:
//   { type: "prose", text: string }
//   { type: "example", title, body }      — highlighted callout box
//   { type: "calc", expression, result }  — numeric example, shown formatted
//   { type: "list", items: string[] }     — bullet list
//   { type: "heading", text: string }     — subsection header

export const LESSONS = [
  // ────────────────────────────────────────────────────────────────
  {
    id: "position",
    title: "Position",
    subtitle: "Why where you sit is more important than what you hold",
    estimatedMinutes: 4,
    sections: [
      { type: "prose", text: "Position is the single most leveraged variable in No-Limit Hold'em. The same hand played from the button is worth more than from under the gun — not by a little, by a lot. Understanding why is the foundation of everything that follows in this trainer." },
      { type: "heading", text: "The mechanical advantage" },
      { type: "prose", text: "When you act last on a street, you've seen what every other player did before deciding. They've revealed information; you've revealed nothing. That asymmetry is enormous. Across thousands of hands, the player who has position more often will win more chips with the same cards." },
      { type: "heading", text: "Position in short-stack MTT" },
      { type: "prose", text: "In tournament play with shallow stacks (under 20bb), position interacts with two other forces: number of players left to act, and the size of the blinds you're forced to post. The button is privileged because both blinds are forced to defend with a wider range than they'd choose freely. The small blind is interesting because you act first preflop but are heads-up, with money already invested." },
      { type: "example", title: "Concrete example", body: "Imagine 10bb in your stack. Open-shoving 87s from UTG (5 players behind) is a disaster — too many hands wake up with premiums. The same 87s from the SB (1 player behind, half a blind already invested) is a clear profitable shove. Same cards. Same stack. The position changes everything." },
      { type: "heading", text: "How to think about it" },
      { type: "prose", text: "Before every preflop decision, anchor yourself with two questions: \"How many players are behind me?\" and \"Who has already shown weakness or strength?\" Strong hands play themselves; the decisions that decide your win rate are the borderline ones, and position is what tips them one way or the other." },
    ],
    drillSuggestion: null,
  },

  // ────────────────────────────────────────────────────────────────
  {
    id: "pot-odds",
    title: "Pot Odds",
    subtitle: "Is the price worth it?",
    estimatedMinutes: 6,
    sections: [
      { type: "prose", text: "Imagine a friend offers you a bet. You put in $4. If you win, you get $12. You don't win every time — but is this a good deal? Pot odds is just the poker way of answering that exact question. It's not scary math, it's a fairness check." },
      { type: "heading", text: "What's actually happening" },
      { type: "prose", text: "When someone bets and it's your turn, you have a choice: pay to keep playing (call), or give up (fold). \"Pot odds\" compares two things — how much you have to pay, and how much you could win if you do. If the prize is big compared to the price, it's worth a shot even if you won't win every time." },
      { type: "visual", visual: "pot-odds-price" },
      { type: "heading", text: "The one question to ask" },
      { type: "prose", text: "Every pot-odds decision boils down to one question: how often do I need to win for calling to be worth it? Here's the trick — you compare what you pay to the total pile you'd be winning (including your own call going in)." },
      { type: "example", title: "Let's count it out", body: "The pot has 8bb in it. Your opponent bets 4bb. Now there's 12bb sitting there (8 + 4). To win it, you have to put in 4bb yourself. After you do, the pot is 16bb. Your 4bb is 4 out of 16 of that final pile — which is 1 out of 4, or 25%. So you need to win at least 1 in 4 times for the call to pay off." },
      { type: "visual", visual: "break-even-bar" },
      { type: "heading", text: "Why this is powerful" },
      { type: "prose", text: "Notice you don't need a great hand to call — you just need to win often enough to beat the price. When the prize is huge and the price is tiny, you can call with a weak hand that only wins now and then, and still come out ahead over many hands. When the price is high, you need a stronger hand. Pot odds tells you where that line is." },
      { type: "heading", text: "Quick shortcuts to memorize" },
      { type: "prose", text: "You don't have to do full math every time. Bet sizes snap to a few common shapes: if someone bets half the pot, you need to win about 25% of the time. A full-pot bet needs about 33%. A small quarter-pot bet only needs about 17%. A tiny price means you can call wide; a big price means you need a real hand." },
      { type: "heading", text: "The two mistakes beginners make" },
      { type: "prose", text: "First: forgetting to count your own call in the total pile — that throws the percentage off. Second: imagining your opponent has one exact hand. They don't — they have a whole range of possible hands, and you're really asking how often you beat that whole mix. Don't anchor on the one scary hand they might have." },
    ],
    drillSuggestion: "pot-odds",
  },

  // ────────────────────────────────────────────────────────────────
  {
    id: "required-equity",
    title: "Required Equity",
    subtitle: "The flip side of pot odds — what hand strength do you need?",
    estimatedMinutes: 4,
    sections: [
      { type: "prose", text: "Pot odds tell you the price. Required equity tells you the threshold. They're the same calculation read from different directions, and being fluent in both makes the math instant at the table." },
      { type: "heading", text: "The shift in framing" },
      { type: "prose", text: "When you compute pot odds, you ask: \"What price is the pot offering?\" When you compute required equity, you ask: \"How strong does my hand need to be?\" The math is identical — required equity = call amount / pot after call. But the second framing maps directly onto your range vs villain's." },
      { type: "example", title: "Same spot, two framings", body: "You face a 6bb bet into a 12bb pot, so you're calling 6 to win 18. Pot odds say 33% required equity. Required-equity thinking says: I need a hand that has at least 33% equity against villain's betting range. Now you compare that to a real range — say AK, big pairs, and some bluffs — and decide if your specific hand clears the bar." },
      { type: "heading", text: "Where this saves you" },
      { type: "prose", text: "Most leaks live in the borderline calls. \"I have top pair, I should call\" is wrong if your top pair only has 28% equity vs villain's value-heavy range and you need 33%. The hand isn't bad; the price is bad. Folding good-looking hands in bad-priced spots is one of the largest skill differences between winning and losing tournament players." },
    ],
    drillSuggestion: "required-equity",
  },

  // ────────────────────────────────────────────────────────────────
  {
    id: "hand-vs-hand",
    title: "Hand vs Hand Equity",
    subtitle: "The matchups every player should know cold",
    estimatedMinutes: 6,
    sections: [
      { type: "prose", text: "You'll never know villain's exact hand, but you should know the equity of common matchups instantly. These are the building blocks: every range-vs-range calculation is just a weighted average of these underlying matchups." },
      { type: "heading", text: "The big four shapes" },
      { type: "list", items: [
        "Pair over pair (AA vs KK): ~80% / 20%. The under-pair is in dire shape.",
        "Overpair vs unpaired overcards (TT vs AK): ~55% / 45%. Slight favorite for the pair. The classic 'race.'",
        "Pair vs two undercards (88 vs 76s): ~80% / 20%. The pair dominates, even suited connectors.",
        "Dominated ace (AK vs AQ): ~73% / 27%. The kicker matters enormously when you share the top card.",
      ]},
      { type: "heading", text: "Surprises" },
      { type: "prose", text: "AKo vs 22 is a near coinflip — the small pair is a 51-49 favorite. AKs vs 22 actually flips to AK favored at 50.5%, because suitedness adds about a point. The lesson: small pairs are robust against big cards, regardless of feel." },
      { type: "example", title: "The race rule", body: "Any underpair vs two overcards is approximately a coinflip, slightly favoring the pair. The bigger the overcards' kicker gap and the lower the pair, the closer to 50-50. This is why short-stack all-ins with hands like 55 vs AKo are routine: you're roughly even money, and the dead money in the pot makes it +EV." },
      { type: "heading", text: "Suitedness premium" },
      { type: "prose", text: "Being suited adds about 2-4% equity in most spots. AKs vs JJ has 46% equity; AKo vs JJ has 43%. Not life-changing, but the suited combos are systematically better and the equity edge compounds across thousands of hands." },
    ],
    drillSuggestion: "hand-vs-hand",
  },

  // ────────────────────────────────────────────────────────────────
  {
    id: "outs",
    title: "Outs & The Rule of 4 and 2",
    subtitle: "Fast equity estimation on the flop and turn",
    estimatedMinutes: 4,
    sections: [
      { type: "prose", text: "An out is a card that improves your hand to a likely winner. Counting outs and converting them to equity is the most common math you'll do postflop, and the Rule of 4 and 2 makes it instant." },
      { type: "heading", text: "The rule" },
      { type: "list", items: [
        "On the flop, with two cards to come: equity ≈ outs × 4.",
        "On the turn, with one card to come: equity ≈ outs × 2.",
      ]},
      { type: "prose", text: "The rule is an approximation. The true math for flop-to-river is 1 − C(47-outs, 2) / C(47, 2). For small numbers of outs, the rule is accurate within a percentage point. For large counts (12+ outs), it overestimates by 2-3%." },
      { type: "example", title: "Common draws", body: "Flush draw (9 outs): ~36% by the river on the flop, ~18% on the turn. Open-ended straight draw (8 outs): ~32% / 16%. Gutshot (4 outs): ~16% / 8%. Flush draw + gutshot (12 outs): ~45% on the flop — almost a coinflip." },
      { type: "heading", text: "Why this matters in tournaments" },
      { type: "prose", text: "Short stack tournament play often comes down to draws facing all-in decisions. If you have 9 outs on the flop and are getting 2-to-1 on a call (need 33%), you have 36% equity — clear call. With 8 outs and getting 3-to-1 (need 25%), you have 32% — even clearer. Outs-counting is what turns 'I have a draw' into a numeric decision." },
    ],
    drillSuggestion: "outs",
  },

  // ────────────────────────────────────────────────────────────────
  {
    id: "fold-equity",
    title: "Fold Equity",
    subtitle: "The hidden source of EV in every shove",
    estimatedMinutes: 5,
    sections: [
      { type: "prose", text: "Fold equity is the chunk of EV you get from making villain fold. It's why short-stack play looks so aggressive: shoving 10bb into a 2bb pot is profitable not because your hand has 50% equity when called, but because villain folds enough to make the dead money worth more than the risk." },
      { type: "heading", text: "The breakeven formula" },
      { type: "prose", text: "Let R = the chips you risk, P = the dead money already in the pot, f = the probability villain folds, e = your equity when called. The shove is breakeven when:" },
      { type: "calc", expression: "f × P + (1−f) × (e × (R+P) − R) = 0" },
      { type: "prose", text: "Two practical reformulations: given a fold frequency, the equity-when-called you need to break even drops. Given a target equity-when-called, the fold frequency you need rises. Either way, more folds make worse hands shoveable." },
      { type: "example", title: "Concrete numbers", body: "You consider shoving 10bb into a pot of 1.5bb (blinds + antes). If villain folds 60% of the time, you only need ~28% equity when called to break even. If villain folds 80%, you need just ~10% equity — almost any two cards. This is the math behind 'any two from the SB' at 8bb." },
      { type: "heading", text: "Where it disappears" },
      { type: "prose", text: "Fold equity vanishes in two situations. First: when you're calling, not shoving — there's no further folding possible. Second: when villain has already committed enough chips that they can't fold profitably (pot-committed). Knowing when fold equity is gone is what stops you from bluff-jamming into a calling station who has already put 40% of their stack in." },
    ],
    drillSuggestion: "fold-equity",
  },

  // ────────────────────────────────────────────────────────────────
  {
    id: "icm",
    title: "ICM Basics",
    subtitle: "Why tournament chips aren't cash",
    estimatedMinutes: 6,
    sections: [
      { type: "prose", text: "A tournament chip and a cash-game chip aren't worth the same thing. In a cash game, every chip is worth its face value — a 10bb pot won is 10bb of cash earned. In a tournament, chips translate to a share of the prize pool, and that translation is nonlinear. Doubling your stack does not double your tournament equity." },
      { type: "heading", text: "The diminishing-returns curve" },
      { type: "prose", text: "Imagine four players left in a tournament with prizes of $1000, $600, $400, $250 ($2250 total). If all four have equal stacks, each is worth $2250/4 = $562.50 in equity. Now if one player doubles up — say to 2x stack while others split the loss — their equity rises, but not to 2x. They might go from $562 to $850, not $1125. The same chips win you less prize money on the way up than they cost you on the way down." },
      { type: "heading", text: "Practical consequence: calls tighten" },
      { type: "prose", text: "Because losing chips hurts more than winning them helps, you should be more reluctant to risk your stack near a pay jump. This affects calling ranges far more than pushing ranges — when you push, you have fold equity (which doesn't cost you chips); when you call, you don't. A hand like AJo that's a clear chip-EV call at 12bb can become a clear tournament-EV fold on the bubble." },
      { type: "example", title: "The bubble premium", body: "On the money bubble, a marginal chip-EV +0.5bb call can be a tournament-EV −2bb call. The 0.5bb you win in chip equity is worth less than the 2bb you lose in tournament equity, because busting forfeits your share of the min-cash. Bubble strategy isn't 'play tight' — it's 'play correctly for the new payouts, which happen to require tightening calls.'" },
      { type: "heading", text: "When ICM matters most" },
      { type: "prose", text: "ICM pressure scales with the size of pay jumps relative to remaining stacks. Early in a tournament with flat early payouts, ICM is nearly irrelevant. Approaching the final table with massive pay jumps ahead, it dominates every decision. The Custom ICM tab in this app computes exact ICM equity given your stacks and payouts — use it on real tournament situations to see the math in concrete dollars." },
    ],
    drillSuggestion: null,
  },

  // ────────────────────────────────────────────────────────────────
  {
    id: "putting-it-together",
    title: "Short-Stack Strategy",
    subtitle: "Synthesizing position, odds, equity, fold equity, and ICM",
    estimatedMinutes: 5,
    sections: [
      { type: "prose", text: "Everything you've read connects in the short-stack shove-or-fold decision. This lesson is the synthesis." },
      { type: "heading", text: "The pre-decision checklist" },
      { type: "list", items: [
        "What's my stack depth? (Determines whether shove-or-fold is even the right framework.)",
        "What's my position? (Determines how many hands can wake up behind me.)",
        "What's my hand's raw equity vs likely calling ranges?",
        "What's my fold equity? (How wide does villain need to call to make me indifferent?)",
        "What stage am I at? (Chip-EV mid-tournament play vs ICM-pressured bubble play.)",
      ]},
      { type: "heading", text: "Why Nash works for short stacks" },
      { type: "prose", text: "At under 15bb effective, the strategic complexity of postflop play disappears — most shoves resolve preflop or in a forced postflop spot. This is why Nash equilibrium charts are reliable for short-stack play: there's no postflop variance to muddy the math. The same charts fail at 50bb because the players can outplay each other after the flop." },
      { type: "heading", text: "Putting the trainer to work" },
      { type: "prose", text: "Drill the Open Shove mode with coaching ON until you can predict the verdict before you click. Switch coaching OFF and grind for accuracy. Then switch to Call mode — your most common mistakes will probably be there, because calls feel scarier than shoves but are mechanically simpler decisions. Finally, drill Reshove mode at deeper stacks where most of the EV gap between players lives." },
      { type: "example", title: "The honest truth", body: "Reading lessons builds vocabulary. Doing drills builds reflexes. Playing real hands builds intuition. You need all three, in that order, and you need to keep doing all three for years. There is no shortcut — but the trainer is designed to compress the second step so the third step pays off faster." },
    ],
    drillSuggestion: null,
  },
];

export function getLesson(id) {
  return LESSONS.find(l => l.id === id);
}
