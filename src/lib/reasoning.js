// Templated coaching text for the "before" and "after" decision panels.
// Pure functions of (position, hand, stack, stage, ...) — easy to swap out
// for LLM-generated content later by keeping the same shape.

import { POSITION_LABELS } from "../data/tableConfigs.js";
import { ICM_STAGES } from "../data/icmStages.js";
import { getRfiFrequency, gradeRfiAction, primaryAction } from "../data/rfiRanges.js";
import { rankCategory, playersBehind } from "./handUtils.js";
import {
  getMaxPushBB, getMaxCallBB, getMaxReshoveBB,
  optimalPushAction, optimalCallAction, optimalReshoveAction,
} from "./decisionLogic.js";

// ---------- PUSH ----------

export function pushBefore(position, hand, stackBB, seatCount, stage /* , customMult */) {
  const cat = rankCategory(hand);
  const behind = playersBehind(position, seatCount);
  const stageInfo = ICM_STAGES[stage];

  let stackContext;
  if (stackBB <= 8) stackContext = "critical short-stack territory — every orbit costs ~1.5bb and your fold equity is fading";
  else if (stackBB <= 12) stackContext = "the classic shove-or-fold zone";
  else stackContext = "the upper shove zone — open-raising is viable but jamming keeps it simple";

  let positionContext;
  if (position === "SB") positionContext = "From the SB only one player can wake up, and you have 0.5bb invested — wide range";
  else if (position === "BTN") positionContext = "From the BTN both blinds defend imperfectly — wide range";
  else if (position === "CO") positionContext = `From CO with ${behind} players behind — wider than HJ, tighter than BTN`;
  else if (position === "HJ") positionContext = `From HJ with ${behind} players behind — be selective`;
  else positionContext = `From ${position} with ${behind} players behind — tight range`;

  return {
    setup: `${stackBB}bb in ${position} with ${cat} (${hand}). ${behind} player${behind === 1 ? "" : "s"} behind.`,
    stack: stackContext,
    position: positionContext,
    icm: stage !== "CHIP_EV" ? `${stageInfo.label}: ${stageInfo.description}` : null,
    question: "At this depth and stage, does equity-when-called + fold equity beat folding?",
  };
}

export function pushAfter(position, hand, stackBB, chosen, stage, customMult) {
  const correct = optimalPushAction(position, hand, stackBB, stage, customMult);
  const max = getMaxPushBB(position, hand, stage, customMult);
  const m = max - stackBB;
  const verdict = chosen === correct ? "correct" : "mistake";
  let why;
  if (correct === "shove") {
    why = m >= 5
      ? `${hand} is a clear shove — threshold ${max.toFixed(1)}bb vs your ${stackBB}bb.`
      : `${hand} is a thin but +EV shove — threshold ${max.toFixed(1)}bb vs ${stackBB}bb, ${m.toFixed(1)}bb cushion.`;
  } else {
    why = m <= -5
      ? `${hand} is a clear fold — threshold only ${max.toFixed(1)}bb at this stage.`
      : `${hand} is a close fold — threshold ${max.toFixed(1)}bb vs ${stackBB}bb (${(-m).toFixed(1)}bb over).`;
  }
  const icmNote = stage !== "CHIP_EV"
    ? `${ICM_STAGES[stage].label}: thresholds adjusted for tournament equity, not just chip EV.`
    : null;
  let lesson;
  if (chosen !== correct && correct === "shove") lesson = "Folding profitable shoves is the #1 short-stack leak.";
  else if (chosen !== correct && correct === "fold") lesson = "Over-shoving marginal hands burns equity. Patience now, pressure later.";
  else if (chosen === correct && correct === "shove") lesson = "Short-stack MTT is math. Trust the threshold.";
  else lesson = "Disciplined fold preserves stack for higher-EV spots.";
  return { verdict, correct, why, lesson, max, icmNote };
}

// ---------- CALL ----------

export function callBefore(heroPos, shoverPos, hand, stackBB, seatCount, stage /* , customMult */) {
  const cat = rankCategory(hand);
  const stageInfo = ICM_STAGES[stage];
  const requiredEquity = Math.round((stackBB / (stackBB * 2 + 1.5)) * 100);

  let positionContext = heroPos === "BB"
    ? "From BB you have 1bb invested — slightly better pot odds"
    : heroPos === "SB"
      ? "From SB — sandwiched, BB still behind, no fold equity"
      : `From ${heroPos} — calling with no fold equity, pure equity vs range`;

  let shoverContext = shoverPos === "BTN" || shoverPos === "CO"
    ? `${shoverPos} shoves wide — your call range stays reasonably wide`
    : shoverPos === "SB"
      ? "SB shoves very wide — call wider than instinct says"
      : `${shoverPos} shoves tight — call threshold tightens`;

  return {
    setup: `${shoverPos} shoves ${stackBB}bb. You're ${heroPos} with ${cat} (${hand}).`,
    potOdds: `Risking ${stackBB}bb to win ~${(stackBB + 1.5).toFixed(1)}bb. Required equity ≈ ${requiredEquity}%.`,
    position: positionContext,
    shover: shoverContext,
    icm: stage !== "CHIP_EV"
      ? `${stageInfo.label}: calls tighten dramatically — tournament life is worth more than chips.`
      : null,
    question: `Do I have ~${requiredEquity}% equity vs their shoving range?`,
  };
}

export function callAfter(heroPos, shoverPos, hand, stackBB, chosen, stage, customMult) {
  const correct = optimalCallAction(heroPos, shoverPos, hand, stackBB, stage, customMult);
  const max = getMaxCallBB(heroPos, shoverPos, hand, stage, customMult);
  const m = max - stackBB;
  const verdict = chosen === correct ? "correct" : "mistake";
  let why;
  if (correct === "call") {
    why = m >= 5
      ? `${hand} is a clear call — threshold ${max.toFixed(1)}bb vs ${stackBB}bb. Enough equity to beat the price.`
      : `${hand} is a thin but +EV call — threshold ${max.toFixed(1)}bb, only ${m.toFixed(1)}bb cushion.`;
  } else {
    why = m <= -5
      ? `${hand} is a clear fold — threshold only ${max.toFixed(1)}bb. Not enough equity for the price.`
      : `${hand} is a close fold — threshold ${max.toFixed(1)}bb vs ${stackBB}bb (${(-m).toFixed(1)}bb over).`;
  }
  const icmNote = stage !== "CHIP_EV"
    ? `Near the money, calls tighten dramatically. Hands like AJo and small pairs become folds.`
    : null;
  let lesson;
  if (chosen !== correct && correct === "call") lesson = "If the math says call, call. Marginal +EV calls compound.";
  else if (chosen !== correct && correct === "fold") lesson = (stage === "BUBBLE" || stage === "FT")
    ? "Near the money, hero calls that 'feel right' often aren't. ICM is brutal on calls."
    : "Calling too wide vs short-stack shoves is a major leak.";
  else if (chosen === correct && correct === "call") lesson = "Good call. Pot odds + equity > price = call.";
  else lesson = "Good fold. Discipline preserves equity.";
  return { verdict, correct, why, lesson, max, icmNote };
}

// ---------- RESHOVE ----------

export function reshoveBefore(heroPos, raiserPos, hand, stackBB, seatCount, stage /* , customMult */) {
  const cat = rankCategory(hand);
  const stageInfo = ICM_STAGES[stage];

  return {
    setup: `${raiserPos} min-raises to 2bb. You're ${heroPos} with ${stackBB}bb and ${cat} (${hand}).`,
    potOdds: `~3.5bb of dead money in the pot. Your jam needs to fold out villain's marginal hands OR have equity when called.`,
    position: heroPos === "BB"
      ? "From BB you already have 1bb invested — reshoving threshold widens"
      : heroPos === "SB"
        ? "From SB you have 0.5bb invested, plus you sit between raiser and BB"
        : `From ${heroPos} — reshoving cold, no prior investment`,
    raiser: raiserPos === "BTN" || raiserPos === "CO" || raiserPos === "SB"
      ? `${raiserPos} opens wide — they fold a lot to jams`
      : `${raiserPos} opens tight — they call jams more often, reshove tighter`,
    icm: stage !== "CHIP_EV"
      ? `${stageInfo.label}: reshove range tightens — losing the flip costs tournament equity.`
      : null,
    question: "Does fold equity + equity-when-called justify risking my whole stack here?",
  };
}

export function reshoveAfter(heroPos, raiserPos, hand, stackBB, chosen, stage, customMult) {
  const correct = optimalReshoveAction(heroPos, raiserPos, hand, stackBB, stage, customMult);
  const max = getMaxReshoveBB(heroPos, raiserPos, hand, stage, customMult);
  const m = max - stackBB;
  const verdict = chosen === correct ? "correct" : "mistake";
  let why;
  if (correct === "shove") {
    why = m >= 5
      ? `${hand} is a clear reshove — threshold ${max.toFixed(1)}bb vs ${stackBB}bb. Fold equity + dead money make this print.`
      : `${hand} is a thin reshove — threshold ${max.toFixed(1)}bb, ${m.toFixed(1)}bb cushion. Reshove ranges are tighter than open-shove because villain has a real range.`;
  } else {
    why = m <= -5
      ? `${hand} is a clear fold — threshold only ${max.toFixed(1)}bb. Reshoving here gets called too often by hands that crush you.`
      : `${hand} is a close fold — threshold ${max.toFixed(1)}bb vs ${stackBB}bb (${(-m).toFixed(1)}bb over). Reshove math is brutal: villain's calling range is strong.`;
  }
  const icmNote = stage !== "CHIP_EV"
    ? `Reshoves carry ICM weight: you risk a whole stack to win ~3.5bb of dead money. Late-stage reshoves should be tighter.`
    : null;
  let lesson;
  if (chosen !== correct && correct === "shove") lesson = "Reshoving denies villain's equity realization. When the math is there, take it.";
  else if (chosen !== correct && correct === "fold") lesson = "Reshoving too wide is a common 12-20bb leak. Villain's open is real; their calling range is real.";
  else if (chosen === correct && correct === "shove") lesson = "Good reshove. Dead money + fold equity > equity loss when called.";
  else lesson = "Good fold. Save the stack for a better spot than a coin flip.";
  return { verdict, correct, why, lesson, max, icmNote };
}

// ---------- OPEN RAISE (RFI, medium stack) ----------

export function openRaiseBefore(position, hand, stackBB, seatCount, stage) {
  const cat = rankCategory(hand);
  const behind = playersBehind(position, seatCount);
  const stageInfo = ICM_STAGES[stage];

  // Is hero the first to act preflop?
  const firstToActMap = { 2: "SB", 3: "BTN", 6: "UTG", 9: "UTG" };
  const isFirstToAct = position === firstToActMap[seatCount];

  let stackContext;
  if (stackBB <= 22) stackContext = "the bottom of the medium-stack range — raising and shoving both come into play, with shoves slightly more frequent on premium hands";
  else if (stackBB <= 30) stackContext = "the heart of the medium-stack RFI range — raising is your default, with a handful of premium hands mixing in shoves";
  else stackContext = "deeper medium-stack play — almost everything you play is a raise; shoves are rare for balance reasons";

  let positionContext;
  if (position === "BTN") positionContext = "From the BTN you have the widest opening range — both blinds defend imperfectly and you have position post-flop";
  else if (position === "CO") positionContext = "From the CO you're opening wide but tighter than BTN — three players behind, all of whom can wake up with a real hand";
  else if (position === "HJ") positionContext = "From the HJ you should be more selective — four players behind, range tightens noticeably";
  else if (position === "SB") positionContext = isFirstToAct
    ? "From the SB you're first to act preflop in HU play — open very wide, including some shoves for balance"
    : "From the SB only the BB is left, and you have half a blind invested — open wide, including some shoves for balance";
  else if (position === "UTG" || position === "UTG1") positionContext = `From ${position} you're first to act preflop with ${behind} players behind. UTG opens the action and faces the most players, so your range here is the tightest — premium pairs, strong broadways, suited aces`;
  else positionContext = `From ${position} with ${behind} players behind, your range should be tight and value-heavy`;

  // Phrase the setup correctly depending on whether hero opens the action.
  const setupPhrase = isFirstToAct
    ? "You're first to act preflop."
    : "Folded to you.";

  return {
    setup: `${stackBB}bb in ${position} with ${cat} (${hand}). ${behind} player${behind === 1 ? "" : "s"} behind. ${setupPhrase}`,
    stack: stackContext,
    position: positionContext,
    icm: stage !== "CHIP_EV" ? `${stageInfo.label}: ${stageInfo.description}` : null,
    question: "Raise (build a pot with skill edge), shove (max fold equity, no postflop), or fold (avoid a marginal spot)?",
  };
}

export function openRaiseAfter(position, hand, stackBB, chosen, stage) {
  const freq = getRfiFrequency(position, hand);
  const grade = gradeRfiAction(chosen, freq);
  const optimal = primaryAction(freq);
  const verdict = grade === "exact" ? "correct" : grade === "close" ? "close" : "mistake";

  // Build the freq display string
  const freqParts = [];
  if (freq.raise > 0) freqParts.push(`Raise ${Math.round(freq.raise * 100)}%`);
  if (freq.shove > 0) freqParts.push(`Shove ${Math.round(freq.shove * 100)}%`);
  if (freq.fold > 0) freqParts.push(`Fold ${Math.round(freq.fold * 100)}%`);
  const freqString = freqParts.join(" · ");

  let why;
  if (grade === "exact") {
    why = `Good — ${hand} from ${position} primarily plays as a ${optimal} (${Math.round(freq[optimal] * 100)}% of the time at this depth).`;
  } else if (grade === "close") {
    why = `Not the primary action, but defensible — GTO does ${chosen} ${Math.round(freq[chosen] * 100)}% of the time with ${hand} here. The most-frequent action is ${optimal} (${Math.round(freq[optimal] * 100)}%).`;
  } else {
    why = `${chosen} isn't part of the GTO strategy with ${hand} from ${position} at ${stackBB}bb. The right action is ${optimal} (${Math.round(freq[optimal] * 100)}%).`;
  }

  let lesson;
  if (grade === "exact") {
    lesson = "Locked in — keep building pattern recognition on similar spots.";
  } else if (grade === "close") {
    lesson = "Mixed strategies are real. Both 'right' actions exist for the same hand; the goal is recognizing which mix this hand is in, not picking 'the' answer.";
  } else if (chosen === "fold" && optimal !== "fold") {
    lesson = "Folding too tight is the most common beginner leak. If you're not in the range I just showed you, you're leaving money on the table.";
  } else if (chosen === "shove" && optimal === "raise") {
    lesson = "Shoving here flattens your strategy — you lose your skill edge by skipping postflop play. Save shoves for short stacks or premium hands at depth.";
  } else {
    lesson = "Range discipline matters more than any single hand. Review the range grid (button below) to see where this hand fits.";
  }

  return {
    verdict, correct: optimal, why, lesson,
    grade, freq, freqString,
    max: null,
    icmNote: stage !== "CHIP_EV"
      ? `${ICM_STAGES[stage].label}: at depth, ICM mostly tightens the calling/3-betting tree more than the opening range itself.`
      : null,
  };
}

// ---------- 3-BET DEFENSE (you opened, got 3-bet) ----------

import {
  getDefenseFrequency, gradeDefenseAction, primaryDefenseAction,
} from "../data/threeBetDefenseRanges.js";

export function threeBetDefenseBefore(heroPos, threeBettorPos, hand, stackBB, stage) {
  const cat = rankCategory(hand);
  const stageInfo = ICM_STAGES[stage];

  let setup = `${stackBB}bb effective. You raised from ${heroPos} with ${cat} (${hand}). ${threeBettorPos} 3-bet you.`;

  let positionContext;
  if (heroPos === "BTN") positionContext = "You opened the BTN — your widest range. Now facing a 3-bet, you need to defend wider than UTG would, because your opening range had more bluffs.";
  else if (heroPos === "CO") positionContext = "You opened from CO — a wide range. Defense should be value-heavy with some bluff 4-bets in the mix (small suited aces work well).";
  else if (heroPos === "HJ") positionContext = "You opened from HJ — relatively tight. Most marginal hands fold to a 3-bet; the value range is JJ+, AQ+ for 4-bets.";
  else if (heroPos === "UTG") positionContext = "You opened from UTG — your tightest range. 3-bet defense is also tight: this is mostly 'have a premium and 4-bet, or have a strong call, or fold'.";
  else if (heroPos === "SB") positionContext = "You opened from the SB and got 3-bet by the BB — you're out of position post-flop with no skill edge from position. Defense ranges tighten because of this.";

  let threeBettorContext;
  if (threeBettorPos === "SB") threeBettorContext = "SB 3-bets from out of position — their range skews toward value (premiums + suited aces) with limited bluffs.";
  else if (threeBettorPos === "BB") threeBettorContext = "BB 3-bets from out of position too, but defends a wider range with bluffs sprinkled in — slightly more inclined to call.";

  let stackContext;
  if (stackBB <= 28) stackContext = "Around 25bb — your '4-bet' button is effectively all-in (a small 4-bet doesn't have stack-to-pot leverage at this depth).";
  else if (stackBB <= 33) stackContext = "At 30bb you can make small 4-bets, but most 4-bets here are still shoves for simplicity.";
  else stackContext = "At 35bb+ small non-allin 4-bets become viable — they fold out bluffs while keeping value hands stuck.";

  return {
    setup,
    note: "This is a preflop decision — you haven't seen a flop yet. If you call here, you go to the flop next (we don't simulate that yet); if you 4-bet or fold, the hand ends here.",
    position: positionContext,
    threeBettor: threeBettorContext,
    stack: stackContext,
    icm: stage !== "CHIP_EV" ? `${stageInfo.label}: ${stageInfo.description}. ICM tightens 4-bet ranges (calling and folding gain value over 4-betting).` : null,
    question: "Fold, call (see a flop with skill edge or position), or 4-bet/shove (apply pressure with value or as a bluff)?",
  };
}

export function threeBetDefenseAfter(heroPos, threeBettorPos, hand, stackBB, chosen, stage) {
  const freq = getDefenseFrequency(heroPos, threeBettorPos, hand);
  const grade = gradeDefenseAction(chosen, freq);
  const optimal = primaryDefenseAction(freq);
  const verdict = grade === "exact" ? "correct" : grade === "close" ? "close" : "mistake";

  const freqParts = [];
  if (freq.fold > 0) freqParts.push(`Fold ${Math.round(freq.fold * 100)}%`);
  if (freq.call > 0) freqParts.push(`Call ${Math.round(freq.call * 100)}%`);
  if (freq.fourBet > 0) freqParts.push(`4-bet ${Math.round(freq.fourBet * 100)}%`);
  const freqString = freqParts.join(" · ");

  const actionWord = a => a === "fourBet" ? "4-bet/shove" : a;
  let why;
  if (grade === "exact") {
    why = `Good — ${hand} primarily plays as a ${actionWord(optimal)} (${Math.round(freq[optimal] * 100)}%) when ${heroPos} gets 3-bet by ${threeBettorPos}.`;
  } else if (grade === "close") {
    why = `Defensible — GTO mixes ${actionWord(chosen)} ${Math.round(freq[chosen] * 100)}% of the time here. The primary action is ${actionWord(optimal)} (${Math.round(freq[optimal] * 100)}%).`;
  } else {
    why = `${actionWord(chosen)} isn't in the GTO strategy with ${hand} from ${heroPos} vs ${threeBettorPos}'s 3-bet. The right play is ${actionWord(optimal)} (${Math.round(freq[optimal] * 100)}%).`;
  }

  let lesson;
  if (grade === "exact") {
    lesson = "Locked in. 3-bet defense is one of the highest-EV preflop skills — most beginners over-fold here.";
  } else if (grade === "close") {
    lesson = "Mixed strategy. Both your action and the primary one are in the GTO mix — focus on knowing which hands are 'pure 4-bet' vs 'mixed' vs 'pure call'.";
  } else if (chosen === "fold" && optimal !== "fold") {
    lesson = "Over-folding to 3-bets is the biggest beginner leak in this spot. You opened with a hand strong enough to play — that hand often still has equity to call or 4-bet.";
  } else if (chosen === "fourBet" && optimal === "call") {
    lesson = "This hand plays better as a call — it has good equity but loses value when stacks go in (dominated by 4-bet/call range of villain).";
  } else if (chosen === "call" && optimal === "fourBet") {
    lesson = "Strong enough to 4-bet, not just call. Calling lets villain realize equity cheaply with their bluffs; 4-betting denies that.";
  } else {
    lesson = "Range discipline matters. Check the range grid (button below) to see where this hand fits.";
  }

  return {
    verdict, correct: optimal, why, lesson,
    grade, freq, freqString,
    max: null,
    icmNote: stage !== "CHIP_EV"
      ? `${ICM_STAGES[stage].label}: ICM pressure further tightens 4-bet ranges — pure calls become slightly more attractive.`
      : null,
  };
}
